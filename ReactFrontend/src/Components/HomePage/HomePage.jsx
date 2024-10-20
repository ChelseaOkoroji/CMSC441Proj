import React, {useState} from 'react';
import './HomePage.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = ({ user }) => {
    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                <h1>Product List</h1>
                <div>
                    <span>Welcome, {user.userID}</span>
                    <Link to="/profile" style={{ marginLeft: '10px' }}>
                        <button>Profile</button>
                    </Link>
                </div>
            </header>
            {/* Here you would map over your products and display them */}
            <div>
                {/* Example of product display */}
                <h2>Products</h2>
                {/* Map your products here */}
            </div>
        </div>
    );
};

export default HomePage;