import React from 'react';
import { useAuth } from '../AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { currentUser } = useAuth();

    return (
        <div className="dashboard-container">
            <h1>Welcome to your Dashboard, {currentUser?.email}</h1>
            <div className="dashboard-content">
                <p>This is your personalized dashboard. More features coming soon!</p>
            </div>
        </div>
    );
};

export default Dashboard; 