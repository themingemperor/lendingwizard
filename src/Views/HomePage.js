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
        <>
            <Hero />
            <AboutLW />
            <PriceLW />
            <FAQLW />
            <FooterLW />
        </>
    );
};

export default HomePage;