import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Load users from localStorage on initial render
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }

        // Check for a currently logged-in user
        const storedCurrentUserId = localStorage.getItem('currentUserId');
        if (storedCurrentUserId && storedUsers) {
            const foundUser = JSON.parse(storedUsers).find(user => user.userId === storedCurrentUserId);
            if (foundUser) {
                setCurrentUser(foundUser);
            }
        }
    }, []);

    const register = (username, password) => {
        if (users.find(user => user.username === username)) {
            throw new Error('Username already exists');
        }
        // In a real app, hash the password. For this example, storing plain text (not recommended for production).
        const newUserId = `user_${Date.now()}`;
        const newUser = { userId: newUserId, username, password }; 
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        // Automatically log in the new user
        login(username, password);
        return newUser;
    };

    const login = (username, password) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem('currentUserId', user.userId);
            return user;
        }
        throw new Error('Invalid username or password');
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUserId');
    };

    // Function to get data for the current user
    const getUserData = (key) => {
        if (!currentUser) return null;
        const dataKey = `${key}_${currentUser.userId}`;
        const data = localStorage.getItem(dataKey);
        return data ? JSON.parse(data) : null;
    };

    // Function to set data for the current user
    const setUserData = (key, data) => {
        if (!currentUser) return;
        const dataKey = `${key}_${currentUser.userId}`;
        localStorage.setItem(dataKey, JSON.stringify(data));
    };

    return (
        <AuthContext.Provider value={{ currentUser, users, register, login, logout, getUserData, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

