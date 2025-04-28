import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Dashboard.css';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button onClick={handleLogout} className="logout-btn">
                    Log Out
                </button>
            </div>
            <h1>Welcome to your Dashboard, {currentUser?.email}</h1>
            <div className="dashboard-content">
                <p>This is your personalized dashboard. More features coming soon!</p>
            </div>
        </div>
    );
};

export default Dashboard; 