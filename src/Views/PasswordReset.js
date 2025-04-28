import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import PasswordInput from '../components/PasswordInput';
import './PasswordReset.css';
import lwhplogo from '../assets/images/logo512.png';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            const actionCodeSettings = {
                url: `${window.location.origin}/signin`,
                handleCodeInApp: true
            };
            
            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            setSuccess('Password reset email sent! Please check your inbox.');
            setError('');
        } catch (error) {
            console.error('Password reset error:', error);
            setError(error.message);
            setSuccess('');
        }
    };

    return (
        <section className='password-reset-container'>
            <div className='password-reset-content'>
                <img src={lwhplogo} alt='Lending Wizard Logo' className='password-reset-logo' />
                <h1 className='password-reset-title'>Reset your password</h1>
                <p className='password-reset-subtitle'>Enter your email address and we'll send you a link to reset your password.</p>
                <form onSubmit={handlePasswordReset} className='password-reset-form'>
                    <input
                        type='email'
                        placeholder='Enter your email'
                        className='password-reset-input'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {error && <p className='error-message'>{error}</p>}
                    {success && <p className='success-message'>{success}</p>}
                    <button type='submit' className='password-reset-btn'>
                        Send Reset Link
                    </button>
                </form>
                <p className='password-reset-back'>
                    Remember your password? <span onClick={() => navigate('/signin')}>Sign in</span>
                </p>
            </div>
        </section>
    );
};

export default PasswordReset; 