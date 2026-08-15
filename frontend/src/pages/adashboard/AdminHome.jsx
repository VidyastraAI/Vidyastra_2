import React, { useState, useEffect } from 'react';
import { get } from '../../api.js';

export default function AdminHome() {
  const [dateRange, setDateRange] = useState('12 May - 18 May 2025');
  const [stats, setStats] = useState([
    { label: 'Total Users', value: '12,845', change: '-0.4% vs last week', negative: true, icon: '👥' },
    { label: 'Students', value: '11,327', change: '+7.6%', negative: false, icon: '🎓' },
    { label: 'Faculty', value: '1,241', change: '+6.1%', negative: false, icon: '👨‍🏫' },
    { label: 'Active Courses', value: '256', change: '+5.2%', negative: false, icon: '📚' },
  ]);
  const [contentGenerated, setContentGenerated] = useState([
    { label: 'Notes', count: '3,456' },
    { label: 'Quizzes', count: '2,148' },
    { label: 'Summaries', count: '1,987' },
    { label: 'Flashcards', count: '1,293' },
  ]);
  const [systemHealth, setSystemHealth] = useState([
    { label: 'All Systems', status: 'Healthy', color: 'text-emerald-600' },
    { label: 'All Services', status: 'Healthy', color: 'text-emerald-600' },
    { label: 'Storage', status: '72% Used', color: 'text-slate-600' },
    { label: 'DB Status', status: 'Healthy', color: 'text-emerald-600' },
  ]);
  const [recentActivities, setRecentActivities] = useState([
    { text: 'New user registered: Priya Singh', time: '2 min ago', icon: '👤' },
    { text: 'Course "DBMS" approved by Admin', time: '15 min ago', icon: '✅' },
    { text: 'High AI usage detected', time: '30 min ago', icon: '⚠️' },
    { text: 'Faculty "Amit Sharma" uploaded a lecture', time: '1 hr ago', icon: '📹' },
  ]);
  const [topActiveCourses, setTopActiveCourses] = useState([
    { name: '1. Data Structures', students: '2,345 Students' },
    { name: '2. Database Management', students: '1,987 Students' },
    { name: '3. Operating Systems', students: '1,562 Students' },
    { name: '4. Artificial Intelligence', students: '1,300 Students' },
  ]);
  const [totalAiRequests, setTotalAiRequests] = useState('18,325');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get('/admin/dashboard', { params: { dateRange } })
      .then((data) => {
        if (data) {
          if (data.stats) setStats(data.stats);
          if (data.contentGenerated) setContentGenerated(data.contentGenerated);
          if (data.systemHealth) setSystemHealth(data.systemHealth);
          if (data.recentActivities) setRecentActivities(data.recentActivities);
          if (data.topActiveCourses) setTopActiveCourses(data.topActiveCourses);
          if (data.totalAiRequests) setTotalAiRequests(data.totalAiRequests);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch admin dashboard stats, using mock fallback:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dateRange]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Welcome back, Admin! 👋</h2>
          <p className="text-xs font-semibold text-slate-400">Here's what's happening on Vidyastra AI</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="12 May - 18 May 2025">12 May - 18 May 2025</option>
            <option value="5 May - 11 May 2025">5 May - 11 May 2025</option>
          </select>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
              <span className="p-2 rounded-xl bg-slate-50 text-base shadow-inner">{item.icon}</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">{item.value}</h3>
              <p className={`text-[11px] font-bold ${item.negative ? 'text-rose-500' : 'text-emerald-600'}`}>
                {item.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Grid: AI Usage & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* AI Usage (This Week) - 7 Cols */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-base">AI Usage (This Week)</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">+ 12.3%</span>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400">Total Requests</p>
            <h4 className="text-2xl font-black text-slate-800">{totalAiRequests}</h4>
          </div>

          {/* Simple Line Graph representation */}
          <div className="h-32 w-full flex items-end justify-between px-2 pt-4 pb-2 border-b border-l border-slate-200 relative">
            <svg className="absolute inset-0 w-full h-full overflow-visible p-2" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="10,90 60,75 110,85 160,88 210,60 260,70 310,40"
              />
            </svg>
          </div>
        </div>

        {/* Content Generated & System Health - 5 Cols */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Content Generated Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">Content Generated</h3>
            <div className="space-y-2 pt-1">
              {contentGenerated.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">• {item.label}</span>
                  <span className="text-slate-800">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Health Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">System Health</h3>
            <div className="space-y-2 pt-1">
              {systemHealth.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">• {item.label}</span>
                  <span className={item.color}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Grid: Recent Activities & Top Active Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Activities */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="flex items-center gap-3">
                  <span className="text-sm">{act.icon}</span>
                  <span>{act.text}</span>
                </div>
                <span className="text-slate-400 font-semibold">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Active Courses */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-base">Top Active Courses</h3>
            <button onClick={() => alert('View all courses')} className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {topActiveCourses.map((c, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                <span>{c.name}</span>
                <span className="text-indigo-600">{c.students}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}