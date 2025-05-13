import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import RegistrationForm from './components/Auth/RegistrationForm';
import LoginForm from './components/Auth/LoginForm';
import InsightsList from './components/Insights/InsightsList';
import HealthDashboard from './components/Health/HealthDashboard';
import BookmarksList from './components/Bookmarks/BookmarksList';
import GoalsList from './components/Goals/GoalsList';
import TodoList from './components/Todos/TodoList';

const NAV_ITEMS = {
    INSIGHTS: 'Insights',
    HEALTH: 'Health',
    BOOKMARKS: 'Bookmarks',
    GOALS: 'Goals',
    TODOS: 'Todos',
};

function AppContent() {
    const { currentUser, logout } = useAuth();
    const [activeModule, setActiveModule] = useState(NAV_ITEMS.INSIGHTS); // Default module

    const renderActiveModule = () => {
        switch (activeModule) {
            case NAV_ITEMS.INSIGHTS:
                return <InsightsList />;
            case NAV_ITEMS.HEALTH:
                return <HealthDashboard />;
            case NAV_ITEMS.BOOKMARKS:
                return <BookmarksList />;
            case NAV_ITEMS.GOALS:
                return <GoalsList />;
            case NAV_ITEMS.TODOS:
                return <TodoList />;
            default:
                return <InsightsList />;
        }
    };

    if (currentUser) {
        return (
            <div className="min-h-screen flex flex-col">
                <header className="bg-white shadow-md sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
                        <h1 className="text-2xl font-bold text-indigo-600">Personal Growth Hub</h1>
                        <div className="flex items-center mt-2 sm:mt-0">
                            <span className="mr-4 text-gray-600 text-sm">Welcome, {currentUser.username}!</span>
                            <button 
                                onClick={logout} 
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-md text-sm focus:outline-none focus:shadow-outline transition duration-150"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                    <nav className="bg-gray-100">
                        <div className="container mx-auto px-4 py-2 flex flex-wrap justify-center space-x-2 sm:space-x-4">
                            {Object.values(NAV_ITEMS).map(item => (
                                <button 
                                    key={item}
                                    onClick={() => setActiveModule(item)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition duration-150 
                                                ${activeModule === item 
                                                    ? 'bg-indigo-500 text-white shadow-sm'
                                                    : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'}`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </nav>
                </header>
                
                <main className="flex-grow container mx-auto p-4">
                    {renderActiveModule()}
                </main>

                <footer className="bg-gray-800 text-white text-center p-4 text-sm">
                    © {new Date().getFullYear()} Personal Growth Hub. All rights reserved.
                </footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-4xl">
                <h1 className="text-4xl font-bold text-center text-gray-700 my-8">Personal Growth Hub</h1>
                <div className="grid md:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-2xl">
                    <RegistrationForm />
                    <LoginForm />
                </div>
                 <footer className="text-gray-600 text-center p-4 text-sm mt-8">
                    © {new Date().getFullYear()} Personal Growth Hub.
                </footer>
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;

