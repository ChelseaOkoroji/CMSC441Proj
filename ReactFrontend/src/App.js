import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/Register';
import ForgotPassword from './Components/Forgot/ForgotPassword';
import ResetPassword from './Components/Forgot/ResetPassword';
import HomePage from './Components/HomePage/HomePage';
import { UserProvider } from './UserContext';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/home" element={<HomePage />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};


export default App;
