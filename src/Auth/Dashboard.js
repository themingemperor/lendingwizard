import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import UserPrompts from '../components/UserPrompts';
import './Dashboard.css';
import openIcon from '../assets/images/LWOpenIcon.png';
import closeIcon from '../assets/images/LWCloseIcon.png';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isChatHistoryCollapsed, setIsChatHistoryCollapsed] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [previousChats, setPreviousChats] = useState({});
    const currentMessagesRef = useRef([]);

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

    const toggleChatHistory = () => {
        setIsChatHistoryCollapsed(!isChatHistoryCollapsed);
    };

    const handleNewChat = () => {
        // Save current chat if it has messages
        if (activeChat && currentMessagesRef.current.length > 0) {
            setPreviousChats(prev => ({
                ...prev,
                [activeChat]: [...currentMessagesRef.current]
            }));
        }
        
        // Generate new chat ID and clear messages
        const newChatId = Date.now().toString();
        currentMessagesRef.current = [];
        setActiveChat(newChatId);
    };

    const handleSwitchChat = (chatId) => {
        if (chatId === activeChat) return;

        // Save current chat if it has messages
        if (activeChat && currentMessagesRef.current.length > 0) {
            setPreviousChats(prev => ({
                ...prev,
                [activeChat]: [...currentMessagesRef.current]
            }));
        }
        
        setActiveChat(chatId);
    };

    const handleSaveMessages = (chatId, messages) => {
        if (!chatId) return;
        currentMessagesRef.current = [...messages];
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
        <div className="dashboard-master-container">
            <div className={`chat-history ${isChatHistoryCollapsed ? 'collapsed' : ''}`}>
                <h2>Chat History</h2>
                <button 
                    className="toggle-button" 
                    onClick={toggleChatHistory}
                    aria-label={isChatHistoryCollapsed ? "Expand chat history" : "Collapse chat history"}
                >
                    <img 
                        src={isChatHistoryCollapsed ? openIcon : closeIcon} 
                        alt={isChatHistoryCollapsed ? "Open chat history" : "Close chat history"}
                    />
                </button>
                <button className="new-chat-button" onClick={handleNewChat}>
                    <span className="plus-icon">+</span>
                    New chat
                </button>
                <div className="previous-chats">
                    {Object.entries(previousChats).map(([chatId, messages]) => (
                        <div 
                            key={chatId} 
                            className={`chat-history-item ${activeChat === chatId ? 'active' : ''}`}
                            onClick={() => handleSwitchChat(chatId)}
                        >
                            {messages[0]?.text.substring(0, 30)}...
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="dashboard-container">
                <div className="header">
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
                    <div className={`chat-container ${isChatHistoryCollapsed ? 'expanded' : ''}`}>
                        <UserPrompts 
                            userEmail={currentUser?.email} 
                            userId={currentUser?.uid} 
                            activeChat={activeChat}
                            onSaveMessages={handleSaveMessages}
                            previousMessages={previousChats[activeChat]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 