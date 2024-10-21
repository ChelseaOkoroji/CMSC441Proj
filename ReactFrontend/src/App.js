import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/Register';
import ForgotPassword from './Components/Forgot/ForgotPassword';

const App = () => {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
      </Router>
  );
};


export default App;
