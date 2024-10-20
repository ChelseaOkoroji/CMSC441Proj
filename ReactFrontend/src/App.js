import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/Register';
import HomePage from './Components/HomePage/HomePage';

const App = () => {
    const [user, setUser] = useState(null); // Store user

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm setUser={setUser} />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/home" element={<HomePage user={user} />} />
            </Routes>
        </Router>
    );
};


export default App;
