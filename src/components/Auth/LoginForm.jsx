import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }
        try {
            await login(username, password);
            // Optionally, redirect to a dashboard or show a success message
            alert('Login successful!');
             // Clear form
            setUsername('');
            setPassword('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-username">
                        Username
                    </label>
                    <input 
                        type="text" 
                        id="login-username"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your username"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-password">
                        Password
                    </label>
                    <input 
                        type="password" 
                        id="login-password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your password"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button 
                        type="submit" 
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;

