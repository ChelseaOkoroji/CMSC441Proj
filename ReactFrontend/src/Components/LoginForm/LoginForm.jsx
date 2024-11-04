import React from 'react';
import './LoginForm.css';
import Modal from '../Modal/Modal';
import { FaUserGraduate } from "react-icons/fa";
import { FaUnlockAlt } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '../../UserContext';
import axios from 'axios';

const LoginForm = () => {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
        event.preventDefault();
        setIsLoading(true);
        const checkUser = { userID, password };

        try {
            const response = await axios.post('/login/', checkUser);
            sessionStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            
            // First navigate to home
            navigate('/home');
            
            // Then navigate to the items page within home
            navigate('/home/Items');
        } catch (error) {
            if (error.response) {
                setModalMessage(error.response.data.detail);
            } else {
                setModalMessage('Network error. Please check your connection.');
            }
            setModalVisible(true);
        } finally {
            setIsLoading(false);
            // Clear form fields
            setUserID('');
            setPassword('');
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleLogin}>
                <h1>E-Z College</h1>
                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder='Username' 
                        required
                        value={userID} 
                        onChange={(e) => setUserID(e.target.value)}
                        disabled={isLoading}
                    />
                    <FaUserGraduate className='icon'/>
                </div>
                <div className="input-box">
                    <input 
                        type="password" 
                        placeholder='Password' 
                        required
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    <FaUnlockAlt className='icon'/>
                </div>
                <div className="remeber-forgot">
                    <Link to="/forgot-password">Forgot password?</Link>
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <div className="register-link">
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </form>
            {modalVisible && (
                <Modal message={modalMessage} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default LoginForm;