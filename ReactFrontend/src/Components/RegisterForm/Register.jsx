import React, { useState } from 'react';
import './Register.css';
import Modal from '../Modal/Modal'; // Import the modal component
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';


const Register = () => {
  const [userID, setUserID] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('register-page');

    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('register-page');
    };
  }, []);

  // So that user cannot just click "Register" over and over
  const areAllFieldsFilled = (userID !== "") && (email !== "") && (password !== "") && (confirmPassword !== "");

  // Note from Trevor: I added async because I think that allows for
  // the UI to still be responsive while the task is being completed
  const handleRegister = async () => {

    // Don't want to do anything if a field is missing
    if(!areAllFieldsFilled) {
      setModalMessage("Please fill in all fields");
      setModalVisible(true);
      return;
    }
    // Username must be at least 6 characters long
    if(userID.length < 6) {
      setModalMessage("Username must be at least 6 characters long");
      setModalVisible(true);
      return;
    }
    // Password must be at least 8 characters long
    if(password.length < 8) {
      setModalMessage("Password must be at least 8 characters long");
      setModalVisible(true);
      return;
    }
    // Passwords much match
    if(password !== confirmPassword) {
      setModalMessage("Passwords must match");
      setModalVisible(true);
      return;
    }
    // If no errors from above, register the user
    const user = { userID, email, password };
    await axios.post('/register/', user)
      .then(response => {
        setModalMessage("Success! Redirecting to login page...");
        setModalVisible(true);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/'); // Redirect to the login page
        }, 2000);
      })
      .catch(error => {
        if(error.response) {
          setModalMessage(error.response.data.detail);
        } else {
          setModalMessage('Network error. Please check your connection.');
        }
        setModalVisible(true);
      });

    // Clear form fields
    setUserID('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div className='wrapper'>
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>
      <div className="login-link">
        <p>Already have an account? <Link to="/">Login</Link></p>
      </div>
      {modalVisible && (
        <Modal message={modalMessage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Register;