import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import { useAuth } from '../../contexts/AuthContext';

function InsightForm({ currentInsight, onSave, onCancel }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { currentUser, getUserData, setUserData } = useAuth();

    useEffect(() => {
        if (currentInsight) {
            setTitle(currentInsight.title);
            setContent(currentInsight.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [currentInsight]);

    const handleSave = () => {
        if (!title.trim() || !content.trim()) {
            alert('Title and content cannot be empty.');
            return;
        }
        const insightData = {
            id: currentInsight ? currentInsight.id : `insight_${Date.now()}`,
            title,
            content,
            createdAt: currentInsight ? currentInsight.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        
        let insights = getUserData('insights') || [];
        if (currentInsight) {
            insights = insights.map(ins => ins.id === currentInsight.id ? insightData : ins);
        } else {
            insights.push(insightData);
        }
        setUserData('insights', insights);
        onSave(insightData); 
        setTitle(''); 
        setContent('');
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setContent(e.target.result);
                // Optionally, try to extract a title from the file name or first line
                if (!title) {
                    setTitle(file.name.split('.').slice(0, -1).join('.') || 'Uploaded Content');
                }
            };
            reader.readAsText(file);
        }
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'], // Image might require more setup for storage/handling
            ['clean']
        ],
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    if (!currentUser) return <p>Please log in to manage insights.</p>;

    return (
        <div className="p-4 bg-white rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">{currentInsight ? 'Edit Insight' : 'Create New Insight'}</h3>
            <div className="mb-4">
                <label htmlFor="insightTitle" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                    type="text" 
                    id="insightTitle"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Insight Title"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="insightContent" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent} 
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-1">Upload Content from File</label>
                <input 
                    type="file"
                    id="fileUpload"
                    accept=".txt,.md,.html" // Specify acceptable file types
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
            </div>
            <div className="flex justify-end space-x-3">
                {onCancel && (
                    <button 
                        onClick={onCancel} 
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                )}
                <button 
                    onClick={handleSave} 
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {currentInsight ? 'Save Changes' : 'Add Insight'}
                </button>
            </div>
        </div>
    );
}

export default InsightForm;

