import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import user_profile from '../Assests/user-profile.png';
import './Profile.css';
import axios from 'axios';

const Profile = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userProducts, setUserProducts] = useState([]);
    const [favoritedProducts, setFavoritedProducts] = useState([]);
    const [editForm, setEditForm] = useState({
        userID: user?.userID || '',
        email: user?.email || '',
        profilePicture: null
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchUserProducts();
            fetchFavoritedProducts();
        }
    }, [user]);

    const fetchUserProducts = async () => {
        try {
            const response = await axios.get(`/user-products/${user.userID}/`);
            if (response.status === 200) {
                setUserProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching user products:', error);
        }
    };

    const removeProduct = async (productID) => {
        if (!window.confirm("Are you sure you want to remove this product?")) {
            return;
        }
    
        try {
            const response = await axios.delete(`/users/${user.userID}/products/${productID}/`);
            if (response.status === 200) {
                setUserProducts((prevProducts) =>
                    prevProducts.filter((product) => product.productID !== productID)
                );
                console.log('Product removed successfully');
            } else {
                console.error('Failed to remove product');
            }
        } catch (error) {
            console.error('Error removing product:', error);
        }
    };

    const fetchFavoritedProducts = async () => {
        try {
            const response = await axios.get(`/user-favorites/${user.userID}/`);
            if (response.status === 200) {
                setFavoritedProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching favorited products:', error);
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
            const formData = new FormData();
            formData.append('newUserID', editForm.userID);
            formData.append('newEmail', editForm.email);
            if (editForm.profilePicture) {
                formData.append('profilePicture', editForm.profilePicture);
            }

            const response = await axios.put(`/update-profile/${user.userID}/`, formData);

            if (response.status === 200) {
                const updatedUser = response.data;
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
                <Link to="/home/home/all" className="header-title">
                    <h1>E-Z COLLEGE</h1>
                </Link>
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
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleInputChange}
                                    required
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
                                    <p>Price: ${product.price}</p>
                                    <button 
                                        onClick={() => removeProduct(product.id)} 
                                        className="remove-product-button"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="favorited-products">
                        <h3>Favorited Products</h3>
                        {favoritedProducts.length > 0 ? (
                            favoritedProducts.map((product) => (
                                <div key={product.productID} className="product-card">
                                    <img src={product.product.image} alt={product.product.name} />
                                    <h4>{product.product.name}</h4>
                                    <p>Price: ${product.product.price}</p>
                                    <button>Remove Favorited Item</button>
                                </div>
                            ))
                        ) : (
                            <p>No favorited products yet.</p>
                        )}
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