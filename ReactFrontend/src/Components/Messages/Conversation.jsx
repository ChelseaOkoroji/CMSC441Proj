import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from '../../UserContext';
import { checkForUser } from '../CheckForUser/CheckForUser';
import user_profile from '../Assests/user-profile.png';
import './Conversation.css';
import axios from "axios";

const Conversation = () => {
    // convo_id is in the URL
    const { convo_id } = useParams();
    // There can be multiple messages in one conversation (i.e. one convo_id)
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        // Get the entire conversation
        getConversation();
    }, [convo_id]);

    const getConversation = async() => {
        setLoading(true);
        try {
            const response = await axios.put(`/read/${convo_id}/`);
            setConversation(response.data);
        } catch(error) {
            alert("Error fetching conversation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Conversation</h1>
            {loading ? (
                <p>Loading conversation...</p>
            ) : (
                <div className="convo">
                    {conversation.length > 0 ? (
                        conversation.map((convo) => (
                            <div 
                                key={convo.message_id}
                                className={`message ${convo.sender_id === convo.receiver_id ? 'sent' : 'received'}`}
                            >
                                <p className="convo-text">{convo.message}</p>
                                <span className="convo-info">
                                    {convo.sent_at} - {convo.sender_id}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p>No messages in this conversation.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Conversation;