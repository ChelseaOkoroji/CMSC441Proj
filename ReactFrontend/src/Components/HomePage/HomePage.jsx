import React, {useState} from 'react';
import './HomePage.css';
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
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
                    <div className='profile'>
                        <button>Profile</button>
                        <CgProfile className='profile_icon'/>
                    </div>
                    <ul className='menu'>
                    <li onClick={()=>{setMenu("all")}}><Link style={{textDecoration: "none"}} to="home/all">All</Link>{menu==="all"?<hr/>:<></>}</li>
                        <li onClick={()=>{setMenu("book")}}><Link style={{textDecoration: "none"}} to="home/book">Book</Link>{menu==="book"?<hr/>:<></>}</li>
                        <li onClick={()=>{setMenu("merch")}}><Link style={{textDecoration: "none"}} to="home/merch">Merch</Link>{menu==="merch"?<hr/>:<></>}</li>
                        <li onClick={()=>{setMenu("school-supplies")}}><Link style={{textDecoration: "none"}} to="home/school-supplies">School Supplies</Link>{menu==="school-supplies"?<hr/>:<></>}</li>
                        <li onClick={()=>{setMenu("technology")}}><Link style={{textDecoration: "none"}} to="home/technology">Technology</Link>{menu==="technology"?<hr/>:<></>}</li>
                        <li onClick={()=>{setMenu("dorm")}}><Link style={{textDecoration: "none"}} to="home/dorm">Dorm</Link>{menu==="dorm"?<hr/>:<></>}</li>
                        <li onClick={()=>{setMenu("health")}}><Link style={{textDecoration: "none"}} to="home/health">Health/Fitness</Link>{menu==="health"?<hr/>:<></>}</li>
                    </ul>     
                </div>
            </header>
            {/* Here you would map over your products and display them */}
            <div className="products">
            
                {/* Example of product display */}
                <h2>Products</h2>
                {/* Map your products here */}
            </div>
        </div>
    );
};

export default HomePage;