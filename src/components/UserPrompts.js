import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, addDoc, getDocs, Timestamp, doc } from 'firebase/firestore';
import './UserPrompts.css';

const UserPrompts = ({ userEmail, userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.log('No userId provided');
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        console.log('Fetching messages for user:', userId);
        // Reference the nested prompts collection
        const userRef = doc(db, 'users', userId);
        const promptsRef = collection(userRef, 'prompts');
        const q = query(
          promptsRef,
          orderBy('timestamp', 'asc')
        );
        
        const querySnapshot = await getDocs(q);
        console.log('Query snapshot:', querySnapshot);
        
        if (querySnapshot.empty) {
          console.log('No messages found for user');
          setMessages([]);
        } else {
          const fetchedMessages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log('Fetched messages:', fetchedMessages);
          setMessages(fetchedMessages);
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError(`Failed to load messages: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !userId) {
      console.log('Invalid message or userId');
      return;
    }

    try {
      console.log('Sending message:', inputMessage);
      const newMessage = {
        text: inputMessage,
        timestamp: Timestamp.now(),
        userEmail: userEmail
      };
      
      console.log('Creating message document:', newMessage);
      // Add to nested prompts collection
      const userRef = doc(db, 'users', userId);
      const promptsRef = collection(userRef, 'prompts');
      const docRef = await addDoc(promptsRef, newMessage);
      console.log('Message added with ID:', docRef.id);
      
      setMessages(prevMessages => [...prevMessages, { ...newMessage, id: docRef.id }]);
      setInputMessage('');
      setError(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(`Failed to send message: ${error.message}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  if (error) {
    return (
      <div className="chat-container">
        <div className="error-message">
          {error}
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start a conversation!</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="message user">
              <p>{message.text}</p>
              <span className="timestamp">
                {message.timestamp?.toDate().toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          onKeyDown={handleKeyDown}
          disabled={!userId}
        />
        <button 
          onClick={handleSendMessage} 
          className="send-button"
          disabled={!userId || !inputMessage.trim()}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default UserPrompts; 