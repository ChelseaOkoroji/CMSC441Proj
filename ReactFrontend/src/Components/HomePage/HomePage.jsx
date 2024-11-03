import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import user_profile from '../Assests/user-profile.png';

import { useUser } from '../../UserContext';
import all_products from '../Assests/all_products';

const HomePage = () => {
    useEffect(() => {
        document.body.classList.add('homepage-page');
        return () => {
            document.body.classList.remove('homepage-page');
        };
    }, []);
    
    const { user } = useUser();
    const [menu, setMenu] = useState("all"); // Set default to "all" for showing all products initially
    
    // Show all products if "all" is selected; otherwise, filter by selected category
    const filteredProducts = menu === "all" 
        ? all_products 
        : all_products.filter(product => product.category === menu);

    return (
        <div className='homepage'>
            <header className='header'>
                <h1>E-Z College</h1>
                <div className="header-right">
                    <span className="welcome-text">Welcome, {user.userID}</span>
                <Link to="/profile">
                            <img src={user_profile} alt="Profile" className='profile_icon'/>
                        </Link>
                </div>
                </header>
                
                    <ul className='menu'>
                        <li onClick={()=>{setMenu("all")}}>
                            <Link to="home/all" style={{textDecoration: "none"}}>All</Link>
                            {menu === "all" && <hr />}
                        </li>
                        <li onClick={()=>{setMenu("book")}}>
                            <Link to="home/book" style={{textDecoration: "none"}}>Book</Link>
                            {menu === "book" && <hr />}
                        </li>
                        <li onClick={()=>{setMenu("merch")}}>
                            <Link to="home/merch" style={{textDecoration: "none"}}>Merch</Link>
                            {menu === "merch" && <hr />}
                        </li>
                        <li onClick={()=>{setMenu("school-supplies")}}>
                            <Link to="home/school-supplies" style={{textDecoration: "none"}}>School Supplies</Link>
                            {menu === "school-supplies" && <hr />}
                        </li>
                        <li onClick={()=>{setMenu("technology")}}>
                            <Link to="home/technology" style={{textDecoration: "none"}}>Technology</Link>
                            {menu === "technology" && <hr />}
                        </li>
                        <li onClick={()=>{setMenu("dorm")}}>
                            <Link to="home/dorm" style={{textDecoration: "none"}}>Dorm</Link>
                            {menu === "dorm" && <hr />}
                        </li>
                        <li onClick={()=>{setMenu("health")}}>
                            <Link to="home/health" style={{textDecoration: "none"}}>Health/Fitness</Link>
                            {menu === "health" && <hr />}
                        </li>
                    </ul>     
               

            <div className="products">
                {filteredProducts.map(product => (
                    <Link to={`home/product/${product.id}`} key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p>Price: ${product.price}</p>
                </Link>
                ))}
            </div>
        </div>
    );
};

export default HomePage;