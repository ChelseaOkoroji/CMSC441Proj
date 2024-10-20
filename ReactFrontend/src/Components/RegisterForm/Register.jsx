import React, { useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'


const Register = () => {
  const [userID, setUserID] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  // So that user cannot just click "Register" over and over
  const areAllFieldsFilled = (userID !== "") && (email !== "") && (password !== "");

  // Note from Trevor: I added async because I think that allows for
  // the UI to still be responsive while the task is being completed
  const handleRegister = async () => {

    // Don't want to do anything if a field is missing
    if(!areAllFieldsFilled) {
      setError("Please fill in all fields.");
      return;
    }

    const user = { userID, email, password };
    try {
      const response = await axios.post('/register/', user);
      if (response.status === 201) {
          // Redirect to login page
          navigate('/');
      } 
    } catch (err) {
      // Check if error has a response
      if (err.response) {
        // Show error message from FastAPI
        setError(err.response.data.detail); 
      } else {
        setError('Network error. Please check your connection.');
      }
    }

    // Clear form fields
    setUserID('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className='test'>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <div className="login-link">
        <p>Already have an account? <Link to="/">Login</Link></p>
      </div>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
};

export default Register;