import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmS-hGx2zVlrSQbuejqgWN-v9-ElL2zEI",
  authDomain: "sahyog-database.firebaseapp.com",
  projectId: "sahyog-database",
  storageBucket: "sahyog-database.appspot.com", // fix: should be .app**spot**.com
  messagingSenderId: "199991287345",
  appId: "1:199991287345:web:ec625c270187a3ad40bf10",
  measurementId: "G-875P1P51YR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
