import React, { useState } from 'react';
import './PriceLW.css';
import LWicon from '../assets/images/LWicon.png';

const PriceLW = () => {
    const [activeTab, setActiveTab] = useState('individual');

    const individualPlans = [
        {
            name: 'Free',
            description: 'Try Claude',
            price: '$0',
            billingPeriod: 'Free for everyone',
            features: [
                'Chat on web, iOS, and Android',
                'Generate code and visualize data',
                'Write, edit, and create content',
                'Analyze text and images'
            ]
        },
        {
            name: 'Pro',
            description: 'For everyday productivity',
            price: '$17',
            billingPeriod: 'Per month billed annually',
            features: [
                'Everything in Free, plus:',
                'More usage',
                'Access to Projects to organize chats and documents',
                'Ability to use more Claude models',
                'Extended thinking for complex work'
            ]
        },
        {
            name: 'Max',
            description: '5-20x more usage than Pro',
            price: 'From $100',
            billingPeriod: 'Per month billed monthly',
            features: [
                'Everything in Pro, plus:',
                'Substantially more usage of Claude',
                'Scale usage based on specific needs',
                'Access to Research that saves hours*',
                'Higher output limits for all tasks',
                'Early access to advanced Claude features',
                'Priority access at high traffic times'
            ]
        }
    ];

    const teamPlans = [
        {
            name: 'Team',
            description: 'For collaboration across organizations',
            price: '$49',
            billingPeriod: 'Per month billed annually',
            features: [
                'All Max features',
                'Team collaboration',
                'User management',
                'Team analytics',
                'Shared resources'
            ]
        },
        {
            name: 'Enterprise',
            description: 'For businesses operating at scale',
            price: 'Custom',
            billingPeriod: 'Contact us for pricing',
            features: [
                'All Team features',
                'Custom solutions',
                'SLA guarantee',
                'On-premise option',
                '24/7 support'
            ]
        }
    ];

    return (
        <section className="price-section">
            <div className="price-container">
                <h2>Explore plans</h2>
                <div className="tab-pill-container">
                    <div className="tab-container">
                        <button 
                            className={`tab ${activeTab === 'individual' ? 'active' : ''}`}
                            onClick={() => setActiveTab('individual')}
                        >
                            Individual
                        </button>
                        <button 
                            className={`tab ${activeTab === 'team' ? 'active' : ''}`}
                            onClick={() => setActiveTab('team')}
                        >
                            Team & Enterprise
                        </button>
                    </div>
                </div>
                <div className="cards-container">
                    {(activeTab === 'individual' ? individualPlans : teamPlans).map((plan, index) => (
                        <div key={index} className="price-card">
                            <div className="card-content">
                                <div className="card-header">
                                    <h3>{plan.name}</h3>
                                    <p className="plan-description">{plan.description}</p>
                                </div>
                                <ul className="features">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx}>
                                            <img src={LWicon} alt="check" className="feature-icon" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="price-section">
                                    <div className="price">{plan.price}</div>
                                    <div className="billing-period">{plan.billingPeriod}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pricing-footer">
                    <p>Prices shown do not include applicable tax.</p>
                    <p className="research-note">*Research is in early beta and currently available in the US, Japan, and Brazil.</p>
                </div>
            </div>
        </section>
    );
};

export default PriceLW;
