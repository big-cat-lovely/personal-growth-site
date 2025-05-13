import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BookmarkForm from './BookmarkForm';

function BookmarksList() {
    const { currentUser, getUserData, setUserData } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [editingBookmark, setEditingBookmark] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');

    useEffect(() => {
        if (currentUser) {
            const userBookmarks = getUserData('bookmarks') || [];
            setBookmarks(userBookmarks);
            // Extract all unique tags
            const tagsSet = new Set();
            userBookmarks.forEach(bm => bm.tags.forEach(tag => tagsSet.add(tag)));
            setAllTags(Array.from(tagsSet).sort());
        }
    }, [currentUser, getUserData]);

    const handleSaveBookmark = (savedBookmark) => {
        const updatedBookmarks = getUserData('bookmarks') || [];
        setBookmarks(updatedBookmarks);
        const tagsSet = new Set();
        updatedBookmarks.forEach(bm => bm.tags.forEach(tag => tagsSet.add(tag)));
        setAllTags(Array.from(tagsSet).sort());
        setEditingBookmark(null);
        setShowForm(false);
    };

    const handleEdit = (bookmark) => {
        setEditingBookmark(bookmark);
        setShowForm(true);
    };

    const handleDelete = (bookmarkId) => {
        if (window.confirm('Are you sure you want to delete this bookmark?')) {
            let currentBookmarks = getUserData('bookmarks') || [];
            currentBookmarks = currentBookmarks.filter(bm => bm.id !== bookmarkId);
            setUserData('bookmarks', currentBookmarks);
            setBookmarks(currentBookmarks);
            const tagsSet = new Set();
            currentBookmarks.forEach(bm => bm.tags.forEach(tag => tagsSet.add(tag)));
            setAllTags(Array.from(tagsSet).sort());
        }
    };

    const handleCancelEdit = () => {
        setEditingBookmark(null);
        setShowForm(false);
    };

    const handleAddNew = () => {
        setEditingBookmark(null);
        setShowForm(true);
    };

    const filteredBookmarks = selectedTag 
        ? bookmarks.filter(bm => bm.tags.includes(selectedTag)) 
        : bookmarks;

    if (!currentUser) {
        return <p className="text-center text-gray-600 mt-8">Please log in to view and manage your bookmarks.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">My Bookmarks</h2>
                <div className="flex items-center gap-4">
                    {allTags.length > 0 && (
                        <select 
                            value={selectedTag} 
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Tags</option>
                            {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                        </select>
                    )}
                    <button 
                        onClick={handleAddNew}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                    >
                        Add New Bookmark
                    </button>
                </div>
            </div>

            {showForm && (
                <BookmarkForm 
                    currentBookmark={editingBookmark}
                    onSave={handleSaveBookmark}
                    onCancel={handleCancelEdit}
                />
            )}

            {!showForm && filteredBookmarks.length === 0 && (
                <p className="text-center text-gray-500">
                    {selectedTag ? `No bookmarks found for tag "${selectedTag}".` : "No bookmarks yet. Click 'Add New Bookmark' to get started!"}
                </p>
            )}

            {!showForm && filteredBookmarks.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredBookmarks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(bookmark => (
                        <div key={bookmark.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-purple-700 mb-2 truncate">
                                    <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="hover:underline" title={bookmark.title}>{bookmark.title}</a>
                                </h3>
                                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-purple-600 truncate block mb-2" title={bookmark.url}>{bookmark.url}</a>
                                {bookmark.notes && <p className="text-sm text-gray-600 mb-3 max-h-20 overflow-y-auto">{bookmark.notes}</p>}
                                {bookmark.tags && bookmark.tags.length > 0 && (
                                    <div className="mb-3">
                                        {bookmark.tags.map(tag => (
                                            <span key={tag} className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-gray-400 mb-4">
                                    Added: {new Date(bookmark.createdAt).toLocaleDateString()}
                                </p>
                                <div className="flex justify-end space-x-3 border-t pt-4 mt-auto">
                                    <button 
                                        onClick={() => handleEdit(bookmark)} 
                                        className="text-sm text-blue-500 hover:text-blue-700 font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(bookmark.id)} 
                                        className="text-sm text-red-500 hover:text-red-700 font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BookmarksList;

