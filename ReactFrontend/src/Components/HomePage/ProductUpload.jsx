import './ProductUpload.css';
import React, { useState, useEffect } from 'react';
import user_profile from '../Assests/user-profile.png';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../UserContext';

const ProductUpload = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, setUser } = useUser();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [color, setColor] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const userID = user.userID;

    const handleProductUpload = async (event) => {
        event.preventDefault();
    
        const myproduct = {
            name,
            description,
            price: parseFloat(price), 
            quantity: parseInt(quantity),  
            color,
            category,
            image: image ? image.name : '',  
            userID
        };
        const formData = new FormData();
        formData.append('userID', userID)
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('color', color);
        formData.append('category', category);
        formData.append('image', image);
    
        try {
            const response = await axios.post('/create-product/', formData);
            navigate('/product-upload-success');
        } catch (error) {
            console.error("Error uploading product:", error);
            alert("Failed to upload product. Please try again.");
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            const response = await axios.post(`/logout/${userID}/`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setUser(null);
            sessionStorage.removeItem('user');
            setIsDropdownOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
            alert("Unexpected error during logout");
        }
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className='homepage'>
            <header className='header'>
                <Link to="/home/home/all" className="header-title">
                    <h1>E-Z COLLEGE</h1>
                </Link>
                <div className="header-right">
                    <span className="welcome-text">WELCOME, {user?.userID}</span>
                    <div className="profile-container" onClick={toggleDropdown}>
                        <img src={user_profile} alt="Profile" className='profile_icon' />
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/profile" className="dropdown-item">Profile</Link>
                                <Link to="/favorites" className="dropdown-item">Favorites</Link>
                                <Link to="/product-upload" className="dropdown-item">Add Item</Link>
                                <button
                                    onClick={handleLogout}
                                    className="dropdown-item"
                                    id="logout"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className='product-upload'>
                <h1>Upload your Product</h1>
                <form onSubmit={handleProductUpload}>
                    <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required/>
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required/>
                    <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required/>
                    <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required/>
                    <select value={color} onChange={(e) => setColor(e.target.value)} >
                        <option value="" disabled>Select Color</option>
                        <option value="red">Red</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="gray">Gray</option>
                        <option value="pink">Pink</option>
                        <option value="white">White</option>
                        <option value="black">Black</option>
                    </select>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="" disabled>Select Category</option>
                        <option value="book">Books</option>
                        <option value="merch">Merch</option>
                        <option value="school-supplies">School Supplies</option>
                        <option value="technology">Technology</option>
                        <option value="dorm">Dorm</option>
                        <option value="health">Health/Fitness</option>
                    </select>
                    <input type="file" onChange={handleImageChange} accept="image/*" required/>
                    <button type="submit">Upload Product</button>
                </form>
            </div>
        </div>
    );
};

export default ProductUpload;