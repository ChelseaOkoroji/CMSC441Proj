import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css';
import Modal from '../Modal/Modal'; // Import the modal component
import axios from 'axios';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const token = queryParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        document.body.classList.add('resetpassword-page');
    
        // Cleanup function to remove the class when component unmounts
        return () => {
          document.body.classList.remove('resetpassword-page');
        };
      }, []);

    const handlePasswordReset = async (event) => {
        event.preventDefault();

        // Password must be at least 8 characters long
        if(newPassword.length < 8) {
            setModalMessage("New password must be at least 8 characters long.");
            setModalVisible(true);
            return;
        }
        // Passwords much match
        if(newPassword !== confirmPassword) {
            setModalMessage("Passwords must match.");
            setModalVisible(true);
            return;
        }

        try {
            const response = await axios.post('/reset-password/', {
                token,
                new_password: newPassword
            });
            setModalMessage(response.data.message);
            setModalVisible(true);

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/'); // Redirect to the login page
            }, 2000);
        } catch (error) {
            setModalMessage(error.response?.data?.detail || 'An error occurred. Please try again.');
            setModalVisible(true);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <div className='reset-password-wrapper'>
            <form onSubmit={handlePasswordReset}>
                <h1>Reset Password</h1>
                <div className='input-box'>
                    <input
                        type="password"
                        placeholder='New Password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {modalVisible && (
                <Modal message={modalMessage} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default ResetPassword;

