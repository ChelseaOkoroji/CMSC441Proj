import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useUser } from '../../UserContext';
import user_profile from '../Assests/user-profile.png';
import './itempage.css';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { category } = useParams();
  const itemsPerPage = 25;
  const navigate = useNavigate();
  const { user, setUser } = useUser();  // Add setUser from context

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default navigation
    e.stopPropagation(); // Stop event bubbling
    
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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let url = `http://localhost:8000/products/?page=${currentPage}&limit=${itemsPerPage}`;
        if (category && category !== 'all') {
          url += `&category=${category}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch items');
        const data = await response.json();
        
        // Filter items based on search query
        const filteredItems = data.items.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setItems(filteredItems || []);
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentPage, category, searchQuery]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    navigate(`/home/${newCategory}`);
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'book', name: 'Book' },
    { id: 'merch', name: 'Merch' },
    { id: 'school-supplies', name: 'School Supplies' },
    { id: 'technology', name: 'Technology' },
    { id: 'dorm', name: 'Dorm' },
    { id: 'health', name: 'Health/Fitness' }
  ];
  
  return (
    <>
      {/* Separate top search bar */}
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

      <div className="header-container">
        <div className="header">
          <h1>E-Z COLLEGE</h1>
          <div className="header-right">
            <span className="welcome-text">WELCOME, {user?.userID}</span>
            <div className="profile-container" onClick={toggleDropdown}>
              <img src={user_profile} alt="Profile" className="profile_icon" />
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  <Link to="/favorites" className="dropdown-item">Favorites</Link>
                  <Link to="/items" className="dropdown-item">Add Item</Link>
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
        </div>
      </div>


      <ul className="menu">
        {['ALL', 'BOOK', 'MERCH', 'SCHOOL SUPPLIES', 'TECHNOLOGY', 'DORM', 'HEALTH/FITNESS'].map((item) => (
          <li key={item} className={selectedCategory === item.toLowerCase() ? 'active' : ''}>
            <Link to={`/home/${item.toLowerCase()}`}>{item}</Link>
          </li>
        ))}
      </ul>

      <div className="marketplace-container">
        <div className="items-grid">
          {items.map((item) => (
            <div
              key={item.productID}
              className="item-card"
              onClick={() => navigate(`/product/${item.productID}`)}
            >
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="price">PRICE: ${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Marketplace;