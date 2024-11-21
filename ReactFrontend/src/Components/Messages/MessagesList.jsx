import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { checkForUser } from '../CheckForUser/CheckForUser';
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

    checkForUser(user)

    useEffect(() => {
        // Get user's sent and received messages
        getSent();
        getReceived();
    }, [user]);

    // Get sent messages
    const getSent = async () => {
        setLoadingSent(true);
        try {
            const response = await axios.get(`/sent/${user.id}/`);
            setSentConversations(response.data);
        } catch(error) {
            console.error('Error getting sent messages', error);
            alert('Error fetching sent messages');
        } finally {
            setLoadingSent(false);
        }
    };
    
    // Get received messages
    const getReceived = async() => {
        setLoadingReceived(true);
        try {
            const response = await axios.get(`/received/${user.id}/`);
            setReceivedConversations(response.data);
        } catch(error) {
            console.error('Error getting received messages', error);
            alert('Error fetching received messages');
        } finally {
            setLoadingReceived(false);
        }
    };

    return (
        <div className="conversation-list">
            <h2>Conversations</h2>
            <div className="convo-section">
                <h3>Sent Messages</h3>
                {loadingSent ? (
                    <p>Loading sent messages...</p>
                ) : (
                    <ul>
                        {sentConversations.length > 0 ? (
                            sentConversations.map((convo) => (
                                <li key={convo.convo_id} onClick={() => onSelectConversation(convo.convo_id)}>
                                    <div className="conversation-item">
                                        <strong>{convo.product.name}</strong>
                                        <p>{convo.last_message}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No sent messages yet.</p>
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
                                <li key={convo.convo_id} onClick={() => onSelectConversation(convo.convo_id)}>
                                    <div className="conversation-item">
                                        <strong>{convo.product.name}</strong>
                                        <p>{convo.last_message}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No received messages yet.</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MessagesList;
