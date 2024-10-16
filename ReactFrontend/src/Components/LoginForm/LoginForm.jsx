import React from 'react';
import './LoginForm.css';
import { FaUserGraduate } from "react-icons/fa";
import { FaUnlockAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

const LoginForm = () => {
    return (
        <div className='wrapper'>
            <form action ="">
                <h1>E-Z College</h1>
                <div className="input-box">
                    <input type="text" placeholder='Username' required/>
                    <FaUserGraduate className= 'icon'/>

                </div>
                <div className="input-box">
                    <input type="password" placeholder='Password' required/>
                    <FaUnlockAlt className= 'icon'/>

                </div>

                <div className="remeber-forgot">
                    <a href="#">Forgot password?</a>
                </div>
                <button type="submit">Login</button>

                <div className="register-link">
                <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;