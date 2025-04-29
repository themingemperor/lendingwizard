import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, sendSignInLinkToEmail, actionCodeSettings, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithPopup } from 'firebase/auth';
import './Hero.css';
import lwhplogo from '../assets/images/logo512.png';
import lwhp1stimage from '../assets/images/hero-page-1st-image.PNG';
import lwhp2ndimage from '../assets/images/hero-page-2nd-image.PNG';
import lwhp3rdimage from '../assets/images/hero-page-3rd-image.PNG';
import lwhp4thimage from '../assets/images/hero-page-4th-image.PNG';
import lwhpgoogleIcon from '../assets/images/Google-favicon-2015.png';

const slides = [lwhp1stimage, lwhp2ndimage, lwhp3rdimage, lwhp4thimage];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'AUTH_SUCCESS') {
        navigate('/dashboard');
      } else if (event.data.type === 'AUTH_ERROR') {
        setError(event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const handleLearnMoreClick = (e) => {
    e.preventDefault();
    const element = document.getElementById('meet-lending-wizard');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', duration: 500 });
    }
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleGoogleSignUp = async () => {
    try {
      // Create a new Google provider instance for sign-up
      const signUpProvider = new googleProvider.constructor();
      signUpProvider.setCustomParameters({
        prompt: 'select_account',
        ux_mode: 'popup',
        flow: 'signup'
      });

      // Use signInWithPopup directly without opening a new window
      const result = await signInWithPopup(auth, signUpProvider);
      
      if (result.user) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google Sign Up Error:', error);
      setError(error.message);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      // Check if user exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setError('You are already signed up! Please sign in instead.');
        return;
      }

      // Send sign-in link to email
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', email);
      setError('Check your email to complete your sign up!');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className='hero-container'>
      <div className='hero-left'>
        <img src={lwhplogo} alt='Lending Wizard Logo' className='hero-logo' />
        <div className='hero-center-content'>
          <h1 className='hero-title'>Your ideas,<br/>amplified</h1>
          <p className='hero-subtitle'>Privacy-first AI that helps you create in confidence.</p>
          <div className='hero-auth-box'>
            <button className='hero-google-btn' onClick={handleGoogleSignUp}>
              <img src={lwhpgoogleIcon} alt='Google icon' className='google-icon' />
              Sign Up with Google
            </button>
            <span className='hero-or'>or</span>
            <form onSubmit={handleEmailSignUp}>
              <input 
                type='email' 
                placeholder='Enter your personal or work email' 
                className='hero-input'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type='submit' className='hero-email-btn'>Sign Up with email</button>
              {error && <p className='error-message'>{error}</p>}
            </form>
            <p className='hero-signin-link'>
              or <span className='hero-link' onClick={handleSignInClick}>Sign In</span> if you're already a member.
            </p>
          </div>
        </div>
        <button className='hero-learn-btn' onClick={handleLearnMoreClick}>Learn more ↓</button>
      </div>

      <div className='hero-right'>
        <div className='hero-slideshow-box'>
          <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} className='hero-slide-image' />
          <div className='hero-dots'>
            {slides.map((_, index) => (
              <span
                key={index}
                className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;