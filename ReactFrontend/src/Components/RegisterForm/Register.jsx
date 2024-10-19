import React, { useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';


const Register = () => {
  const [userID, setUserID] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Note from Trevor: I added async because I think that allows for
  // the UI to still be responsive while the task is being completed
  const handleRegister = async () => {
    const user = { userID, email, password };
    fetch('/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then(response => response.json())
      .then(data => {
        console.log('User registered:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
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
    </div>
  );
};

export default Register;