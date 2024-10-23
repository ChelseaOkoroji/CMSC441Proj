import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Check local storage
        const savedUser = sessionStorage.getItem('user');
        if(savedUser) {
            return JSON.parse(savedUser)
        }
        return null;
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};