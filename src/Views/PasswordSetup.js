import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { confirmPasswordReset, verifyPasswordResetCode, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import PasswordInput from '../components/PasswordInput';
import './PasswordSetup.css';

const PasswordSetup = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isResetFlow, setIsResetFlow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if this is a password reset flow
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const actionCode = urlParams.get('oobCode');

        if (mode === 'resetPassword' && actionCode) {
            setIsResetFlow(true);
            // Verify the password reset code
            verifyPasswordResetCode(auth, actionCode)
                .catch((error) => {
                    setError('Invalid or expired password reset link.');
                    console.error('Password reset verification error:', error);
                });
        }
    }, []);

    const handlePasswordSetup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const actionCode = urlParams.get('oobCode');

            if (isResetFlow && actionCode) {
                // Handle password reset
                await confirmPasswordReset(auth, actionCode, password);
                navigate('/signin');
            } else {
                // Handle initial password setup
                const email = window.localStorage.getItem('emailForSignIn');
                if (!email) {
                    setError('No email found for password setup');
                    return;
                }

                try {
                    // Try to create a new user
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    console.log('User created successfully:', userCredential.user);
                    navigate('/dashboard');
                } catch (error) {
                    if (error.code === 'auth/email-already-in-use') {
                        // If user already exists, try to sign in
                        try {
                            const userCredential = await signInWithEmailAndPassword(auth, email, password);
                            console.log('User signed in successfully:', userCredential.user);
                            navigate('/dashboard');
                        } catch (signInError) {
                            setError(signInError.message);
                        }
                    } else {
                        setError(error.message);
                    }
                }
            }
        } catch (error) {
            console.error('Password setup error:', error);
            setError(error.message);
        }
    };

    return (
        <div className="password-setup-container">
            <div className="password-setup-box">
                <h2>{isResetFlow ? 'Reset Your Password' : 'Create Your Password'}</h2>
                <form onSubmit={handlePasswordSetup}>
                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                    <PasswordInput
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">
                        {isResetFlow ? 'Reset Password' : 'Set Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordSetup; 