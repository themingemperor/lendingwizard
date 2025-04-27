// src/Views/HomePage.js
import React, { useState } from 'react';
import './HomePage.css';

import Hero from './Hero.js';
import AboutLW from '../components/AboutLW';
import PriceLW from '../components/PriceLW';
import FAQLW from '../components/FAQLW';
import FooterLW from '../components/FooterLW';

const HomePage = () => {
    return (
        <div className="main-container">
            <Hero />
            <AboutLW />
            <PriceLW />
            <FAQLW />
            <FooterLW />
        </div>
    );
};

export default HomePage;