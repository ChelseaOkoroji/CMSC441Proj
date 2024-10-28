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
    const [menu, setMenu] = useState();
    /*Everything in here can be deleted, was just for testing purposes to see if login was working*/
    return (
        <div className='homepage'>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                <h1>Product List</h1>
                <div>
                    <span>Welcome, { user.userID }</span>
                    <Link to="/profile" style={{ marginLeft: '10px' }}>
                        <button>Profile</button>
                    </Link>
                    <ul className='menu'>
                        <li onClick={()=>{setMenu("all")}}>All{menu==="all"?<hr/>:<></>}</li>
                        <li onClick={()=>{setMenu("book")}}>Book{menu==="book"?<hr/>:<></>}</li>
                        <li onClick={()=>{setMenu("merch")}}>Merch{menu==="merch"?<hr/>:<></>}</li>
                        <li onClick={()=>{setMenu("school-supplies")}}>School Supplies{menu==="school-supplies"?<hr/>:<></>}</li>
                        <li onClick={()=>{setMenu("technology")}}>Technology{menu==="technology"?<hr/>:<></>}</li>
                        <li onClick={()=>{setMenu("dorm")}}>Dorm{menu==="dorm"?<hr/>:<></>}</li>
                        <li onClick={()=>{setMenu("health")}}>Health/Fitness{menu==="health"?<hr/>:<></>}</li>
                    </ul>     
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