import admin from "firebase-admin";

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error("Usage: FIREBASE_PROJECT_ID=... FIREBASE_CLIENT_EMAIL=... FIREBASE_PRIVATE_KEY=... node scripts/grant-admin.mjs admin@example.org");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const user = await admin.auth().getUserByEmail(email);
await admin.firestore().collection("users").doc(user.uid).set({ email, isAdmin: true }, { merge: true });
console.log(`Admin role granted to existing account ${email} (${user.uid}).`);
