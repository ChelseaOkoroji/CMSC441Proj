import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../UserContext';
import user_profile from '../Assests/user-profile.png';
import all_products from '../Assests/all_products';

const HomePage = () => {
    const [menu, setMenu] = useState("all");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 25;

    const { category } = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    useEffect(() => {
        document.body.classList.add('homepage-page');
        return () => {
            document.body.classList.remove('homepage-page');
        };
    }, []);

    // Handle logout functionality
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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Filter products based on category and search query
    const filteredProducts = all_products.filter(product => {
        const matchesCategory = menu === "all" || product.category === menu;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className='homepage'>
            {/* Top search bar */}
            <div className="top-search-container">
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <header className='header'>
                <h1>E-Z COLLEGE</h1>
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
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        display: 'block',
                                        color: 'inherit',
                                        fontFamily: 'inherit',
                                        fontSize: 'inherit'
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <ul className='menu'>
                {['ALL', 'BOOK', 'MERCH', 'SCHOOL SUPPLIES', 'TECHNOLOGY', 'DORM', 'HEALTH/FITNESS'].map((item) => (
                    <li
                        key={item}
                        onClick={() => setMenu(item.toLowerCase())}
                        className={menu === item.toLowerCase() ? 'active' : ''}
                    >
                        <Link to={`/home/${item.toLowerCase()}`} style={{ textDecoration: "none" }}>
                            {item}
                        </Link>
                        {menu === item.toLowerCase() && <hr />}
                    </li>
                ))}
            </ul>

            <div className="products">
                {filteredProducts.map(product => (
                    <div
                        key={product.id}
                        className="product-card"
                        onClick={() => navigate(`/product/${product.id}`)}
                    >
                        <div className="product-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p className="price">PRICE: ${product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;