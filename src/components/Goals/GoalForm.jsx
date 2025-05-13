import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function GoalForm({ currentGoal, onSave, onCancel }) {
    const { currentUser, getUserData, setUserData } = useAuth();
    const [description, setDescription] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [status, setStatus] = useState('To Do'); // 'To Do', 'In Progress', 'Completed'
    const [progressPercent, setProgressPercent] = useState(0);

    useEffect(() => {
        if (currentGoal) {
            setDescription(currentGoal.description);
            setTargetDate(currentGoal.targetDate ? currentGoal.targetDate.split('T')[0] : ''); // Format for input type date
            setStatus(currentGoal.status);
            setProgressPercent(currentGoal.progressPercent);
        } else {
            setDescription('');
            setTargetDate('');
            setStatus('To Do');
            setProgressPercent(0);
        }
    }, [currentGoal]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!currentUser || !description.trim()) {
            alert('Goal description cannot be empty.');
            return;
        }

        const goalData = {
            id: currentGoal ? currentGoal.id : `goal_${Date.now()}`,
            userId: currentUser.userId,
            description,
            targetDate: targetDate || null, // Store as null if empty
            status,
            progressPercent: Number(progressPercent),
            createdAt: currentGoal ? currentGoal.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        let goals = getUserData('goals') || [];
        if (currentGoal) {
            goals = goals.map(g => g.id === currentGoal.id ? goalData : g);
        } else {
            goals.push(goalData);
        }
        setUserData('goals', goals);
        onSave(goalData);
        if (!currentGoal) {
            setDescription('');
            setTargetDate('');
            setStatus('To Do');
            setProgressPercent(0);
        }
    };

    if (!currentUser) return <p>Please log in to manage goals.</p>;

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">{currentGoal ? 'Edit Goal' : 'Set New Goal'}</h3>
            <div className="mb-4">
                <label htmlFor="goalDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                    id="goalDescription"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="What do you want to achieve?"
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    required
                />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="goalTargetDate" className="block text-sm font-medium text-gray-700 mb-1">Target Date (Optional)</label>
                    <input 
                        type="date" 
                        id="goalTargetDate"
                        value={targetDate} 
                        onChange={(e) => setTargetDate(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <div>
                    <label htmlFor="goalStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                        id="goalStatus" 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="goalProgress" className="block text-sm font-medium text-gray-700 mb-1">Progress: {progressPercent}%</label>
                <input 
                    type="range" 
                    id="goalProgress"
                    min="0" 
                    max="100" 
                    value={progressPercent} 
                    onChange={(e) => setProgressPercent(e.target.value)} 
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
            </div>
            <div className="flex justify-end space-x-3">
                {onCancel && (
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                )}
                <button 
                    type="submit" 
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                    {currentGoal ? 'Save Changes' : 'Set Goal'}
                </button>
            </div>
        </form>
    );
}

export default GoalForm;

