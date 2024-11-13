// Profile.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import user_profile from '../Assests/user-profile.png';
import './Profile.css';
import axios from 'axios';
import { data } from '@remix-run/router';

const Profile = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userProducts, setUserProducts] = useState([]);
    const [purchasedItems, setPurchasedItems] = useState([]);
    const [editForm, setEditForm] = useState({
        userID: user?.userID || '',
        email: user?.email || '',
        profilePicture: null
    });
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch user's products and purchased items
        fetchUserProducts();
        fetchPurchasedItems();
    }, [user]);

    const fetchUserProducts = async () => {
        try {
            const response = await axios.get(`/user-products/${user.userID}/`);
            if (response.ok) {
                const data = response.data;
                setUserProducts(data);
            }
        } catch (error) {
            console.error('Error fetching user products:', error);
        }
    };
    
    const fetchPurchasedItems = async () => {
        try {
            const response = await fetch(`http://localhost:8000/purchased-items/${user.userID}`);
            if (response.ok) {
                const data = await response.json();
                setPurchasedItems(data);
            }
        } catch (error) {
            console.error('Error fetching purchased items:', error);
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            const response = await fetch('/logout/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            setUser(null);
            localStorage.removeItem('user');
            setIsDropdownOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setEditForm(prev => ({
            ...prev,
            profilePicture: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Check if username is taken
            if (editForm.userID !== user.userID) {
                const usernameCheck = await fetch(`http://localhost:8000/check-username/${editForm.userID}`);
                const usernameData = await usernameCheck.json();
                if (usernameData.taken) {
                    setError('Username is already taken');
                    return;
                }
            }

            // Check if email is taken
            if (editForm.email !== user.email) {
                const emailCheck = await fetch(`http://localhost:8000/check-email/${editForm.email}`);
                const emailData = await emailCheck.json();
                if (emailData.taken) {
                    setError('Email is already taken');
                    return;
                }
            }

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('userID', editForm.userID);
            formData.append('email', editForm.email);
            if (editForm.profilePicture) {
                formData.append('profilePicture', editForm.profilePicture);
            }

            const response = await fetch(`http://localhost:8000/update-profile/${user.userID}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const response = await fetch(`/users/${user.userID}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (response.ok) {
                    setUser(null);
                    localStorage.removeItem('user');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className='profile-page'>
            <header className='header'>
                <h1>E-Z COLLEGE</h1>
                <div className="header-right">
                    <span className="welcome-text">WELCOME, {user?.userID}</span>
                    <div className="profile-container" onClick={toggleDropdown}>
                        <img 
                            src={user.profilePicture || user_profile} 
                            alt="Profile" 
                            className='profile_icon'
                        />
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/profile" className="dropdown-item">Profile</Link>
                                <Link to="/favorites" className="dropdown-item">Favorites</Link>
                                <Link to="/product-upload" className="dropdown-item">Add Item</Link>
                                <button onClick={handleLogout} className="dropdown-item">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="profile-content">
                <div className="profile-header">
                    <img 
                        src={user.profilePicture || user_profile} 
                        alt="Profile" 
                        className="large-profile-image" 
                    />
                    {!isEditing ? (
                        <div className="profile-info">
                            <h2>{user.userID}</h2>
                            <p>{user.email}</p>
                            <button onClick={() => setIsEditing(true)} className="edit-button">
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="edit-form">
                            {error && <p className="error-message">{error}</p>}
                            <div className="form-group">
                                <label>Username:</label>
                                <input
                                    type="text"
                                    name="userID"
                                    value={editForm.userID}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Profile Picture:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="submit" className="save-button">Save</button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditing(false)} 
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="user-items-section">
                    <div className="items-for-sale">
                        <h3>Items For Sale</h3>
                        <div className="products-grid">
                            {userProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <img src={product.image} alt={product.name} />
                                    <h4>{product.name}</h4>
                                    <p>${product.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="purchased-items">
                        <h3>Purchased Items</h3>
                        <div className="products-grid">
                            {purchasedItems.map(item => (
                                <div key={item.id} className="product-card">
                                    <img src={item.image} alt={item.name} />
                                    <h4>{item.name}</h4>
                                    <p>${item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="deactivate">
                    <h3>Deactivate</h3>
                    <button 
                        onClick={handleDeleteAccount}
                        className="delete-account-button"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;