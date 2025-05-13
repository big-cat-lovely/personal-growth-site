import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import GoalForm from "./GoalForm";

function GoalsList() {
    const { currentUser, getUserData, setUserData } = useAuth();
    const [goals, setGoals] = useState([]);
    const [editingGoal, setEditingGoal] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All"); // All, To Do, In Progress, Completed

    useEffect(() => {
        if (currentUser) {
            const userGoals = getUserData("goals") || [];
            setGoals(userGoals);
        }
    }, [currentUser, getUserData]);

    const handleSaveGoal = (savedGoal) => {
        const updatedGoals = getUserData("goals") || [];
        setGoals(updatedGoals);
        setEditingGoal(null);
        setShowForm(false);
    };

    const handleEdit = (goal) => {
        setEditingGoal(goal);
        setShowForm(true);
    };

    const handleDelete = (goalId) => {
        if (window.confirm("Are you sure you want to delete this goal?")) {
            let currentGoals = getUserData("goals") || [];
            currentGoals = currentGoals.filter(g => g.id !== goalId);
            setUserData("goals", currentGoals);
            setGoals(currentGoals);
        }
    };

    const handleCancelEdit = () => {
        setEditingGoal(null);
        setShowForm(false);
    };

    const handleAddNew = () => {
        setEditingGoal(null);
        setShowForm(true);
    };

    const filteredGoals = goals.filter(goal => {
        if (filterStatus === "All") return true;
        return goal.status === filterStatus;
    });

    if (!currentUser) {
        return <p className="text-center text-gray-600 mt-8">Please log in to view and manage your goals.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">My Goals</h2>
                <div className="flex items-center gap-4">
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                        <option value="All">All Statuses</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button 
                        onClick={handleAddNew}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                    >
                        Set New Goal
                    </button>
                </div>
            </div>

            {showForm && (
                <GoalForm 
                    currentGoal={editingGoal}
                    onSave={handleSaveGoal}
                    onCancel={handleCancelEdit}
                />
            )}

            {!showForm && filteredGoals.length === 0 && (
                <p className="text-center text-gray-500">
                    {filterStatus !== "All" ? `No goals found with status "${filterStatus}".` : "No goals set yet. Click 'Set New Goal' to get started!"}
                </p>
            )}

            {!showForm && filteredGoals.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredGoals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(goal => (
                        <div key={goal.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col">
                            <div className="p-6 flex-grow">
                                <h3 className="text-xl font-semibold text-teal-700 mb-2 break-words">{goal.description}</h3>
                                <p className="text-sm text-gray-500 mb-1">Status: <span className={`font-semibold ${goal.status === 'Completed' ? 'text-green-600' : goal.status === 'In Progress' ? 'text-yellow-600' : 'text-red-600'}`}>{goal.status}</span></p>
                                {goal.targetDate && <p className="text-sm text-gray-500 mb-1">Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>}
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3 dark:bg-gray-700">
                                    <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${goal.progressPercent}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-400 mb-1">Progress: {goal.progressPercent}%</p>
                                <p className="text-xs text-gray-400">
                                    Set: {new Date(goal.createdAt).toLocaleDateString()} | Updated: {new Date(goal.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex justify-end space-x-3 border-t p-4 bg-gray-50">
                                <button 
                                    onClick={() => handleEdit(goal)} 
                                    className="text-sm text-blue-500 hover:text-blue-700 font-medium"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(goal.id)} 
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

export default GoalsList;

