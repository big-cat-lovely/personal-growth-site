import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import InsightForm from './InsightForm';

function InsightsList() {
    const { currentUser, getUserData, setUserData } = useAuth();
    const [insights, setInsights] = useState([]);
    const [editingInsight, setEditingInsight] = useState(null); // null or insight object
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (currentUser) {
            const userInsights = getUserData('insights') || [];
            setInsights(userInsights);
        }
    }, [currentUser, getUserData]);

    const handleSaveInsight = (savedInsight) => {
        // This function is called from InsightForm after an insight is saved to localStorage
        // So, we just need to refresh the list from localStorage
        const updatedInsights = getUserData('insights') || [];
        setInsights(updatedInsights);
        setEditingInsight(null);
        setShowForm(false);
    };

    const handleEdit = (insight) => {
        setEditingInsight(insight);
        setShowForm(true);
    };

    const handleDelete = (insightId) => {
        if (window.confirm('Are you sure you want to delete this insight?')) {
            let currentInsights = getUserData('insights') || [];
            currentInsights = currentInsights.filter(ins => ins.id !== insightId);
            setUserData('insights', currentInsights);
            setInsights(currentInsights);
        }
    };

    const handleCancelEdit = () => {
        setEditingInsight(null);
        setShowForm(false);
    };

    const handleAddNew = () => {
        setEditingInsight(null); // Ensure we are creating a new one
        setShowForm(true);
    };

    if (!currentUser) {
        return <p className="text-center text-gray-600 mt-8">Please log in to view and manage your insights.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">My Insights</h2>
                <button 
                    onClick={handleAddNew}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                >
                    Add New Insight
                </button>
            </div>

            {showForm && (
                <InsightForm 
                    currentInsight={editingInsight}
                    onSave={handleSaveInsight}
                    onCancel={handleCancelEdit}
                />
            )}

            {!showForm && insights.length === 0 && (
                <p className="text-center text-gray-500">No insights yet. Click 'Add New Insight' to get started!</p>
            )}

            {!showForm && insights.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {insights.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(insight => (
                        <div key={insight.id} className="bg-white rounded-xl shadow-lg overflow-hidden p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                            <h3 className="text-xl font-semibold text-indigo-700 mb-2">{insight.title}</h3>
                            {/* Render HTML content safely, or a snippet */}
                            <div 
                                className="text-gray-600 prose prose-sm max-h-40 overflow-y-auto mb-4"
                                dangerouslySetInnerHTML={{ __html: insight.content.substring(0, 200) + (insight.content.length > 200 ? '...' : '') }}
                            ></div>
                            <p className="text-xs text-gray-400 mb-4">
                                Created: {new Date(insight.createdAt).toLocaleDateString()} | 
                                Updated: {new Date(insight.updatedAt).toLocaleDateString()}
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button 
                                    onClick={() => handleEdit(insight)} 
                                    className="text-sm text-blue-500 hover:text-blue-700 font-medium"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(insight.id)} 
                                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default InsightsList;

