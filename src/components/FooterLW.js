import React from 'react';
import './FooterLW.css';
import WhiteLogoLW from '../assets/images/WhiteLogoLW.jpg';

const FooterLW = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-sections">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <img src={WhiteLogoLW} alt="Lending Wizard Logo" />
                        </div>
                        <div className="footer-recaptcha">
                            <p>This site is protected by reCAPTCHA Enterprise. The Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
                        </div>
                    </div>

                    <div className="footer-section">
                        <div className="footer-links">
                            <a href="/product">Product</a>
                            <a href="/research">Research</a>
                            <a href="/careers">Careers</a>
                            <a href="/company">Company</a>
                            <a href="/news">News</a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <div className="footer-links">
                            <a href="/terms-of-service">Terms of service</a>
                            <a href="/privacy-policy">Privacy policy</a>
                            <a href="/privacy-choices">Your privacy choices</a>
                            <a href="/disclosure-policy">Responsible disclosure policy</a>
                            <a href="/compliance">Compliance</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterLW;
