import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function HealthLogForm({ selectedDate, existingLog, onSave, onCancel }) {
    const { currentUser, getUserData, setUserData } = useAuth();
    const [exercises, setExercises] = useState([{ name: '', duration: '' }]);
    const [dietItems, setDietItems] = useState([{ name: '', calories: '' }]);
    const [totalCalories, setTotalCalories] = useState(0);

    useEffect(() => {
        if (existingLog) {
            setExercises(existingLog.exercises.length > 0 ? existingLog.exercises : [{ name: '', duration: '' }]);
            setDietItems(existingLog.dietItems.length > 0 ? existingLog.dietItems : [{ name: '', calories: '' }]);
        } else {
            setExercises([{ name: '', duration: '' }]);
            setDietItems([{ name: '', calories: '' }]);
        }
    }, [existingLog]);

    useEffect(() => {
        const sum = dietItems.reduce((acc, item) => acc + (Number(item.calories) || 0), 0);
        setTotalCalories(sum);
    }, [dietItems]);

    const handleExerciseChange = (index, field, value) => {
        const updatedExercises = [...exercises];
        updatedExercises[index][field] = value;
        setExercises(updatedExercises);
    };

    const addExerciseField = () => {
        setExercises([...exercises, { name: '', duration: '' }]);
    };

    const removeExerciseField = (index) => {
        const updatedExercises = exercises.filter((_, i) => i !== index);
        setExercises(updatedExercises.length > 0 ? updatedExercises : [{ name: '', duration: '' }]);
    };

    const handleDietChange = (index, field, value) => {
        const updatedDietItems = [...dietItems];
        updatedDietItems[index][field] = value;
        setDietItems(updatedDietItems);
    };

    const addDietField = () => {
        setDietItems([...dietItems, { name: '', calories: '' }]);
    };

    const removeDietField = (index) => {
        const updatedDietItems = dietItems.filter((_, i) => i !== index);
        setDietItems(updatedDietItems.length > 0 ? updatedDietItems : [{ name: '', calories: '' }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const finalExercises = exercises.filter(ex => ex.name.trim() !== '' || ex.duration.trim() !== '');
        const finalDietItems = dietItems.filter(di => di.name.trim() !== '' || di.calories.trim() !== '');

        const logEntry = {
            id: existingLog ? existingLog.id : `healthlog_${selectedDate.toISOString().split('T')[0]}_${Date.now()}`,
            userId: currentUser.userId,
            date: selectedDate.toISOString().split('T')[0],
            exercises: finalExercises,
            dietItems: finalDietItems,
            totalCalories: dietItems.reduce((acc, item) => acc + (Number(item.calories) || 0), 0),
            createdAt: existingLog ? existingLog.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        let healthLogs = getUserData('healthLogs') || [];
        if (existingLog) {
            healthLogs = healthLogs.map(log => log.id === existingLog.id ? logEntry : log);
        } else {
            // Remove any existing log for the same date before adding new one, to prevent duplicates for a date
            healthLogs = healthLogs.filter(log => log.date !== logEntry.date);
            healthLogs.push(logEntry);
        }
        setUserData('healthLogs', healthLogs);
        onSave(logEntry);
    };

    if (!currentUser) return <p>Please log in to manage health logs.</p>;

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
                {existingLog ? 'Edit' : 'Log'} Health Data for {selectedDate.toLocaleDateString()}
            </h3>
            
            {/* Exercises Section */}
            <div className="mb-6 border-b pb-4">
                <h4 className="text-lg font-medium text-gray-600 mb-2">Exercise</h4>
                {exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <input 
                            type="text" 
                            value={exercise.name} 
                            onChange={(e) => handleExerciseChange(index, 'name', e.target.value)} 
                            placeholder="Exercise Name (e.g., Running)"
                            className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <input 
                            type="text" 
                            value={exercise.duration} 
                            onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)} 
                            placeholder="Duration (e.g., 30 mins)"
                            className="w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {exercises.length > 1 && (
                            <button type="button" onClick={() => removeExerciseField(index)} className="text-red-500 hover:text-red-700 p-1">Remove</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addExerciseField} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Add Exercise</button>
            </div>

            {/* Diet Section */}
            <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-600 mb-2">Diet</h4>
                {dietItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <input 
                            type="text" 
                            value={item.name} 
                            onChange={(e) => handleDietChange(index, 'name', e.target.value)} 
                            placeholder="Food Item (e.g., Apple)"
                            className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <input 
                            type="number" 
                            value={item.calories} 
                            onChange={(e) => handleDietChange(index, 'calories', e.target.value)} 
                            placeholder="Calories (e.g., 95)"
                            className="w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {dietItems.length > 1 && (
                            <button type="button" onClick={() => removeDietField(index)} className="text-red-500 hover:text-red-700 p-1">Remove</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addDietField} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Add Diet Item</button>
                <p className="mt-2 text-right font-semibold text-gray-700">Total Calories: {totalCalories}</p>
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
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    {existingLog ? 'Save Changes' : 'Log Data'}
                </button>
            </div>
        </form>
    );
}

export default HealthLogForm;

