import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../API/notificationApi';

export default function MessagesAnnouncements() {
  const [activeTab, setActiveTab] = useState('Announcements'); // 'Announcements' | 'Messages'
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Announcement Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    course: 'CS201 - DBMS',
    content: '',
  });

  // Direct Message Chat Box State
  const [selectedStudentChat, setSelectedStudentChat] = useState(null);
  const [chatReply, setChatReply] = useState('');

  // Fetch Announcements from Backend API
  const fetchAnnouncementsData = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getAllNotifications();
      if (res.data && Array.isArray(res.data)) {
        setAnnouncements(
          res.data.map((item) => ({
            id: item._id,
            title: item.title,
            content: item.message,
            course: item.audienceRole || item.type || 'CS201 - DBMS',
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent',
            icon: item.type === 'Maintenance Alert' ? '⚠️' : '📢',
          }))
        );
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      console.error('Error fetching faculty announcements:', err);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncementsData();
  }, []);

  // Post New Announcement to Backend API
  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    try {
      const payload = {
        title: newAnnouncement.title,
        message: newAnnouncement.content,
        audienceRole: 'Students Only',
        type: newAnnouncement.course,
      };

      await notificationApi.createNotification(payload);
      setIsModalOpen(false);
      setNewAnnouncement({ title: '', course: 'CS201 - DBMS', content: '' });
      alert('New Announcement broadcasted to students successfully!');
      fetchAnnouncementsData();
    } catch (err) {
      console.error('Broadcast error:', err);
      alert('Failed to post announcement: ' + (err.response?.data?.message || err.message));
    }
  };

  // Send Direct Chat Reply
  const handleSendChatReply = (e) => {
    e.preventDefault();
    if (!chatReply.trim()) return;

    alert(`Reply sent to ${selectedStudentChat.studentName}: "${chatReply}"`);
    setChatReply('');
  };

  return (
    <div className="space-y-6 animate-fadeIn relative max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Messages & Announcements</h2>
          <p className="text-xs text-slate-500 mt-0.5">Broadcast class notices or respond to 1-on-1 student inquiries</p>
        </div>

        {/* Dynamic Action Button */}
        {activeTab === 'Announcements' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center gap-1.5"
          >
            + New Announcement
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
        
        {/* Navigation Tabs (Announcements vs Messages) */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <button
            onClick={() => setActiveTab('Announcements')}
            className={`px-5 py-2 rounded-2xl text-xs font-bold transition ${
              activeTab === 'Announcements'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Announcements ({announcements.length})
          </button>
          
          <button
            onClick={() => setActiveTab('Messages')}
            className={`px-5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'Messages'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Student Messages</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          </button>
        </div>

        {/* TAB 1: ANNOUNCEMENTS VIEW */}
        {activeTab === 'Announcements' && (
          <div className="space-y-3">
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold">
                Loading announcements from server...
              </div>
            ) : announcements.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold">
                No announcements broadcasted yet. Click "+ New Announcement" to post one.
              </div>
            ) : (
              announcements.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedAnnouncement(item)}
                  className="p-5 rounded-3xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-indigo-100 transition shadow-xs hover:shadow-md flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-lg flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-800">{item.title}</h3>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                          {item.course}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {item.content}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">
                    {item.date}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: MESSAGES VIEW (1-on-1 Student Chat) */}
        {activeTab === 'Messages' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[350px]">
            
            {/* Student Conversation List */}
            <div className="md:col-span-5 border-r border-slate-100 pr-0 md:pr-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Student Inquiries</h4>
              {messages.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold py-6 text-center">No active student inquiries.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedStudentChat(msg);
                      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, unread: false } : m)));
                    }}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1 ${
                      selectedStudentChat?.id === msg.id
                        ? 'bg-indigo-50/80 border-indigo-200'
                        : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-800">{msg.studentName}</span>
                        {msg.unread && <span className="w-2 h-2 rounded-full bg-rose-500"></span>}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">{msg.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{msg.lastMessage}</p>
                  </div>
                ))
              )}
            </div>

            {/* Selected Conversation Detail Chat Box */}
            <div className="md:col-span-7 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
              {selectedStudentChat ? (
                <>
                  <div className="space-y-3">
                    <div className="border-b border-slate-200/60 pb-2 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{selectedStudentChat.studentName}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{selectedStudentChat.studentId}</p>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">Active</span>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium shadow-xs">
                      💬 {selectedStudentChat.lastMessage}
                    </div>
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendChatReply} className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={chatReply}
                      onChange={(e) => setChatReply(e.target.value)}
                      placeholder={`Reply to ${selectedStudentChat.studentName}...`}
                      className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-indigo-700 transition"
                    >
                      Send 🚀
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs font-medium py-12">
                  <div className="text-3xl mb-2">💬</div>
                  <span>Select a student inquiry from the list to view and reply</span>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* NEW ANNOUNCEMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Broadcast New Announcement</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostAnnouncement} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Announcement Title</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule Change for Friday Lecture"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Target Course / Audience</label>
                <select
                  value={newAnnouncement.course}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, course: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="CS201 - DBMS">CS201 - Database Management Systems</option>
                  <option value="DS204 - Data Science">DS204 - Data Science</option>
                  <option value="General Notice">General Notice (All Students)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Notice Body Content</label>
                <textarea
                  rows="4"
                  placeholder="Type full announcement details here..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
                >
                  Broadcast Notice 📢
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL ANNOUNCEMENT VIEW POPUP */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedAnnouncement.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{selectedAnnouncement.title}</h3>
                  <p className="text-[10px] text-indigo-600 font-bold">{selectedAnnouncement.course} • {selectedAnnouncement.date}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
              {selectedAnnouncement.content}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
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