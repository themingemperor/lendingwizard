// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};
//Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Configure email link settings
const actionCodeSettings = {
    url: `${window.location.origin}/password-setup`,
    handleCodeInApp: true,
};

// Connect to emulators if in development mode
if (process.env.NODE_ENV === 'development') {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8081);
}

export { 
    db, 
    auth, 
    googleProvider, 
    sendSignInLinkToEmail, 
    isSignInWithEmailLink, 
    signInWithEmailLink,
    actionCodeSettings 
};