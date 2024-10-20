import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/Register';
import HomePage from './Components/HomePage/HomePage';

const App = () => {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/home" element={<HomePage />} />
          </Routes>
      </Router>
  );
};


export default App;
