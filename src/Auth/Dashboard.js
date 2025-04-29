import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import UserPrompts from '../components/UserPrompts';
import './Dashboard.css';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (!currentUser) return;

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userProfileRef = doc(db, 'userProfile', currentUser.uid);
                const userProfileDoc = await getDoc(userProfileRef);
                
                if (userProfileDoc.exists()) {
                    setUserData(userProfileDoc.data());
                } else {
                    // Create new user profile if it doesn't exist
                    const newUserProfile = {
                        email: currentUser.email,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                        createdAt: new Date(),
                        lastLogin: new Date(),
                        provider: currentUser.providerData[0]?.providerId || 'google.com'
                    };
                    
                    await setDoc(userProfileRef, newUserProfile);
                    setUserData(newUserProfile);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading-message">Loading dashboard...</div>
            </div>
        );
    }

    const firstLetter = currentUser?.email?.charAt(0).toUpperCase() || 'U';

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1>LendingWizard</h1>
                <div className="user-profile">
                    <div 
                        className="profile-circle"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {firstLetter}
                    </div>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="main-content">
                <div className="chat-history">
                    <h2>Chat History</h2>
                    {/* Chat history list will be implemented here */}
                </div>
                
                <div className="chat-container">
                    <UserPrompts userEmail={currentUser?.email} userId={currentUser?.uid} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 