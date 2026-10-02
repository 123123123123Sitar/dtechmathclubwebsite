import admin from "firebase-admin";

const apply = process.argv.includes("--apply");
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error("Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY first.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();
const auth = admin.auth();
const cache = new Map();
async function uidFor(email) {
  const key = String(email || "").trim().toLowerCase();
  if (!key) return null;
  if (!cache.has(key)) {
    cache.set(key, auth.getUserByEmail(key).then((user) => user.uid).catch((error) => {
      if (error.code === "auth/user-not-found") return null;
      throw error;
    }));
  }
  return cache.get(key);
}

const [users, submissions] = await Promise.all([
  db.collection("users").get(),
  db.collection("submissions").get(),
]);
const changes = [];
const privilegedUsers = [];
const unresolvedOwners = [];

for (const snapshot of users.docs) {
  const record = snapshot.data();
  if (record.isAdmin === true || record.isGrader === true) {
    privilegedUsers.push({ id: snapshot.id, email: record.email || "(no email)", admin: record.isAdmin === true, grader: record.isGrader === true });
  }
  const uid = await uidFor(record.email);
  if (!uid || uid === snapshot.id) continue;
  const direct = await db.collection("users").doc(uid).get();
  if (direct.exists) continue;
  const { isAdmin: _admin, isGrader: _grader, ...safeRecord } = record;
  changes.push({ ref: db.collection("users").doc(uid), data: { ...safeRecord, isAdmin: false, isGrader: false }, merge: false });
}

for (const snapshot of submissions.docs) {
  const record = snapshot.data();
  const uid = await uidFor(record.studentEmail);
  if (!uid) unresolvedOwners.push({ id: snapshot.id, email: record.studentEmail || "(no email)" });
  if (!uid || record.userId === uid) continue;
  changes.push({ ref: snapshot.ref, data: { userId: uid }, merge: true });
}

console.log(`${changes.length} ownership changes found. ${apply ? "Applying." : "Dry run only; pass --apply to write."}`);
console.log(`Existing privileged user records (${privilegedUsers.length}):`);
for (const role of privilegedUsers) console.log(`  ${role.email} [${role.id}] admin=${role.admin} grader=${role.grader}`);
console.log(`Submissions without a matching Authentication user (${unresolvedOwners.length}):`);
for (const owner of unresolvedOwners) console.log(`  ${owner.id}: ${owner.email}`);
if (apply) {
  for (let offset = 0; offset < changes.length; offset += 400) {
    const batch = db.batch();
    for (const change of changes.slice(offset, offset + 400)) {
      batch.set(change.ref, change.data, { merge: change.merge });
    }
    await batch.commit();
  }
  console.log("Ownership migration complete. Grant admin and grader roles separately after review.");
}
