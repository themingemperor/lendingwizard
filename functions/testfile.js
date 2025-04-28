const test = require('firebase-functions-test')();
const admin = require('firebase-admin');
const sinon = require('sinon');

// Import the function to test
const { createUserProfile } = require('./index');

describe('createUserProfile', () => {
  let adminInitStub;
  let setStub;

  before(() => {
    // Stub admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp');
    
    // Stub Firestore set method
    setStub = sinon.stub(admin.firestore().collection('users').doc(), 'set');
  });

  after(() => {
    // Restore stubs
    adminInitStub.restore();
    setStub.restore();
    test.cleanup();
  });

  it('should create a user profile when a new user is created', async () => {
    // Create a test user
    const testUser = {
      uid: 'test-uid',
      email: 'test@example.com'
    };

    // Create a wrapped function
    const wrapped = test.wrap(createUserProfile);
    
    // Call the function
    await wrapped(testUser);

    // Verify that set was called with the correct data
    sinon.assert.calledWith(setStub, {
      email: testUser.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    });
  });
});
