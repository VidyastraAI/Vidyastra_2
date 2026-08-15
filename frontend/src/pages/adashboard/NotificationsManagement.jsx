import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../API/notificationApi';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('All Notifications');
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewNotification, setPreviewNotification] = useState(null);
  const [editingNotification, setEditingNotification] = useState(null);

  // New Notification Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'System Announcement',
    audience: 'All Users',
    status: 'Sent',
    scheduledOn: '',
    message: '',
  });

  // Fetch Notifications from Backend API
  const fetchNotificationsData = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getAllNotifications();
      if (res.data && Array.isArray(res.data)) {
        setNotifications(
          res.data.map((item) => ({
            id: item._id,
            title: item.title,
            type: item.type || 'System Announcement',
            audience: item.audienceRole || item.audience || 'All Users',
            status: item.status || 'Sent',
            scheduledOn: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Immediate',
            message: item.message,
          }))
        );
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationsData();
  }, []);

  // Filter Notifications by Active Tab
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'All Notifications') return true;
    if (activeTab === 'Scheduled') return item.status === 'Scheduled';
    if (activeTab === 'Sent') return item.status === 'Sent';
    if (activeTab === 'Drafts') return item.status === 'Drafts' || item.status === 'Draft';
    return true;
  });

  const displayedNotifications = showAll ? filteredNotifications : filteredNotifications.slice(0, 5);

  // Create New Notification Handler via API
  const handleCreateNotification = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;

    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        audienceRole: formData.audience,
        status: formData.status,
      };

      await notificationApi.createNotification(payload);
      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        type: 'System Announcement',
        audience: 'All Users',
        status: 'Sent',
        scheduledOn: '',
        message: '',
      });
      alert('Notification created and broadcasted successfully!');
      fetchNotificationsData();
    } catch (err) {
      console.error('Create notification error:', err);
      alert('Failed to broadcast notification: ' + (err.response?.data?.message || err.message));
    }
  };

  // Save Edit Notification Changes
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setNotifications((prev) =>
      prev.map((item) => (item.id === editingNotification.id ? editingNotification : item))
    );
    setEditingNotification(null);
    alert('Notification details updated locally!');
  };

  // Delete Notification via API
  const handleDeleteNotification = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await notificationApi.deleteNotification(id);
        setNotifications((prev) => prev.filter((item) => item.id !== id));
        alert('Notification deleted from database!');
      } catch (err) {
        console.error('Delete notification API error:', err);
        alert('Failed to delete notification.');
      }
    }
  };

  // Preview and Mark as Read API
  const handlePreviewNotification = async (item) => {
    setPreviewNotification(item);
    try {
      if (item.id) {
        await notificationApi.markAsRead(item.id);
      }
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn relative max-w-6xl mx-auto">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Notifications Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Broadcast system notifications, alerts, and scheduled notices</p>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
        
        {/* Navigation Tabs Bar & Action Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          
          <div className="flex items-center gap-2 overflow-x-auto">
            {['All Notifications', 'Scheduled', 'Sent', 'Drafts'].map((tab) => {
              const count = notifications.filter((item) => {
                if (tab === 'All Notifications') return true;
                if (tab === 'Scheduled') return item.status === 'Scheduled';
                if (tab === 'Sent') return item.status === 'Sent';
                if (tab === 'Drafts') return item.status === 'Drafts' || item.status === 'Draft';
                return true;
              }).length;

              return (
                <button
                  key={tab}
                  type="button"
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

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
          >
            + Create Notification
          </button>

        </div>

        {/* Notifications Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-slate-400 font-bold text-xs">
              Fetching notifications from backend...
            </div>
          ) : displayedNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-bold text-xs">
              No notifications found in database.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">TITLE</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">AUDIENCE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">SCHEDULED ON</th>
                  <th className="py-3 px-4 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {displayedNotifications.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-bold text-slate-900 max-w-[200px] truncate">{item.title}</td>
                    <td className="py-4 px-4 font-bold text-indigo-600">{item.type}</td>
                    <td className="py-4 px-4 text-slate-600">{item.audience}</td>
                    <td className="py-4 px-4 font-bold">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${
                        item.status === 'Sent'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : item.status === 'Scheduled'
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-bold">{item.scheduledOn}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingNotification(item)}
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs transition"
                          title="Edit Notification"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handlePreviewNotification(item)}
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs transition"
                          title="Preview Message"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleDeleteNotification(item.id)}
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-400 hover:text-rose-600 flex items-center justify-center font-bold text-xs transition"
                          title="Delete Notification"
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

        {/* Footer Summary Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <span>
            Showing 1 to {displayedNotifications.length} of {filteredNotifications.length} notifications
          </span>

          {filteredNotifications.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition"
            >
              {showAll ? 'Show Less' : 'View All →'}
            </button>
          )}
        </div>

      </div>

      {/* CREATE NOTIFICATION MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Create New Notification</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Notification Title</label>
                <input
                  type="text"
                  placeholder="e.g. End Term Exam Schedule Broadcast"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="System Announcement">System Announcement</option>
                    <option value="Maintenance Alert">Maintenance Alert</option>
                    <option value="Course Update">Course Update</option>
                    <option value="General Notice">General Notice</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600">Target Audience</label>
                  <select
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="All Users">All Users</option>
                    <option value="Students Only">Students Only</option>
                    <option value="Faculty Only">Faculty Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Sent">Send Immediately</option>
                    <option value="Scheduled">Schedule For Later</option>
                    <option value="Drafts">Save as Draft</option>
                  </select>
                </div>

                {formData.status === 'Scheduled' && (
                  <div>
                    <label className="text-xs font-bold text-slate-600">Schedule Date</label>
                    <input
                      type="date"
                      value={formData.scheduledOn}
                      onChange={(e) => setFormData({ ...formData, scheduledOn: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Message Content</label>
                <textarea
                  rows="3"
                  placeholder="Type notification message details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Edit Notification</h3>
              <button
                type="button"
                onClick={() => setEditingNotification(null)}
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
                  value={editingNotification.title}
                  onChange={(e) => setEditingNotification({ ...editingNotification, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Status</label>
                <select
                  value={editingNotification.status}
                  onChange={(e) => setEditingNotification({ ...editingNotification, status: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
                >
                  <option value="Sent">Sent</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Drafts">Drafts</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingNotification(null)}
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

      {/* PREVIEW MODAL */}
      {previewNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">{previewNotification.title}</h3>
                <p className="text-xs text-indigo-600 font-bold">{previewNotification.type} • {previewNotification.audience}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewNotification(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
              {previewNotification.message}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewNotification(null)}
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