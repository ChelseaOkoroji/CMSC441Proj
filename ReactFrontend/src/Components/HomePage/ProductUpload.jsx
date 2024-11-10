import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../UserContext';
import user_profile from '../Assests/user-profile.png';
import './ProductUpload.css';
import axios from 'axios';

const ProductUpload = () => {

    const { user } = useUser();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [color, setColor] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = useUser();

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
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('color', color);
        formData.append('category', category);
        formData.append('image', image);

        try {
            const response = await axios.post('/product/', formData);
            sessionStorage.setItem('product', JSON.stringify(response.data));
            navigate('/home');
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            const response = await fetch('http://localhost:8000/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setUser(null);
                localStorage.removeItem('user');
                setIsDropdownOpen(false);
                navigate('/');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
        try {
            const response = await axios.post('/create-product/', myproduct, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            sessionStorage.setItem('product', JSON.stringify(response.data));
            navigate('/product-upload-success');
        } catch (error) {
            console.error("Error uploading product:", error);
            alert("Failed to upload product. Please try again.");
        }
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    return (
        <>
            <header className="header">
                <h1>E-Z COLLEGE</h1>
                <div className="header-right">
                    <span className="welcome-text">WELCOME, {user?.userID}</span>
                    <div className="profile-container" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <img src={user_profile} alt="Profile" className="profile_icon" />
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/profile" className="dropdown-item">Profile</Link>
                                <Link to="/favorites" className="dropdown-item">Favorites</Link>
                                <Link to="/product-upload" className="dropdown-item">Add Item</Link>
                                <button
                                    onClick={handleLogout}
                                    className="dropdown-item"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        width: '100%',
                                        textAlign: 'left',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="product-upload">
                <h1>Upload your Product</h1>
                <form onSubmit={handleProductUpload}>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        <option value="book">Books</option>
                        <option value="merch">Merch</option>
                        <option value="school-supplies">School Supplies</option>
                        <option value="technology">Technology</option>
                        <option value="dorm">Dorm</option>
                        <option value="health">Health/Fitness</option>
                    </select>
                    <div className="file-input-container">
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </div>
                    <button type="submit">Upload Product</button>
                </form>
            </div>
        </>
        <div className='product-upload'>
            <h1>Upload your Product</h1>
            <form onSubmit={handleProductUpload}>
                <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                <input type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="book">Books</option>
                    <option value="merch">Merch</option>
                    <option value="school-supplies">School Supplies</option>
                    <option value="technology">Technology</option>
                    <option value="dorm">Dorm</option>
                    <option value="health">Health/Fitness</option>
                </select>
                <input type="file" onChange={handleImageChange} accept="image/*" />
                <button type="submit">Upload Product</button>
            </form>
        </div>
    );
};

export default ProductUpload;