import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const checkForUser = ( checkUser ) => {
    const navigate = useNavigate();

    useEffect(() => {
        if(!checkUser) {
            navigate('/');
        }
    }, [checkUser, navigate]);
};