import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function TodoList() {
    const { currentUser, getUserData, setUserData } = useAuth();
    const [todos, setTodos] = useState([]);
    const [newTodoText, setNewTodoText] = useState('');
    const [editingTodo, setEditingTodo] = useState(null); // { id, description }
    const [editText, setEditText] = useState('');

    useEffect(() => {
        if (currentUser) {
            const userTodos = getUserData('todos') || [];
            setTodos(userTodos);
        }
    }, [currentUser, getUserData]);

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (!newTodoText.trim() || !currentUser) return;

        const newTodo = {
            id: `todo_${Date.now()}`,
            userId: currentUser.userId,
            description: newTodoText.trim(),
            isCompleted: false,
            createdAt: new Date().toISOString(),
        };

        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
        setUserData('todos', updatedTodos);
        setNewTodoText('');
    };

    const toggleComplete = (todoId) => {
        const updatedTodos = todos.map(todo =>
            todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
        );
        setTodos(updatedTodos);
        setUserData('todos', updatedTodos);
    };

    const handleDeleteTodo = (todoId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            const updatedTodos = todos.filter(todo => todo.id !== todoId);
            setTodos(updatedTodos);
            setUserData('todos', updatedTodos);
        }
    };

    const handleEdit = (todo) => {
        setEditingTodo(todo);
        setEditText(todo.description);
    };

    const handleSaveEdit = (todoId) => {
        if (!editText.trim()) {
            alert('Task description cannot be empty.');
            return;
        }
        const updatedTodos = todos.map(todo =>
            todo.id === todoId ? { ...todo, description: editText.trim(), updatedAt: new Date().toISOString() } : todo
        );
        setTodos(updatedTodos);
        setUserData('todos', updatedTodos);
        setEditingTodo(null);
        setEditText('');
    };

    const handleCancelEdit = () => {
        setEditingTodo(null);
        setEditText('');
    };

    if (!currentUser) {
        return <p className="text-center text-gray-600 mt-8">Please log in to manage your to-do list.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Todo List</h2>
            
            <form onSubmit={handleAddTodo} className="mb-6 flex gap-2 items-center bg-white p-4 rounded-lg shadow-md">
                <input 
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                />
                <button 
                    type="submit"
                    className="px-6 py-3 text-white bg-sky-500 rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 font-medium"
                >
                    Add Task
                </button>
            </form>

            {todos.length === 0 && (
                <p className="text-center text-gray-500">No tasks yet. Add some above!</p>
            )}

            {todos.length > 0 && (
                <ul className="space-y-3">
                    {todos.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)).map(todo => (
                        <li key={todo.id} className={`p-4 rounded-lg shadow-md flex items-center justify-between transition-colors ${todo.isCompleted ? 'bg-green-50' : 'bg-white'}`}>
                            {editingTodo && editingTodo.id === todo.id ? (
                                <input 
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="flex-grow p-2 border border-gray-300 rounded-md mr-2"
                                    autoFocus
                                />
                            ) : (
                                <span 
                                    onClick={() => toggleComplete(todo.id)}
                                    className={`cursor-pointer flex-grow ${todo.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}
                                >
                                    {todo.description}
                                </span>
                            )}
                            <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                                {editingTodo && editingTodo.id === todo.id ? (
                                    <>
                                        <button onClick={() => handleSaveEdit(todo.id)} className="text-sm text-green-600 hover:text-green-800 font-medium">Save</button>
                                        <button onClick={handleCancelEdit} className="text-sm text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => toggleComplete(todo.id)} className={`text-sm font-medium ${todo.isCompleted ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}`}>
                                            {todo.isCompleted ? 'Undo' : 'Complete'}
                                        </button>
                                        <button onClick={() => handleEdit(todo)} className="text-sm text-blue-500 hover:text-blue-700 font-medium">Edit</button>
                                        <button onClick={() => handleDeleteTodo(todo.id)} className="text-sm text-red-500 hover:text-red-700 font-medium">Delete</button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TodoList;

