import React, { useState } from 'react';
import './ForgotPassword.css';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');//idk if this is necessary lol

    const sendPassword= (e) => {
       
    };

    return (
        <div className="forgot-password-box">
            <form onSubmit={sendPassword}>
                <h1>Resend Password</h1>
                <div className="input-box">
                    <input 
                        type="email" 
                        placeholder="Enter your account's email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Send Password</button>
            </form>
        </div>
    );
};

export default ForgotPassword; 

