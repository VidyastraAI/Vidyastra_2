import React, { useState } from 'react';

// Mock Hardcoded Scheduled Live Classes
const MOCK_LIVE_CLASSES = [
  {
    id: 1,
    title: 'DBMS: B-Trees & Clustered Indexing Hands-on',
    course: 'CS201 - Database Management Systems',
    time: 'Today, 02:00 PM IST',
    status: 'Scheduled',
    attendees: 68,
  },
  {
    id: 2,
    title: 'Data Science: Supervised Learning & Regression EDA',
    course: 'DS204 - Data Science',
    time: 'Tomorrow, 10:00 AM IST',
    status: 'Scheduled',
    attendees: 72,
  },
  {
    id: 3,
    title: 'DAA: Dynamic Programming LCS & Knapsack Live Code',
    course: 'CS305 - DAA',
    time: '06 Aug 2026, 11:30 AM IST',
    status: 'Scheduled',
    attendees: 44,
  },
];

export default function LiveClass() {
  const [classes, setClasses] = useState(MOCK_LIVE_CLASSES);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [activeCall, setActiveCall] = useState(null); // Active Stream Room Modal
  
  // Controls state for active stream
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Form State for Schedule Modal
  const [formData, setFormData] = useState({
    title: '',
    course: 'CS201 - Database Management Systems',
    time: '',
  });

  // Handle Schedule Class Submit
  const handleScheduleClass = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.time) return;

    const newClass = {
      id: Date.now(),
      title: formData.title,
      course: formData.course,
      time: formData.time,
      status: 'Scheduled',
      attendees: 68,
    };

    setClasses([newClass, ...classes]);
    setIsScheduleModalOpen(false);
    setFormData({ title: '', course: 'CS201 - Database Management Systems', time: '' });
    alert('Live Class Scheduled Successfully! Notification broadcasted to students.');
  };

  // Delete/Cancel Scheduled Class
  const handleCancelClass = (id) => {
    if (window.confirm('Are you sure you want to cancel this live class?')) {
      setClasses((prev) => prev.filter((cls) => cls.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn relative max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Live Class Hub</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Launch instant video streams or schedule upcoming interactive live lectures
          </p>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center gap-1.5"
        >
          📅 Schedule Live Class
        </button>
      </div>

      {/* Main Container Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-sm">
            Upcoming Scheduled Sessions ({classes.length})
          </h3>
        </div>

        {/* Live Classes Grid */}
        {classes.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-bold">
            No live classes scheduled. Click "+ Schedule Live Class" to create one.
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="p-5 rounded-3xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-indigo-100 transition shadow-xs hover:shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                      {cls.course}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">
                      ● {cls.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800">{cls.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    🕒 {cls.time} • 👨‍🎓 {cls.attendees} Enrolled Students
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleCancelClass(cls.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 font-bold text-xs rounded-xl transition"
                    title="Cancel Class"
                  >
                    🗑️
                  </button>

                  <button
                    onClick={() => setActiveCall(cls)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center gap-1.5"
                  >
                    🎥 Launch Stream Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL 1: LIVE STREAM ROOM OVERLAY */}
      {activeCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="w-full max-w-4xl bg-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-2xl animate-fadeIn border border-slate-800">
            
            {/* Header Controls */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">{activeCall.title}</h3>
                <p className="text-xs text-indigo-400 font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>🔴 LIVE STREAMING • {activeCall.course}</span>
                </p>
              </div>

              <button
                onClick={() => setActiveCall(null)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                End Meeting 🛑
              </button>
            </div>

            {/* Simulated Live Camera & Screen Preview Window */}
            <div className="aspect-video bg-slate-950 rounded-2xl flex flex-col items-center justify-center border border-slate-800 text-slate-400 relative overflow-hidden shadow-inner">
              
              {!isVideoOff ? (
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-indigo-600/20 text-indigo-400 border-2 border-indigo-500 flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
                    📷
                  </div>
                  <p className="text-xs font-bold text-slate-300">
                    {isScreenSharing ? '🖥️ Desktop Screen Sharing Active' : 'Live Camera Video Stream On'}
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xl mx-auto">
                    🚫
                  </div>
                  <p className="text-xs font-bold text-slate-500">Camera Feed Off</p>
                </div>
              )}

              {/* Watermark badge */}
              <div className="absolute bottom-3 left-3 bg-slate-900/80 px-3 py-1 rounded-xl text-[10px] font-bold text-slate-300 border border-slate-800">
                👨‍🏫 Prof. Sharma (Host)
              </div>
            </div>

            {/* Bottom Stream Controls Toolbar */}
            <div className="flex justify-center items-center gap-3 pt-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-2xl text-xs font-bold transition ${
                  isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isMuted ? '🔇 Unmute Mic' : '🎙️ Mute Mic'}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-3 rounded-2xl text-xs font-bold transition ${
                  isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isVideoOff ? '📹 Turn Video On' : '🚫 Turn Video Off'}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-2xl text-xs font-bold transition ${
                  isScreenSharing ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isScreenSharing ? '🖥️ Stop Sharing' : '🖥️ Share Screen'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: SCHEDULE LIVE CLASS MODAL POPUP */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Schedule Live Class</h3>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleClass} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Lecture Topic / Title</label>
                <input
                  type="text"
                  placeholder="e.g. B-Trees & Indexing Hands-on"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Course</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="CS201 - Database Management Systems">CS201 - Database Management Systems</option>
                  <option value="DS204 - Data Science">DS204 - Data Science</option>
                  <option value="CS305 - Design & Analysis of Algorithms">CS305 - Design & Analysis of Algorithms</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Schedule Time</label>
                <input
                  type="datetime-local"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
                >
                  Schedule Class
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}