const test = require('firebase-functions-test')();
const admin = require('firebase-admin');
const sinon = require('sinon');

// Import the functions to test
const { helloWorld, handleUserCreation } = require('./index');

describe('Firebase Functions', () => {
  let adminInitStub;
  let setStub;

  before(() => {
    // Stub admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp');
    
    // Stub Firestore set method for user creation
    setStub = sinon.stub(admin.firestore().collection('users').doc(), 'set');
  });

  after(() => {
    // Restore stubs
    adminInitStub.restore();
    setStub.restore();
    test.cleanup();
  });

  describe('helloWorld', () => {
    it('should return "Hello from Firebase!"', async () => {
      // Create a wrapped function
      const wrapped = test.wrap(helloWorld);
      
      // Create mock request and response
      const req = {};
      const res = {
        send: sinon.stub()
      };
      
      // Call the function
      await wrapped(req, res);

      // Verify that send was called with the correct message
      sinon.assert.calledWith(res.send, "Hello from Firebase!");
    });
  });

  describe('handleUserCreation', () => {
    it('should create a user profile when a new user is created', async () => {
      // Create a test user
      const testUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
        providerData: [{ providerId: 'google.com' }]
      };

      // Create a wrapped function
      const wrapped = test.wrap(handleUserCreation);
      
      // Call the function
      await wrapped(testUser);

      // Verify that set was called with the correct data
      sinon.assert.calledWith(setStub, {
        email: testUser.email,
        displayName: testUser.displayName,
        photoURL: testUser.photoURL,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isActive: true,
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        provider: 'google.com'
      });
    });
  });
});
