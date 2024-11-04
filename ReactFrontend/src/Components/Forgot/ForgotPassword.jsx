import React, { useState } from 'react';
import { useEffect } from 'react';
import './ForgotPassword.css';
import Modal from '../Modal/Modal'; // Import the modal component
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        document.body.classList.add('forgotpassword-page');
    
        // Cleanup function to remove the class when component unmounts
        return () => {
          document.body.classList.remove('forgotpassword-page');
        };
      }, []);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        await axios.post(`/forget-password/${email}/`)
        .then(response => {
            setModalMessage("Password reset email sent");
            setModalVisible(true);
        })
        .catch(error => {
            if(error.response) {
                setModalMessage(error.response.data.detail);
            } else {
                setModalMessage('Network error. Please check your connection.');
            }
            setModalVisible(true);
        });
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <div className="forgot-password-wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                <div className="input-box">
                    <input 
                        type="email" 
                        placeholder="Enter email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Send Reset Link</button>
            </form>
            {modalVisible && (
                <Modal message={modalMessage} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default ForgotPassword;