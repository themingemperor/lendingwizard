// src/Views/HomePage.js
import React, { useState } from 'react';
import './HomePage.css';

import Hero from './Hero.js';
import AboutLW from '../components/AboutLW';
import PriceLW from '../components/PriceLW';

const HomePage = () => {
    return (
        <>
            <Hero />
            <AboutLW />
            <PriceLW />
        </>
    );
};

export default HomePage;