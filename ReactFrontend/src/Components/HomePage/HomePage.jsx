import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../UserContext';
import empty_img from '../Assests/empty_img.png';
import user_profile from '../Assests/user-profile.png';
import axios from 'axios';
import { FaRegHeart } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { checkForUser } from '../CheckForUser/CheckForUser';
import MessageModal from '../MessageModal/MessageModal';
import Modal from '../Modal/Modal';

const HomePage = () => {
    const [menu, setMenu] = useState("all");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const itemsPerPage = 25;

    // This is the modal for error/success messages
    const [modalMessage, setModalMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    // This is the modal for sending a message
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    // Setting sellerID is necessary for the Modal
    const [seller, setSeller] = useState(null);
    // Setting productID is necessary for the Modal
    const [product, setProduct] = useState(null);
    // For display, navigation, and current user
    const { category } = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    checkForUser(user);

    useEffect(() => {
        document.body.classList.add('homepage-page');
        return () => {
            document.body.classList.remove('homepage-page');
        };
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch the products from the FastAPI backend
                const response = await axios.get('/products/', {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        category: menu,
                        name: searchQuery 
                    }
                });

                setProducts(response.data.items);
                setTotalPages(response.data.pages);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [menu, searchQuery, currentPage]);

    const handleLogout = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            const response = await axios.post(`/logout/${user.userID}/`, {
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

    const handleAddToFavorites = async (productID) => {
        try {
            const userID = user.userID;
            const response = await axios.post('/create-favorite/', {
                userID,
                productID,
            });
            // Optionally update UI state here
            alert("Added to favorites successfully!");
        } catch (error) {
            console.error("Error favoriting product:", error.response?.data || error.message);
            alert("Failed to favorite product. Please try again.");
        }
    };

    // Called from html
    const sendMessage = async (userID, sellerID, productID, message) => {
        try {
            const myMessage = {
                sender_id: userID,
                receiver_id: sellerID,
                product_id: productID,
                message: message
            };
            const response = axios.post('/send-message/', myMessage);
            setModalMessage("Message sent!");
            setModalVisible(true);

        } catch(error) {
            console.error("Message sending error", error);
            setModalMessage("Failed to send message. Please try again.");
            setModalVisible(true);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Open modal for sending a message
    const handleOpenMessageModal = (sellerID, productID) => {
        setSeller(sellerID);
        setProduct(productID);
        setMessageModalVisible(true);
    };

    // Close modal for sending a message
    const handleCloseMessageModal = () => {
        setMessageModalVisible(false);
    };

    // Close modal for success/error messages
    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const filteredProducts = products.filter(product => {
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
                <Link to="/home/home/all" className="header-title">
                    <h1>E-Z COLLEGE</h1>
                </Link>
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="header-right">
                    <span className="welcome-text">WELCOME, {user?.userID}</span>
                    <div className="profile-container" onClick={toggleDropdown}>
                        <img src={user_profile} alt="Profile" className='profile_icon' />
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/profile" className="dropdown-item">Profile</Link>
                                <Link to="/product-upload" className="dropdown-item">Add Item</Link>
                                <Link to="/messages" className="dropdown-item">Messages</Link>
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

            <ul className='menu'>
                <li onClick={() => setMenu("all")}>
                    <Link to="home/all" style={{textDecoration: "none"}}>All</Link>
                    {menu === "all" && <hr />}
                </li>
                <li onClick={() => setMenu("book")}>
                    <Link to="home/book" style={{textDecoration: "none"}}>Book</Link>
                    {menu === "book" && <hr />}
                </li>
                <li onClick={() => setMenu("merch")}>
                    <Link to="home/merch" style={{textDecoration: "none"}}>Merch</Link>
                    {menu === "merch" && <hr />}
                </li>
                <li onClick={() => setMenu("school-supplies")}>
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

            <div className="product-list">
                {loading ? (
                    <div>Loading products...</div>
                ) : (
                    filteredProducts.map(product => (
                        <div key={product.productID} className="product-card">
                            <img 
                                src={product.image ? product.image : empty_img} 
                                alt={product.name || "Product"} 
                                className="product-image" 
                            />
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p>${product.price.toFixed(2)}</p>
                                <div className="product-attributes">
                                <button 
                                    onClick={() => handleAddToFavorites(product.productID)} 
                                    className="favorite-button"
                                >
                                    Add to favorites
                                </button>
                                <button
                                    onClick={() => handleOpenMessageModal(product.userID, product.productID)}
                                    className="message-button"
                                >
                                    Message seller
                                </button>
                            </div>
                             
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="pagination">
                {currentPage > 1 && (
                    <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                )}
                <span>{currentPage} / {totalPages}</span>
                {currentPage < totalPages && (
                    <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                )}
            </div>
            <MessageModal
                isOpen={messageModalVisible}
                onClose={handleCloseMessageModal} 
                onSendMessage={sendMessage}
                userID={user.userID}
                sellerID={seller}
                productID={product}
            />
            {modalVisible && (
                <Modal message={modalMessage} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default HomePage;