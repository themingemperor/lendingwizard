import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import './SignInPage.css';
import lwhplogo from '../assets/images/logo512.png';
import lwhp1stimage from '../assets/images/hero-page-1st-image.PNG';
import lwhp2ndimage from '../assets/images/hero-page-2nd-image.PNG';
import lwhp3rdimage from '../assets/images/hero-page-3rd-image.PNG';
import lwhp4thimage from '../assets/images/hero-page-4th-image.PNG';
import lwhpgoogleIcon from '../assets/images/Google-favicon-2015.png';

const slides = [lwhp1stimage, lwhp2ndimage, lwhp3rdimage, lwhp4thimage];

const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <section className='signin-container'>
            <div className='signin-left'>
                <img src={lwhplogo} alt='Lending Wizard Logo' className='signin-logo' />
                <div className='signin-center-content'>
                    <h1 className='signin-title'>Welcome back</h1>
                    <p className='signin-subtitle'>Sign in to continue to your account</p>
                    <div className='signin-auth-box'>
                        <button className='signin-google-btn' onClick={handleGoogleSignIn}>
                            <img src={lwhpgoogleIcon} alt='Google icon' className='google-icon' />
                            Continue with Google
                        </button>
                        <span className='signin-or'>or</span>
                        <form onSubmit={handleEmailSignIn}>
                            <input
                                type='email'
                                placeholder='Enter your email'
                                className='signin-input'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type='password'
                                placeholder='Enter your password'
                                className='signin-input'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {error && <p className='error-message'>{error}</p>}
                            <button type='submit' className='signin-email-btn'>
                                Sign In with Email
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className='signin-right'>
                <div className='signin-slideshow-box'>
                    <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} className='signin-slide-image' />
                    <div className='signin-dots'>
                        {slides.map((_, index) => (
                            <span
                                key={index}
                                className={`signin-dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => handleDotClick(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignInPage;
