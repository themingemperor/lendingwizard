// src/firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  connectFirestoreEmulator,
  setDoc,
  enableIndexedDbPersistence,
  collection,
  addDoc,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink, 
  connectAuthEmulator,
  onAuthStateChanged 
} from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

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

// Initialize Firestore with specific settings
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true
});

const auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Initialize Google provider
const googleProvider = new GoogleAuthProvider();
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
    console.log('Connecting to Firebase emulators...');
    try {
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectStorageEmulator(storage, 'localhost', 9199);
        connectFunctionsEmulator(functions, 'localhost', 5001);
        console.log('Successfully connected to Firebase emulators');
    } catch (error) {
        console.error('Error connecting to Firebase emulators:', error);
    }
    
    // Enable offline persistence
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.log('The current browser does not support persistence.');
        }
    });
}

// Listen for auth state changes and create user profile if needed
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            // Create main user document
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            if (!userDoc.exists()) {
                // Set main user document
                await setDoc(userRef, {
                    email: user.email,
                    createdAt: new Date()
                });

                // Set nested userProfile
                const userProfileRef = doc(collection(userRef, 'userProfile'), 'profile');
                await setDoc(userProfileRef, {
                    email: user.email,
                    displayName: user.displayName || null,
                    photoURL: user.photoURL || null,
                    createdAt: new Date(),
                    isActive: true,
                    lastLogin: new Date(),
                    provider: user.providerData[0]?.providerId || 'google.com'
                });
                
                console.log('New user and profile created in Firestore');
            }
        } catch (error) {
            console.error('Error creating user profile:', error);
        }
    }
});

export { 
    db, 
    auth, 
    storage,
    functions,
    googleProvider, 
    sendSignInLinkToEmail, 
    isSignInWithEmailLink, 
    signInWithEmailLink,
    actionCodeSettings,
    doc,
    getDoc,
    setDoc,
    collection,
    addDoc
};