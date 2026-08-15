import React, { useState } from 'react';

// Mock Hardcoded Content Data exact as shown in screenshot
const MOCK_CONTENT_ITEMS = [
  {
    id: 1,
    title: 'Arrays - Complete Notes',
    type: 'Notes',
    sourceLecture: 'DSA - Arrays',
    status: 'Published',
    details: 'Comprehensive study notes covering 1D/2D arrays, memory representation, and insertion/deletion time complexity.',
  },
  {
    id: 2,
    title: 'Arrays - MCQ Quiz',
    type: 'Quizzes',
    sourceLecture: 'DSA - Arrays',
    status: 'Published',
    details: '10 multiple-choice questions covering bounds checking, row-major vs column-major order, and array algorithms.',
  },
  {
    id: 3,
    title: 'Arrays - Summary',
    type: 'Summaries',
    sourceLecture: 'DSA - Arrays',
    status: 'Published',
    details: '1-page concise executive summary of linear data structures for fast exam revision.',
  },
  {
    id: 4,
    title: 'DBMS - Normalization Notes',
    type: 'Notes',
    sourceLecture: 'DBMS - Normalization',
    status: 'Draft',
    details: 'Draft notes covering 1NF, 2NF, 3NF, BCNF rules, and functional dependency decomposition.',
  },
  {
    id: 5,
    title: 'DBMS - Quiz Set 1',
    type: 'Quizzes',
    sourceLecture: 'DBMS - Normalization',
    status: 'Draft',
    details: 'Practice quiz testing candidate keys identification and lossless join decomposition.',
  },
];

export default function ContentLibrary() {
  const [contentList, setContentList] = useState(MOCK_CONTENT_ITEMS);
  const [activeTab, setActiveTab] = useState('All Content');
  const [showAll, setShowAll] = useState(false);

  // Modal Popups State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Form State for Creating New Content
  const [newItem, setNewItem] = useState({
    title: '',
    type: 'Notes',
    sourceLecture: 'DSA - Arrays',
    status: 'Published',
    details: '',
  });

  // Filter content by active tab category
  const filteredContent = contentList.filter((item) => {
    if (activeTab === 'All Content') return true;
    if (activeTab === 'Quizzes') return item.type === 'Quizzes' || item.type === 'Quiz';
    return item.type === activeTab;
  });

  const displayedContent = showAll ? filteredContent : filteredContent.slice(0, 5);

  // Handle New Content Generation / Form Submit
  const handleGenerateContent = (e) => {
    e.preventDefault();
    if (!newItem.title) return;

    const createdObj = {
      id: Date.now(),
      title: newItem.title,
      type: newItem.type,
      sourceLecture: newItem.sourceLecture,
      status: newItem.status,
      details: newItem.details || 'AI Generated study material compiled from lecture recordings.',
    };

    setContentList([createdObj, ...contentList]);
    setIsGenerateModalOpen(false);
    setNewItem({ title: '', type: 'Notes', sourceLecture: 'DSA - Arrays', status: 'Published', details: '' });
    alert('New content created and added to library!');
  };

  // Save Edit Changes
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setContentList((prev) =>
      prev.map((item) => (item.id === editingItem.id ? editingItem : item))
    );
    setEditingItem(null);
    alert('Content details updated successfully!');
  };

  // Delete Content Item
  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to remove this content item?')) {
      setContentList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn relative max-w-6xl mx-auto">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Content Library</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage AI-generated notes, quizzes, summaries, flashcards, and assignments</p>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
        
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 overflow-x-auto">
          {['All Content', 'Notes', 'Quizzes', 'Summaries', 'Flashcards', 'Assignments'].map((tab) => {
            const count = contentList.filter((item) => {
              if (tab === 'All Content') return true;
              if (tab === 'Quizzes') return item.type === 'Quizzes' || item.type === 'Quiz';
              return item.type === tab;
            }).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab}</span>
                {count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Table Exact Matching Screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">CONTENT TITLE</th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">SOURCE LECTURE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {displayedContent.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    No content items found for the selected category.
                  </td>
                </tr>
              ) : (
                displayedContent.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-bold text-slate-900">{item.title}</td>
                    <td className="py-4 px-4 font-bold text-indigo-600">{item.type}</td>
                    <td className="py-4 px-4 text-slate-600">{item.sourceLecture}</td>
                    <td className="py-4 px-4 font-bold">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${
                        item.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => setEditingItem(item)}
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs transition"
                          title="Edit Item"
                        >
                          ✏️
                        </button>

                        {/* Preview Button */}
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs transition"
                          title="Preview Content"
                        >
                          👁️
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-400 hover:text-rose-600 flex items-center justify-center font-bold text-xs transition"
                          title="Delete Item"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Actions Matching Screenshot */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center gap-1.5"
          >
            + Generate Content
          </button>

          {filteredContent.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition"
            >
              {showAll ? 'Show Less' : 'View All Content →'}
            </button>
          )}
        </div>

      </div>

      {/* MODAL 1: GENERATE CONTENT MODAL */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Generate New Content</h3>
              <button
                type="button"
                onClick={() => setIsGenerateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateContent} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Content Title</label>
                <input
                  type="text"
                  placeholder="e.g. Linked Lists - Complete Notes"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">Type</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Notes">Notes</option>
                    <option value="Quizzes">Quizzes</option>
                    <option value="Summaries">Summaries</option>
                    <option value="Flashcards">Flashcards</option>
                    <option value="Assignments">Assignments</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600">Initial Status</label>
                  <select
                    value={newItem.status}
                    onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Source Lecture</label>
                <input
                  type="text"
                  placeholder="e.g. DSA - Arrays"
                  value={newItem.sourceLecture}
                  onChange={(e) => setNewItem({ ...newItem, sourceLecture: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Details / Description</label>
                <textarea
                  rows="3"
                  placeholder="Add key takeaways or description..."
                  value={newItem.details}
                  onChange={(e) => setNewItem({ ...newItem, details: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
                >
                  Create Material
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: EDIT CONTENT ITEM MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Edit Content Item</h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Title</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Status</label>
                <select
                  value={editingItem.status}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 3: PREVIEW ITEM MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 space-y-4 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">{previewItem.title}</h3>
                <p className="text-xs text-indigo-600 font-bold">{previewItem.type} • {previewItem.sourceLecture}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
              {previewItem.details}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}