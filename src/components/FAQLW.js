import React, { useState } from 'react';
import './FAQLW.css';

const FAQLW = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqData = [
        {
            question: "What is Claude and how does it work?",
            answer: "Claude is an artificial intelligence, trained by Anthropic using Constitutional AI to be safe, accurate, and secure — the trusted assistant for you to do your best work.\n\nYou can use Claude for your own personal use or create a Team account to collaborate with your teammates. Learn more about Claude."
        },
        {
            question: "What should I use Claude for?",
            answer: "If you can dream it, Claude can help you do it. Claude can process large amounts of information, brainstorm ideas, generate text and code, help you understand subjects, coach you through difficult situations, simplify your busywork so you can focus on what matters most, and so much more."
        },
        {
            question: "How much does it cost to use?",
            answer: "Claude has four pricing plans available — Free, Pro, Team, and Enterprise. The Free plan offers limited use with no payment required. Learn more about Pro and Team pricing."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                <h2>Frequently asked questions</h2>
                <div className="faq-list">
                    {faqData.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <button 
                                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                                onClick={() => toggleFAQ(index)}
                            >
                                {faq.question}
                                <span className="faq-icon">{openIndex === index ? '×' : '+'}</span>
                            </button>
                            <div className={`faq-answer ${openIndex === index ? 'active' : ''}`}>
                                {faq.answer}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQLW;
