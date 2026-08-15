import React, { useState } from 'react';

// Mock Hardcoded Moderation Data
const MOCK_MODERATION_ITEMS = [
  {
    id: 1,
    title: 'Inappropriate language in DBMS Discussion Forum',
    type: 'Comment',
    reportedBy: 'Student STU201',
    status: 'Pending Review',
    date: '03 Aug 2026',
    contentPreview: 'Offensive reply posted under Lecture 14 Q&A discussion thread.',
  },
  {
    id: 2,
    title: 'Copyright Flag on External Reference PDF',
    type: 'PDF Notes',
    status: 'Reported',
    reportedBy: 'Auto-Moderator Bot',
    date: '02 Aug 2026',
    contentPreview: 'Uploaded PDF matches copyrighted textbook pages without proper attribution.',
  },
  {
    id: 3,
    title: 'Spam Quiz Questions Submission',
    type: 'Quiz',
    status: 'Pending Review',
    reportedBy: 'Prof. Amit Sharma',
    date: '01 Aug 2026',
    contentPreview: 'Multiple repeated garbage text entries submitted in automated AI quiz builder.',
  },
  {
    id: 4,
    title: 'Misleading Lecture Recording Title',
    type: 'Video',
    status: 'Resolved',
    reportedBy: 'Student STU204',
    date: '28 Jul 2026',
    contentPreview: 'Video title mismatch fixed by course admin.',
  },
];

export default function ContentModeration() {
  const [items, setItems] = useState(MOCK_MODERATION_ITEMS);
  const [activeTab, setActiveTab] = useState('All Content');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showAll, setShowAll] = useState(false);

  // Preview Modal State
  const [previewItem, setPreviewItem] = useState(null);

  // Action: Approve / Resolve Item
  const handleResolveItem = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Resolved' } : item))
    );
    alert('Content report approved and marked as Resolved!');
  };

  // Action: Take Down / Delete Item
  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to remove this violating content?')) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      alert('Content successfully removed from platform!');
    }
  };

  // Master Filter Logic
  const filteredItems = items.filter((item) => {
    // 1. Tab Filter
    let tabMatch = true;
    if (activeTab === 'Pending Review') tabMatch = item.status === 'Pending Review';
    if (activeTab === 'Reported') tabMatch = item.status === 'Reported';
    if (activeTab === 'Resolved') tabMatch = item.status === 'Resolved';

    // 2. Type Filter
    let typeMatch = typeFilter === 'All Types' ? true : item.type === typeFilter;

    // 3. Status Dropdown Filter
    let statusMatch = statusFilter === 'All Status' ? true : item.status === statusFilter;

    // 4. Search Query Match
    let searchMatch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reportedBy.toLowerCase().includes(searchQuery.toLowerCase());

    return tabMatch && typeMatch && statusMatch && searchMatch;
  });

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 5);

  // Dynamic Badge Counters
  const pendingCount = items.filter((i) => i.status === 'Pending Review').length;
  const reportedCount = items.filter((i) => i.status === 'Reported').length;

  return (
    <div className="space-y-6 animate-fadeIn relative max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Moderation</h2>
          <p className="text-xs text-slate-500 mt-0.5">Review reported content, forum flags, and automated moderation alerts</p>
        </div>
      </div>

      {/* Main Container Card Matching Screenshot */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
        
        {/* Navigation Tabs Bar Matching Screenshot */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 overflow-x-auto">
          {[
            { id: 'All Content', label: 'All Content', count: items.length },
            { id: 'Pending Review', label: `Pending Review (${pendingCount})`, count: pendingCount },
            { id: 'Reported', label: `Reported (${reportedCount})`, count: reportedCount },
            { id: 'Resolved', label: 'Resolved', count: items.filter((i) => i.status === 'Resolved').length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar & Dropdown Filters Controls Matching Screenshot */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="🔍 Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="All Types">All Types</option>
              <option value="Video">Video</option>
              <option value="Comment">Comment</option>
              <option value="PDF Notes">PDF Notes</option>
              <option value="Quiz">Quiz</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="All Status">All Status</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Reported">Reported</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

        </div>

        {/* Content Moderation Table */}
        <div className="overflow-x-auto min-h-[220px]">
          {displayedItems.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-bold text-xs space-y-2">
              <div className="text-3xl">🛡️</div>
              <p>No content found matching criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">FLAGGED TITLE</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">REPORTED BY</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {displayedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-bold text-slate-900 max-w-[220px] truncate">{item.title}</td>
                    <td className="py-4 px-4 font-bold text-indigo-600">{item.type}</td>
                    <td className="py-4 px-4 text-slate-500 font-bold">{item.reportedBy}</td>
                    <td className="py-4 px-4 font-bold">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : item.status === 'Reported'
                          ? 'bg-rose-50 text-rose-600 border border-rose-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-bold">{item.date}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Preview */}
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs transition"
                          title="Preview Content"
                        >
                          👁️
                        </button>

                        {/* Resolve */}
                        {item.status !== 'Resolved' && (
                          <button
                            onClick={() => handleResolveItem(item.id)}
                            className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-xs transition"
                            title="Approve & Dismiss"
                          >
                            ✓
                          </button>
                        )}

                        {/* Remove */}
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center font-bold text-xs transition"
                          title="Remove Content"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Summary Row Matching Screenshot */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <span>
            Showing 1 to {displayedItems.length} of {filteredItems.length} items
          </span>

          {filteredItems.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition"
            >
              {showAll ? 'Show Less' : 'View All →'}
            </button>
          )}
        </div>

      </div>

      {/* PREVIEW MODAL POPUP */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">{previewItem.title}</h3>
                <p className="text-[11px] text-indigo-600 font-bold">{previewItem.type} • Reported by {previewItem.reportedBy}</p>
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
              <p className="font-bold text-slate-900 mb-1">Content Preview:</p>
              {previewItem.contentPreview}
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