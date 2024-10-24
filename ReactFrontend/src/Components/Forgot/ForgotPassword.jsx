import React, { useState } from 'react';
import { useEffect } from 'react';
import './ForgotPassword.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        document.body.classList.add('forgotpassword-page');
    
        // Cleanup function to remove the class when component unmounts
        return () => {
          document.body.classList.remove('forgotpassword-page');
        };
      }, []);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        await axios.get(`/forget-password/${email}`)
        .then(response => {
            // Remove email form and display message that says "Email sent"
        })
        .catch(error => {
            if(error.response) {
                setError(error.response.data.detail);
            } else {
                setError('Network error. Please check your connection.');
            }
        });
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
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default ForgotPassword;