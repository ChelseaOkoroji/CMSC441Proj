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

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    <Route path="/home" element={<HomePage />}>
                        <Route path="home/all" element={<Main />} />
                        <Route path="home/book" element={<Categories category="books" />} />
                        <Route path="home/merch" element={<Categories category="merchs" />} />
                        <Route path="home/school-supplies" element={<Categories category="school-supply" />} />
                        <Route path="home/technology" element={<Categories category="technologies" />} />
                        <Route path="home/dorm" element={<Categories category="dorms" />} />
                        <Route path="home/health" element={<Categories category="healths" />} />
                        <Route path="home/product/:productId" element={<ProductsInfo />} />   
                    </Route>

                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;