import React, { useState } from 'react';
import eyeOpen from '../assets/images/lw-eye-icon-open.png';
import eyeClose from '../assets/images/lw-eye-icon-close.png';
import './PasswordInput.css';

const PasswordInput = ({ value, onChange, placeholder, className }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="password-input-container">
            <input
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`password-input ${className || ''}`}
                required
            />
            <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
            >
                <img
                    src={showPassword ? eyeOpen : eyeClose}
                    alt={showPassword ? 'Hide password' : 'Show password'}
                    className="password-toggle-icon"
                />
            </button>
        </div>
    );
};

export default PasswordInput; 