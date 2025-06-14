import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAmS-hGx2zVlrSQbuejqgWN-v9-ElL2zEI",
  authDomain: "sahyog-database.firebaseapp.com",
  projectId: "sahyog-database",
  storageBucket: "sahyog-database.firebasestorage.app",
  messagingSenderId: "199991287345",
  appId: "1:199991287345:web:ec625c270187a3ad40bf10",
  measurementId: "G-875P1P51YR"
};


const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)