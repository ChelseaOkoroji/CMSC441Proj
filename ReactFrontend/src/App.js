import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/Register';
import ForgotPassword from './Components/Forgot/ForgotPassword';
import ResetPassword from './Components/Forgot/ResetPassword';
import HomePage from './Components/HomePage/HomePage';
import Main from './Components/HomePage/Main';
import Categories from './Components/HomePage/Categories';
import { UserProvider } from './UserContext';
import ProductsInfo from './Components/Products/ProductsInfo';
import Marketplace from './Components/ItemPage/itempage';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protect all routes under /home */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          >
            <Route index element={<Marketplace />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="all" element={<Main />} />
            <Route path="book" element={<Categories category="books" />} />
            <Route path="merch" element={<Categories category="merchs" />} />
            <Route path="school-supplies" element={<Categories category="school-supply" />} />
            <Route path="technology" element={<Categories category="technologies" />} />
            <Route path="dorm" element={<Categories category="dorms" />} />
            <Route path="health" element={<Categories category="healths" />} />
            <Route path="product/:productID" element={<ProductsInfo />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;