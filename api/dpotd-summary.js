import admin from "firebase-admin";

function getAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return admin;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const token = /^Bearer (.+)$/.exec(req.headers.authorization || "")?.[1];
  if (!token) return res.status(401).json({ error: "Sign in required" });

  try {
    const firebase = getAdmin();
    let viewer;
    try {
      viewer = await firebase.auth().verifyIdToken(token);
    } catch (_) {
      return res.status(401).json({ error: "Invalid sign-in token" });
    }
    const db = firebase.firestore();
    const [settings, submissions, adminUsers] = await Promise.all([
      db.collection("settings").doc("appSettings").get(),
      db.collection("submissions").get(),
      db.collection("users").where("isAdmin", "==", true).get(),
    ]);
    const adminEmails = new Set([String(settings.data()?.adminEmail || "").toLowerCase()]);
    adminUsers.forEach((snapshot) => adminEmails.add(String(snapshot.data().email || "").toLowerCase()));
    const scores = new Map();

    submissions.forEach((snapshot) => {
      const item = snapshot.data();
      const email = String(item.studentEmail || "").toLowerCase();
      if (!email || adminEmails.has(email)) return;
      const previous = scores.get(email) || {
        name: String(item.studentName || "Student"),
        totalScore: 0,
        totalTime: 0,
        completedDays: 0,
      };
      previous.totalScore += (item.q1Correct ? 4 : 0) + (item.q2Correct ? 6 : 0) + Number(item.q3Score || 0);
      previous.totalTime += Number(item.totalTime || 0);
      previous.completedDays += 1;
      scores.set(email, previous);
    });

    const sorted = [...scores.entries()].sort((left, right) =>
      right[1].totalScore - left[1].totalScore || left[1].totalTime - right[1].totalTime,
    );
    const viewerEmail = String(viewer.email || "").toLowerCase();
    const viewerIndex = sorted.findIndex(([email]) => email === viewerEmail);

    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).json({
      durationMinutes: Number(settings.data()?.testDuration || 120),
      leaderboard: sorted.slice(0, 5).map(([, value]) => ({
        name: value.name,
        totalScore: value.totalScore,
        completedDays: value.completedDays,
      })),
      rank: viewerIndex < 0 ? null : viewerIndex + 1,
      totalStudents: sorted.length,
      totalScore: viewerIndex < 0 ? 0 : sorted[viewerIndex][1].totalScore,
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to load D.PotD summary" });
  }
}
