import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, addDoc, getDocs, Timestamp, doc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import './UserPrompts.css';

const UserPrompts = ({ userEmail, userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize Firebase Functions
  const functions = getFunctions();
  const processPrompt = httpsCallable(functions, 'process_prompt');

  useEffect(() => {
    if (!userId) {
      console.log('No userId provided');
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        console.log('Fetching messages for user:', userId);
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
    if (!inputMessage.trim() || !userId || isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Sending message:', inputMessage);

      // Save user message
      const userMessage = {
        text: inputMessage,
        timestamp: Timestamp.now(),
        userEmail: userEmail,
        type: 'user'
      };

      // Add user message to Firestore
      const userRef = doc(db, 'users', userId);
      const promptsRef = collection(userRef, 'prompts');
      await addDoc(promptsRef, userMessage);

      // Add user message to state
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputMessage('');

      // Call OpenAI through Firebase Function
      console.log('Calling OpenAI process_prompt function with:', inputMessage);
      
      // Format the conversation history
      const formattedMessages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...messages.map(msg => ({
          role: msg.type === 'ai' ? 'assistant' : 'user',
          content: msg.text
        })),
        { role: 'user', content: inputMessage }
      ];
      
      const result = await processPrompt({ messages: formattedMessages });
      console.log('Raw OpenAI Response:', result);
      
      if (result.data.error) {
        console.error('Error from OpenAI:', result.data.error);
        throw new Error(result.data.error);
      }

      const aiResponse = result.data.result;
      console.log('Processed OpenAI Response:', aiResponse);

      // Save AI response
      const aiMessage = {
        text: aiResponse,
        timestamp: Timestamp.now(),
        userEmail: 'Veigar - The Lending Wizard',
        type: 'ai'
      };

      // Add AI response to Firestore
      await addDoc(promptsRef, aiMessage);

      // Add AI response to state
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      
      setError(null);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setError(`Failed to send message: ${error.message}`);
    } finally {
      setIsProcessing(false);
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
            <div 
              key={message.id} 
              className={`message ${message.type === 'ai' ? 'ai' : 'user'}`}
            >
              <div className="message-header">
                <span className="sender">{message.type === 'ai' ? 'Veigar - The Lending Wizard' : 'You'}</span>
              </div>
              <div className="message-content">
                <p>{message.text}</p>
              </div>
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
          disabled={!userId || isProcessing}
        />
        <button 
          onClick={handleSendMessage} 
          className="send-button"
          disabled={!userId || !inputMessage.trim() || isProcessing}
        >
          {isProcessing ? '...' : '→'}
        </button>
      </div>
    </div>
  );
};

export default UserPrompts; 