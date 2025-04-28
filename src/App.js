// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import HomePage from './Views/HomePage';
import SignInPage from './Views/SignInPage';
import Dashboard from './Auth/Dashboard';
import GoogleCallback from './Auth/GoogleCallback';
import PasswordSetup from './Views/PasswordSetup';
import PasswordReset from './Views/PasswordReset';
import './App.css';

const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/signin" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/reset-password" element={<PasswordReset />} />
                    <Route path="/password-setup" element={<PasswordSetup />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
