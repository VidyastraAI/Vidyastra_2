import React, { useState, useEffect } from 'react';
import { get } from '../../api.js';

export default function AnalyticsReports() {
  const [timeRange, setTimeRange] = useState('This Week');
  const [topStats, setTopStats] = useState([
    { label: 'Total Users', value: '12,845', badge: '-0.4%' },
    { label: 'Active Users', value: '8,932', badge: '+7.1%' },
    { label: 'Total Courses', value: '256', badge: '+5.2%' },
    { label: 'Total Lectures', value: '3,456', badge: '+6.8%' },
  ]);
  const [topCourses, setTopCourses] = useState([
    { name: 'DSA', height: 'h-36' },
    { name: 'DBMS', height: 'h-28' },
    { name: 'OS', height: 'h-20' },
    { name: 'AI', height: 'h-14' },
    { name: 'Web-Dev', height: 'h-10' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get('/admin/analytics-reports', { params: { timeRange } })
      .then((data) => {
        if (data) {
          if (data.topStats) setTopStats(data.topStats);
          if (data.topCourses) setTopCourses(data.topCourses);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch analytics reports, using mock fallback:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [timeRange]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Top 4 Stat Cards inline header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          {topStats.map((s, idx) => (
            <div key={idx} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
              <div className="flex items-baseline justify-between mt-1">
                <h4 className="text-lg font-black text-slate-800">{s.value}</h4>
                <span className="text-[10px] font-bold text-emerald-600">{s.badge}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>

          <button
            onClick={() => alert('Exporting Analytics Report...')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition active:scale-95"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* 3 Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">User Growth</h3>
          <div className="h-44 w-full flex items-end justify-between px-2 pt-4 pb-2 border-b border-l border-slate-200 relative">
            <svg className="absolute inset-0 w-full h-full overflow-visible p-2" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="10,120 50,105 90,110 130,85 170,90 210,50"
              />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>12 May</span><span>14 May</span><span>16 May</span><span>18 May</span>
          </div>
        </div>

        {/* Top Courses by Enrollments Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Top Courses by Enrollments</h3>
          <div className="h-44 w-full flex items-end justify-around px-2 pt-4 pb-2 border-b border-slate-200">
            {topCourses.map((c, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className={`w-8 bg-indigo-600 rounded-t-xl ${c.height}`}></div>
                <span className="text-[10px] font-bold text-slate-400">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Requests Trend Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">AI Requests Trend</h3>
          <div className="h-44 w-full flex items-end justify-between px-2 pt-4 pb-2 border-b border-l border-slate-200 relative">
            <svg className="absolute inset-0 w-full h-full overflow-visible p-2" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="10,100 50,70 90,110 130,40 170,95 210,30"
              />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>12 May</span><span>14 May</span><span>16 May</span><span>18 May</span>
          </div>
        </div>

      </div>

      <div className="text-center pt-2">
        <button onClick={() => alert('Loading detailed analytics report...')} className="text-xs font-bold text-indigo-600 hover:underline">
          View Detailed Report →
        </button>
      </div>

    </div>
  );
}