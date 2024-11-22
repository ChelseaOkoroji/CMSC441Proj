import React, { useState } from 'react';
import './MessageModal.css'; 

const MessageModal = ({ isOpen, onClose, onSendMessage, userID, sellerID, productID }) => {
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if(message.trim() === "") {
            alert("Please enter a message.");
            return;
        }
        onSendMessage(userID, sellerID, productID, message);
        setMessage("");
        onClose();
    };

    if(!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Send a Message to Seller {sellerID}</h2>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    rows="5"
                    cols="40"
                />
                <div className='modal-options'>
                    <button onClick={handleSendMessage}>Send</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;