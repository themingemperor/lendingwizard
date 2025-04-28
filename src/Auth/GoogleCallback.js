import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { getRedirectResult, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    // User is successfully authenticated
                    navigate('/dashboard');
                } else {
                    // Check if we have a credential in the URL
                    const params = new URLSearchParams(window.location.search);
                    const credential = GoogleAuthProvider.credentialFromURL(window.location.href);
                    
                    if (credential) {
                        // Sign in with the credential
                        await signInWithCredential(auth, credential);
                        navigate('/dashboard');
                    } else {
                        // No authentication result, redirect to home
                        navigate('/');
                    }
                }
            } catch (error) {
                console.error('Google authentication error:', error);
                navigate('/');
            }
        };

        handleRedirect();
    }, [navigate]);

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