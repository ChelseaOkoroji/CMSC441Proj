import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from '../../UserContext';
import { checkForUser } from '../CheckForUser/CheckForUser';
import { format } from 'date-fns';
import user_profile from '../Assests/user-profile.png';
import './Conversation.css';
import axios from "axios";

const Conversation = () => {
    // convo_id is in the URL
    const { convo_id } = useParams();
    // There can be multiple messages in one conversation (i.e. one convo_id)
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(null);
    // Other requirements
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [reply, setReply] = useState('');
    // Needed for sending new message in text chain
    const [productID, setProductID] = useState(null); 
    const [receiverID, setReceiverID] = useState(null);

    checkForUser(user);

    useEffect(() => {
        // Get the entire conversation
        getConversation();
    }, [convo_id]);

    const getConversation = async() => {
        setLoading(true);
        try {
            const response = await axios.put(`/read/${convo_id}/`);
            const convoData = response.data;
            setConversation(convoData);
            // Store receiverID and productID
            setProductID(convoData[0].product_id);
            if(convoData[0].receiver_id === user.userID) {
                setReceiverID(convoData[0].sender_id);
            } else {
                setReceiverID(convoData[0].receiver_id);
            }
        } catch(error) {
            alert("Error fetching conversation.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendReply = async () => {
        if(reply.trim() === "") {
            alert("Please enter a message.");
            return;
        }
        try {
            const message = { 
                sender_id: user.userID, 
                receiver_id: receiverID,
                product_id: productID,
                message: reply,
                convo_id: convo_id
            };
            console.log(message);
            const response = await axios.post("/send-message/", message);
            setReply('');
            // Updates to include the message just sent
            getConversation();
        } catch(error) {
            alert("Error sending message. Please try again");
        }
    };

    const backToMessages = () => {
        navigate('/messages'); 
    };

    const formatTime = (time) => {
        // Better time format
        return format(new Date(time), 'MMM dd, yyyy HH:mm');
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
                                className={`message ${convo.sender_id === user.userID ? 'sent' : 'received'}`}
                            >
                                <p className="convo-text">{convo.message}</p>
                                <span className="convo-info">
                                    {formatTime(convo.sent_at)} - {convo.sender_id}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p>No messages in this conversation.</p>
                    )}
                </div>
            )}
            <div className="reply">
                <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Enter your reply"
                    rows="5"
                    cols="40"
                />
                <div id="send-reply-container">
                    <button id="send-reply" onClick={handleSendReply}>Send Message</button>
                </div>
            </div>
        </div>
    );
};

export default Conversation;