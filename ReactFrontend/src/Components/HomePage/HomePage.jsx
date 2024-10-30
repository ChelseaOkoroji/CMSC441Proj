import React, {useState} from 'react';
import './HomePage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import {useEffect} from 'react';
import axios from 'axios';

const HomePage = () => {
    useEffect(() => {
        document.body.classList.add('homepage-page');
    
        return () => {
          document.body.classList.remove('homepage-page');
        };
      }, []);
    const { user } = useUser(); // Keep this
    /*Everything in here can be deleted, was just for testing purposes to see if login was working*/
    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                <h1>Product List</h1>
                <div>
                    <span>Welcome, { user.userID }</span>
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