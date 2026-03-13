import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKUKsa5G321pwX8JCkAnpvYcig33ripEo",
  authDomain: "dpotd-app.firebaseapp.com",
  projectId: "dpotd-app",
  storageBucket: "dpotd-app.appspot.com",
  messagingSenderId: "756829711322",
  appId: "1:756829711322:web:46bc121c55810cbf9f6ee3",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
