import React from 'react';
import './LoginForm.css';
import { FaUserGraduate } from "react-icons/fa";
import { FaUnlockAlt } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../../UserContext';
import { useEffect } from 'react';
import axios from 'axios';

const LoginForm = () => {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('login-page');
    
        return () => {
          document.body.classList.remove('login-page');
        };
      }, []);

    // Login functionality
    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent default form submission
        const checkUser = { userID, password };
        await axios.post('/login/', checkUser)
            .then(response => {
                sessionStorage.setItem('user', JSON.stringify(response.data))
                setUser(response.data); // Save data about user in context
                navigate('/home');
            })
            .catch(error => {
                if(error.response) {
                    setError(error.response.data.detail);
                } else {
                    setError('Network error. Please check your connection.');
                }
            });
        // Clear form fields
        setUserID('');
        setPassword('');
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleLogin}>
                <h1>E-Z College</h1>
                <div className="input-box">
                    <input type="text" placeholder='Username' required
                    value={userID} onChange={(e) => setUserID(e.target.value)}/>
                    <FaUserGraduate className= 'icon'/>

                </div>
                <div className="input-box">
                    <input type="password" placeholder='Password' required
                    value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <FaUnlockAlt className= 'icon'/>

                </div>

                <div className="remeber-forgot">
                    <Link to="/forgot-password">Forgot password?</Link>
                </div>
                <button type="submit">Login</button>

                <div className="register-link">
                <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default LoginForm;