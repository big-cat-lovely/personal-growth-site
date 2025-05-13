import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function BookmarkForm({ currentBookmark, onSave, onCancel }) {
    const { currentUser, getUserData, setUserData } = useAuth();
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [tags, setTags] = useState(''); // Comma-separated string for tags

    useEffect(() => {
        if (currentBookmark) {
            setTitle(currentBookmark.title);
            setUrl(currentBookmark.url);
            setNotes(currentBookmark.notes || '');
            setTags(currentBookmark.tags ? currentBookmark.tags.join(', ') : '');
        } else {
            setTitle('');
            setUrl('');
            setNotes('');
            setTags('');
        }
    }, [currentBookmark]);

    const isValidUrl = (urlString) => {
        try {
            new URL(urlString);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!currentUser) return;
        if (!title.trim() || !url.trim()) {
            alert('Title and URL are required.');
            return;
        }
        if (!isValidUrl(url)) {
            alert('Please enter a valid URL (e.g., https://example.com)');
            return;
        }

        const bookmarkData = {
            id: currentBookmark ? currentBookmark.id : `bookmark_${Date.now()}`,
            userId: currentUser.userId,
            title,
            url,
            notes,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
            createdAt: currentBookmark ? currentBookmark.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        let bookmarks = getUserData('bookmarks') || [];
        if (currentBookmark) {
            bookmarks = bookmarks.map(bm => bm.id === currentBookmark.id ? bookmarkData : bm);
        } else {
            bookmarks.push(bookmarkData);
        }
        setUserData('bookmarks', bookmarks);
        onSave(bookmarkData);
        // Reset form only if it's not an edit, or if desired after edit too
        if (!currentBookmark) {
            setTitle('');
            setUrl('');
            setNotes('');
            setTags('');
        }
    };

    if (!currentUser) return <p>Please log in to manage bookmarks.</p>;

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">{currentBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}</h3>
            <div className="mb-4">
                <label htmlFor="bookmarkTitle" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                    type="text" 
                    id="bookmarkTitle"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Bookmark Title"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="bookmarkUrl" className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input 
                    type="url" 
                    id="bookmarkUrl"
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    placeholder="https://example.com"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="bookmarkNotes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea 
                    id="bookmarkNotes"
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Brief description or why this link is useful"
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="bookmarkTags" className="block text-sm font-medium text-gray-700 mb-1">Tags (Optional, comma-separated)</label>
                <input 
                    type="text" 
                    id="bookmarkTags"
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)} 
                    placeholder="e.g., productivity, articles, tools"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                    {currentBookmark ? 'Save Changes' : 'Add Bookmark'}
                </button>
            </div>
        </form>
    );
}

export default BookmarkForm;

