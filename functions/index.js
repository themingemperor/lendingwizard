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
    // Store user data in Firestore
    await admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send welcome email
    const mailOptions = {
      from: `Lending Wizard <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: 'Welcome to Lending Wizard!',
      text: `Welcome to Lending Wizard! Your account has been created successfully.`
    };

    // Note: You'll need to set up an email service (like SendGrid) to actually send emails
    // This is just a placeholder for the email sending logic
    // await sendEmail(mailOptions);

    return null;
  } catch (error) {
    console.error('Error in handleUserCreation:', error);
    throw new functions.https.HttpsError('internal', 'Error creating user profile', error);
  }
});
