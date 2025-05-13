import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function RegistrationForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }
        try {
            await register(username, password);
            // Optionally, redirect or show a success message
            alert('Registration successful! You are now logged in.');
            // Clear form
            setUsername('');
            setPassword('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Register</h2>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg-username">
                        Username
                    </label>
                    <input 
                        type="text" 
                        id="reg-username"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Choose a username"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg-password">
                        Password
                    </label>
                    <input 
                        type="password" 
                        id="reg-password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Choose a password"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegistrationForm;

