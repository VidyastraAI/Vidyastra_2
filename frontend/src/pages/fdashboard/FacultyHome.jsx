import React, { useState } from 'react';

const MOCK_STATS = [
  { label: 'Active Courses', value: '3', color: 'text-indigo-600', icon: '📚' },
  { label: 'Total Enrolled Students', value: '184', color: 'text-emerald-600', icon: '👨‍🎓' },
  { label: 'Pending Assignments', value: '14', color: 'text-amber-600', icon: '📝' },
  { label: 'Lectures Processed', value: '28', color: 'text-purple-600', icon: '⚙️' },
];

const MOCK_UPCOMING_CLASSES = [
  { id: 1, title: 'DBMS: B-Trees & Indexing Hands-on', course: 'CS201', time: 'Today, 02:00 PM', platform: 'Live Stream' },
  { id: 2, title: 'Data Science: Supervised Learning EDA', course: 'DS204', time: 'Tomorrow, 10:00 AM', platform: 'Live Stream' },
];

export default function FacultyHome() {
  const [classes] = useState(MOCK_UPCOMING_CLASSES);

  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 p-6 rounded-3xl text-white shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Welcome Back, Faculty Portal! 👋</h2>
          <p className="text-xs text-indigo-200 mt-1">Manage your courses, schedule live classes, and evaluate student submissions.</p>
        </div>
        <button
          onClick={() => navigateTo('/faculty/live-class')}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-700 font-bold text-xs rounded-2xl shadow-md hover:bg-indigo-50 transition active:scale-95"
        >
          🎥 Launch Live Class
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {MOCK_STATS.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md space-y-1">
            <div className="flex justify-between items-center text-xl">
              <span>{stat.icon}</span>
            </div>
            <h3 className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</h3>
            <p className="text-[11px] font-extrabold uppercase text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upcoming Live Schedule (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm">Upcoming Scheduled Classes</h3>
            <button onClick={() => navigateTo('/faculty/live-class')} className="text-xs font-bold text-indigo-600 hover:underline">
              Go to Schedule →
            </button>
          </div>

          <div className="space-y-3">
            {classes.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md">
                    {item.course}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">🕒 {item.time}</p>
                </div>
                <button
                  onClick={() => navigateTo('/faculty/live-class')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition active:scale-95 shadow-xs"
                >
                  Start Class ▶
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tools Sidebar (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-indigo-500/30 text-indigo-300 rounded-lg">
            ⚡ Quick Actions
          </span>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => navigateTo('/faculty/record-upload')}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/10 transition text-left px-4 flex items-center justify-between"
            >
              <span>📹 Upload Lecture Video</span>
              <span>→</span>
            </button>
            <button
              onClick={() => navigateTo('/faculty/assignments')}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/10 transition text-left px-4 flex items-center justify-between"
            >
              <span>📝 Create New Assignment</span>
              <span>→</span>
            </button>
            <button
              onClick={() => navigateTo('/faculty/ai-assistant')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition text-left px-4 flex items-center justify-between"
            >
              <span>✨ Generate Quiz via AI</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}