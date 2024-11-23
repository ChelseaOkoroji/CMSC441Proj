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
        setLoading(true);
        try {

        } catch(error) {

        } finally {
            setLoading(false);
        }
    }, [convo_id]);

};

export default Conversation;