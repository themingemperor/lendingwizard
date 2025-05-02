import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import UserChats from '../components/UserChats';
import './Dashboard.css';
import openIcon from '../assets/images/LWOpenIcon.png';
import closeIcon from '../assets/images/LWCloseIcon.png';
import renameIcon from '../assets/images/RenameIconLW.png';
import deleteIcon from '../assets/images/DeleteIconLW.png';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isChatHistoryCollapsed, setIsChatHistoryCollapsed] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [previousChats, setPreviousChats] = useState({});
    const currentMessagesRef = useRef([]);
    const [isFirstLogin, setIsFirstLogin] = useState(true);
    const [chatOptionsOpen, setChatOptionsOpen] = useState(null);
    const [editingChatId, setEditingChatId] = useState(null);
    const [editingChatTitle, setEditingChatTitle] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0 });

    useEffect(() => {
        if (!currentUser) return;

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userRef = doc(db, 'users', currentUser.uid);
                const userProfileRef = doc(userRef, 'userProfile', 'profile');
                const userProfileDoc = await getDoc(userProfileRef);
                
                if (!userProfileDoc.exists()) {
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
                }

                // Fetch existing chats
                const chatsRef = collection(userRef, 'chats');
                const chatsSnapshot = await getDocs(chatsRef);
                const chats = {};
                chatsSnapshot.forEach(doc => {
                    chats[doc.id] = doc.data();
                });

                // If there are no chats, create a new one
                if (Object.keys(chats).length === 0) {
                    const newChatRef = await addDoc(chatsRef, {
                        createdAt: new Date(),
                        title: 'New Chat',
                        lastUpdated: new Date()
                    });
                    chats[newChatRef.id] = {
                        createdAt: new Date(),
                        title: 'New Chat',
                        lastUpdated: new Date()
                    };
                    setActiveChat(newChatRef.id);
                } else {
                    // Set the most recent chat as active
                    const mostRecentChat = Object.entries(chats).reduce((a, b) => 
                        a[1].lastUpdated > b[1].lastUpdated ? a : b
                    )[0];
                    setActiveChat(mostRecentChat);
                }

                setPreviousChats(chats);
                setIsFirstLogin(false);
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

    const handleNewChat = async () => {
        try {
            if (!currentUser) return;

            // Create a new chat document
            const userRef = doc(db, 'users', currentUser.uid);
            const chatsRef = collection(userRef, 'chats');
            const newChatRef = await addDoc(chatsRef, {
                createdAt: new Date(),
                title: 'New Chat',
                lastUpdated: new Date()
            });

            // Set the new chat as active
            setActiveChat(newChatRef.id);
            setPreviousChats(prev => ({
                ...prev,
                [newChatRef.id]: {
                    createdAt: new Date(),
                    title: 'New Chat',
                    lastUpdated: new Date()
                }
            }));
            setChatOptionsOpen(null);
        } catch (error) {
            console.error('Error creating new chat:', error);
        }
    };

    const handleSwitchChat = (chatId) => {
        setActiveChat(chatId);
        setChatOptionsOpen(null);
    };

    const handleSaveMessages = (chatId, messages) => {
        if (!chatId) return;
        currentMessagesRef.current = [...messages];
    };

    const handleChatOptionsClick = (e, chatId) => {
        e.stopPropagation();
        const buttonRect = e.currentTarget.getBoundingClientRect();
        setDropdownPosition({
            top: buttonRect.top
        });
        setChatOptionsOpen(chatOptionsOpen === chatId ? null : chatId);
    };

    const startRenameChat = (e, chatId, currentTitle) => {
        e.stopPropagation();
        setEditingChatId(chatId);
        setEditingChatTitle(currentTitle);
        setChatOptionsOpen(null);
    };

    const handleRenameChat = async (e, chatId) => {
        e.preventDefault();
        if (!editingChatTitle.trim()) return;

        try {
            const userRef = doc(db, 'users', currentUser.uid);
            const chatRef = doc(userRef, 'chats', chatId);
            await updateDoc(chatRef, {
                title: editingChatTitle,
                lastUpdated: new Date()
            });

            setPreviousChats(prev => ({
                ...prev,
                [chatId]: {
                    ...prev[chatId],
                    title: editingChatTitle,
                    lastUpdated: new Date()
                }
            }));

            setEditingChatId(null);
            setEditingChatTitle('');
        } catch (error) {
            console.error('Error renaming chat:', error);
        }
    };

    const handleDeleteChat = async (e, chatId) => {
        e.stopPropagation();
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            const chatRef = doc(userRef, 'chats', chatId);
            await deleteDoc(chatRef);

            setPreviousChats(prev => {
                const newChats = { ...prev };
                delete newChats[chatId];
                return newChats;
            });

            if (activeChat === chatId) {
                const remainingChats = Object.keys(previousChats).filter(id => id !== chatId);
                if (remainingChats.length > 0) {
                    setActiveChat(remainingChats[0]);
                } else {
                    setActiveChat(null);
                }
            }

            setChatOptionsOpen(null);
        } catch (error) {
            console.error('Error deleting chat:', error);
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
                    {Object.entries(previousChats).map(([chatId, chatData]) => (
                        <div 
                            key={chatId} 
                            className={`chat-history-item ${activeChat === chatId ? 'active' : ''}`}
                            onClick={() => handleSwitchChat(chatId)}
                        >
                            {editingChatId === chatId ? (
                                <form onSubmit={(e) => handleRenameChat(e, chatId)} className="rename-form">
                                    <input
                                        type="text"
                                        value={editingChatTitle}
                                        onChange={(e) => setEditingChatTitle(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        autoFocus
                                        onBlur={(e) => handleRenameChat(e, chatId)}
                                    />
                                </form>
                            ) : (
                                <>
                                    <span className="chat-title">{chatData.title}</span>
                                    <button 
                                        className="chat-options-button"
                                        onClick={(e) => handleChatOptionsClick(e, chatId)}
                                    >
                                        <span className="dots">⋮</span>
                                    </button>
                                    {chatOptionsOpen === chatId && (
                                        <div 
                                            className="chat-options-dropdown"
                                            style={{ top: dropdownPosition.top }}
                                        >
                                            <button 
                                                onClick={(e) => startRenameChat(e, chatId, chatData.title)}
                                                className="chat-option"
                                            >
                                                <img src={renameIcon} alt="Rename" className="option-icon" />
                                                Rename
                                            </button>
                                            <button 
                                                onClick={(e) => handleDeleteChat(e, chatId)}
                                                className="chat-option"
                                            >
                                                <img src={deleteIcon} alt="Delete" className="option-icon" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
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
                        <UserChats 
                            userEmail={currentUser?.email} 
                            userId={currentUser?.uid} 
                            activeChat={activeChat}
                            onSaveMessages={handleSaveMessages}
                            previousMessages={currentMessagesRef.current}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 