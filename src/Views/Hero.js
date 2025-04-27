import React, {useEffect, useState} from 'react';
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <section className='hero-container'>
      <div className='hero-left'>
        <img src={lwhplogo} alt='Lending Wizard Logo' className='hero-logo' />
        <div className='hero-center-content'>
          <h1 className='hero-title'>Your ideas,<br/>amplified</h1>
          <p className='hero-subtitle'>Privacy-first AI that helps you create in confidence.</p>
          <div className='hero-auth-box'>
            <button className='hero-google-btn'>
              <img src={lwhpgoogleIcon} alt='Google icon' className='google-icon' />
              Continue with Google
            </button>
            <span className='hero-or'>or</span>
            <input type='email' placeholder='Enter your personal or work email' className='hero-input' />
            <button className='hero-email-btn'>Continue with email</button>
            <p className='hero-disclaimer'>
              By continuing, you agree to Anthropic's <span className='hero-link'>Consumer Terms</span> and <span className='hero-link'>Usage Policy</span>, and acknowledge our <span className='hero-link'>Privacy Policy</span>.
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