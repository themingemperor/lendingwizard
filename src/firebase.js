// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyACDS5RzKk3AVPxwhcMrTKbdQ-Tw7vWwDw",
    authDomain: "lendingwizard-9dc3e.firebaseapp.com",
    projectId: "lendingwizard-9dc3e",
    storageBucket: "lendingwizard-9dc3e.firebasestorage.app",
    messagingSenderId: "420540897262",
    appId: "1:420540897262:web:df3b0396165ea1fc2e60ff",
    measurementId: "G-DW3J9LK1VY"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };