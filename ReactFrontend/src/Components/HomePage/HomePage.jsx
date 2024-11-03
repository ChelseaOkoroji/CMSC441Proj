import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
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
    const [menu, setMenu] = useState("all"); 
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
    const [searchBar, setSearchBar] = useState(""); 


    const filteredProducts = all_products.filter(product => {
        const matchesCategory = menu === "all" || product.category === menu;
        const matchesSearch = product.name.toLowerCase().includes(searchBar.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    return (
        <div className='homepage'>
            <header className='header'>          
                <h1>E-Z College</h1>
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchBar} 
                        onChange={(e) => setSearchBar(e.target.value)} 
                    />
             </div>
                <div className="header-right">
                    <span className="welcome-text">Welcome, {user.userID}</span>
                    <div className="profile-container" onClick={toggleDropdown}>
                        <img src={user_profile} alt="Profile" className='profile_icon'/>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/profile" className="dropdown-item">Profile</Link>
                                <Link to="/favorites" className="dropdown-item">Favorites</Link>
                                <Link to="/items" className="dropdown-item">Add Item</Link>
                                <Link to="/logout" className="dropdown-item">Logout</Link>
                            </div>
                        )}
                    </div>
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