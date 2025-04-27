import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                // Get the authorization code from the URL
                const params = new URLSearchParams(location.search);
                const code = params.get('code');

                if (code) {
                    // Exchange the code for a credential
                    const credential = GoogleAuthProvider.credential(null, code);
                    await signInWithCredential(auth, credential);
                    
                    // Close the popup window and redirect the main window
                    window.opener.postMessage({ type: 'AUTH_SUCCESS' }, window.location.origin);
                    window.close();
                }
            } catch (error) {
                console.error('Google authentication error:', error);
                window.opener.postMessage({ type: 'AUTH_ERROR', error: error.message }, window.location.origin);
                window.close();
            }
        };

        handleGoogleCallback();
    }, [location]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            backgroundColor: '#fefcf9'
        }}>
            <p>Completing authentication...</p>
        </div>
    );
};

export default GoogleCallback; 