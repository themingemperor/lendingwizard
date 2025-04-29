/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//    logger.info("Hello logs!", {structuredData: true});
//    response.send("Hello from Firebase!");
//  });

// Auth trigger for new user creation
exports.handleUserCreation = functions.auth.user().onCreate(async (user) => {
  try {
    console.log('Creating Firestore document for user:', user.uid);
    
    // Store user data in Firestore
    await admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      provider: user.providerData[0]?.providerId || 'google.com'
    });

    console.log('Successfully created Firestore document for user:', user.uid);
    return null;
  } catch (error) {
    console.error('Error in handleUserCreation:', error);
    throw new Error('Error creating user profile');
  }
});
