import React, { useState, useEffect } from 'react';
import './AboutLW.css';
import instructionsVideo from '../assets/images/AboutLW-Instructions.mp4';

const AboutLW = () => {
    const [activeDropdown, setActiveDropdown] = useState(1);

    const dropdownData = [
        {
            id: 1,
            title: "Create with Lending Wizard",
            description: "Draft and iterate on websites, graphics, documents, and code alongside your chat with Artifacts."
        },
        {
            id: 2,
            title: "Bring your knowledge",
            description: "Create Projects and add knowledge so that you can deliver expert-level results with the Claude Pro, Team and Enterprise plans."
        },
        {
            id: 3,
            title: "Share and collaborate with your team",
            description: "Share your best chats with your team to spark better ideas and move work forward on the Claude Team and Enterprise plans."
        }
    ];

    const handleDropdownClick = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    return (
        <div className="about-lw-container">
            <div className="about-lw-header">
                <h1 id="meet-lending-wizard">Meet Lending Wizard</h1>
                <p className="about-lw-subtitle">
                    Lending Wizard is a next generation AI assistant built by Veigar and trained to 
                    be safe, accurate, and secure to help you do your best work.
                </p>
            </div>
            
            <div className="about-lw-content">
                <div className="about-lw-left">
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        controls={false}
                        className="about-lw-video"
                    >
                        <source src={instructionsVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                
                <div className="about-lw-right">
                    <div className="dropdown-section">
                        {dropdownData.map((item, index) => (
                            <div key={item.id} className="dropdown-item">
                                <div 
                                    className={`dropdown-header ${activeDropdown === item.id ? 'active' : ''}`}
                                    onClick={() => handleDropdownClick(item.id)}
                                >
                                    <h3>{item.title}</h3>
                                    <span className="dropdown-icon">
                                        {activeDropdown === item.id ? '−' : '+'}
                                    </span>
                                </div>
                                <div className={`dropdown-content ${activeDropdown === item.id ? 'active' : ''}`}>
                                    <p>{item.description}</p>
                                </div>
                                {index < dropdownData.length - 1 && <div className="dropdown-divider" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutLW;
