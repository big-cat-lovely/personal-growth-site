import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default styling
import { useAuth } from '../../contexts/AuthContext';
import HealthLogForm from './HealthLogForm';
// We will need a charting library, e.g., Recharts, which is included in the template.
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Placeholder for chart component - to be implemented later
const HealthCharts = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-sm text-gray-500">No data available for charts yet.</p>;
    }
    // Basic example: Count entries per month or show calorie trend
    // This will be expanded later with actual Recharts implementation
    return (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Health Statistics (Placeholder)</h4>
            <p className="text-sm text-gray-600">Charts will be displayed here. For example, exercise frequency or calorie intake trends.</p>
            {/* Example: <ResponsiveContainer width="100%" height={300}> ... Recharts code ... </ResponsiveContainer> */}
        </div>
    );
};

function HealthDashboard() {
    const { currentUser, getUserData, setUserData } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [healthLogs, setHealthLogs] = useState([]);
    const [currentLog, setCurrentLog] = useState(null); // Log for the selectedDate
    const [showLogForm, setShowLogForm] = useState(false);

    useEffect(() => {
        if (currentUser) {
            const userHealthLogs = getUserData('healthLogs') || [];
            setHealthLogs(userHealthLogs);
        }
    }, [currentUser, getUserData]);

    useEffect(() => {
        // When selectedDate or healthLogs change, find the log for the current date
        if (currentUser) {
            const dateString = selectedDate.toISOString().split('T')[0];
            const logForDate = healthLogs.find(log => log.date === dateString);
            setCurrentLog(logForDate || null);
            // Automatically show form if no log exists for today or a past selected date, 
            // but not for future dates unless explicitly opened.
            if (!logForDate && selectedDate <= new Date()) {
                // setShowLogForm(true); // Decided against auto-opening form to reduce intrusiveness
            } else {
                // setShowLogForm(false); // Keep form closed unless user interacts
            }
        }
    }, [selectedDate, healthLogs, currentUser]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setShowLogForm(false); // Close form when date changes, user can open it if needed
    };

    const handleSaveLog = (savedLog) => {
        const updatedLogs = getUserData('healthLogs') || [];
        setHealthLogs(updatedLogs);
        setCurrentLog(savedLog);
        setShowLogForm(false);
    };

    const handleCancelLogForm = () => {
        setShowLogForm(false);
    };

    const handleEditLog = () => {
        setShowLogForm(true); // Opens form with existing data for selectedDate
    };
    
    const handleAddNewLog = () => {
        setCurrentLog(null); // Ensure it's a new log
        setShowLogForm(true);
    };

    const handleDeleteLog = () => {
        if (!currentLog || !currentUser) return;
        if (window.confirm('Are you sure you want to delete the log for this date?')) {
            let updatedLogs = healthLogs.filter(log => log.id !== currentLog.id);
            setUserData('healthLogs', updatedLogs);
            setHealthLogs(updatedLogs);
            setCurrentLog(null);
            setShowLogForm(false);
        }
    };

    // Function to add class to dates with logs
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toISOString().split('T')[0];
            if (healthLogs.find(log => log.date === dateString)) {
                return 'has-log-indicator'; // Custom class for styling
            }
        }
        return null;
    };

    if (!currentUser) {
        return <p className="text-center text-gray-600 mt-8">Please log in to track your health.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Health Tracking</h2>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Date</h3>
                    <Calendar 
                        onChange={handleDateChange} 
                        value={selectedDate} 
                        className="border-0 shadow-sm react-calendar-override"
                        tileClassName={tileClassName}
                    />
                     {/* Custom CSS for react-calendar-override and has-log-indicator will be needed */}
                </div>

                <div className="md:col-span-2">
                    {showLogForm ? (
                        <HealthLogForm 
                            selectedDate={selectedDate} 
                            existingLog={currentLog} 
                            onSave={handleSaveLog} 
                            onCancel={handleCancelLogForm} 
                        />
                    ) : (
                        <div className="p-6 bg-white rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">
                                Log for {selectedDate.toLocaleDateString()}
                            </h3>
                            {currentLog ? (
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-medium text-gray-600">Exercises:</h4>
                                        {currentLog.exercises && currentLog.exercises.length > 0 ? (
                                            <ul className="list-disc list-inside ml-4 text-sm text-gray-500">
                                                {currentLog.exercises.map((ex, i) => <li key={i}>{ex.name} - {ex.duration}</li>)}
                                            </ul>
                                        ) : <p className="text-sm text-gray-400">No exercises logged.</p>}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-600">Diet:</h4>
                                        {currentLog.dietItems && currentLog.dietItems.length > 0 ? (
                                            <ul className="list-disc list-inside ml-4 text-sm text-gray-500">
                                                {currentLog.dietItems.map((item, i) => <li key={i}>{item.name} - {item.calories} kcal</li>)}
                                            </ul>
                                        ) : <p className="text-sm text-gray-400">No diet items logged.</p>}
                                        <p className="text-sm font-semibold text-gray-600 mt-1">Total Calories: {currentLog.totalCalories} kcal</p>
                                    </div>
                                    <div className="flex space-x-3 pt-3 border-t mt-3">
                                        <button onClick={handleEditLog} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">Edit Log</button>
                                        <button onClick={handleDeleteLog} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Delete Log</button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-500 mb-4">No log found for this date.</p>
                                    <button onClick={handleAddNewLog} className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">Add New Log</button>
                                </div>
                            )}
                        </div>
                    )}
                    <HealthCharts data={healthLogs} />
                </div>
            </div>
        </div>
    );
}

export default HealthDashboard;

