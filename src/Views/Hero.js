import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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

  const handleGoogleSignUp = () => {
    try {
      const googleSignInUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/google/callback&response_type=code&scope=email profile`;
      window.open(googleSignInUrl, '_blank');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      const password = Math.random().toString(36).slice(-8);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
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
              Continue with Google
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
              <button type='submit' className='hero-email-btn'>Continue with email</button>
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