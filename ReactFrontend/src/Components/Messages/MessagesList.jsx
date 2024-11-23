import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { checkForUser } from '../CheckForUser/CheckForUser';
import user_profile from '../Assests/user-profile.png';
import './MessagesList.css';
import axios from 'axios';

const MessagesList = ({ onSelectConversation }) => {

    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const [sentConversations, setSentConversations] = useState([]);
    const [receivedConversations, setReceivedConversations] = useState([]);
    const [loadingSent, setLoadingSent] = useState(true);
    const [loadingReceived, setLoadingReceived] = useState(true);

    checkForUser(user);

    useEffect(() => {
        // Get user's sent and received messages
        getSent();
        getReceived();
    }, [user]);

    // Get sent messages
    const getSent = async () => {
        setLoadingSent(true);
        if(user) {
            try {
                const response = await axios.get(`/sent/${user.userID}/`);
                setSentConversations(response.data);
            } catch(error) {
                console.error('Error getting sent messages', error);
                alert('Error fetching sent messages');
            } finally {
                setLoadingSent(false);
            }
        }
    };
    
    // Get received messages
    const getReceived = async() => {
        setLoadingReceived(true);
        if(user) {
            try {
                const response = await axios.get(`/received/${user.userID}/`);
                setReceivedConversations(response.data);
            } catch(error) {
                console.error('Error getting received messages', error);
                alert('Error fetching received messages');
            } finally {
                setLoadingReceived(false);
            }
        }
    };

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

    const selectConversation = (convo_id) => {
        navigate(`/messages/${convo_id}`);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className='main'>
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

            <div className="convo-list">
                <h2>Conversations</h2>
                <div className="convo-section">
                    <h3>Sent Messages</h3>
                    {loadingSent ? (
                        <p>Loading sent messages...</p>
                    ) : (
                        <ul>
                            {sentConversations.length > 0 ? (
                                sentConversations.map((convo) => (
                                    <li key={convo.convo_id} onClick={() => selectConversation(convo.convo_id)}>
                                        <div className="convo-item">
                                            <strong>{convo.product.name}</strong>
                                            <p>To: {convo.receiver_id}</p>
                                            <p>{convo.message.length > 15 ? `${convo.message.slice(0, 15)}...` : convo.message}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className='empty'>No sent messages yet.</p>
                            )}
                        </ul>
                    )}
                </div>

                <div className="convo-section">
                    <h3>Received Messages</h3>
                    {loadingReceived ? (
                        <p>Loading received messages...</p>
                    ) : (
                        <ul>
                            {receivedConversations.length > 0 ? (
                                receivedConversations.map((convo) => (
                                    <li key={convo.convo_id} onClick={() => selectConversation(convo.convo_id)}>
                                        <div className="convo-item">
                                            <strong>{convo.product.name}</strong>
                                            <p>From: {convo.sender_id}</p>
                                            <p>{convo.message.length > 15 ? `${convo.message.slice(0, 15)}...` : convo.message}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className='empty'>No received messages yet.</p>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesList;
