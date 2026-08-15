import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../api/studentAPI';

export default function ProgressAnalytics() {
  const [timeFilter, setTimeFilter] = useState('This Month');
  
  // State variables for backend data
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({
    completedModules: 0,
    totalModules: 10,
    quizScores: [],
  });
  const [lecturesCount, setLecturesCount] = useState(0);
  const [quizzesCount, setQuizzesCount] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  // Fetch user progress and related metrics on mount
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [progressRes, lecturesRes] = await Promise.all([
          studentAPI.getProgressAnalytics(),
          studentAPI.getAllLectures(),
        ]);

        const progress = progressRes.data?.data || progressRes.data || {};
        setProgressData(progress);
        
        const lectures = lecturesRes.data?.data || lecturesRes.data || [];
        setLecturesCount(Array.isArray(lectures) ? lectures.length : 0);
        
        // Quizzes count derived from progress or default
        setQuizzesCount(progress.quizzesCount || (progress.quizScores ? progress.quizScores.length : 0));

        // Compute average score from quiz scores if available
        const scores = progress.quizScores || [];
        if (scores.length > 0) {
          const total = scores.reduce((acc, curr) => acc + (curr.score || 0), 0);
          setAverageScore(Math.round((total / (scores.length * 5)) * 100)); // assuming out of 5 or general calculation
        } else {
          setAverageScore(progress.averageScore || 78); // Fallback metric default
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const topicPerformance = [
    { name: 'Arrays', percentage: 85, color: 'bg-emerald-500' },
    { name: 'Linked Lists', percentage: 70, color: 'bg-indigo-600' },
    { name: 'Stacks', percentage: 90, color: 'bg-emerald-500' },
    { name: 'DBMS', percentage: 65, color: 'bg-amber-500' },
    { name: 'OS', percentage: 60, color: 'bg-rose-500' },
  ];

  const weakTopics = [
    { id: 1, title: 'DBMS Normalization' },
    { id: 2, title: 'OS - Deadlocks' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header & Dropdown Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">Progress & Analytics</h2>
        
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="px-4 py-2 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
        >
          <option value="This Month">This Month</option>
          <option value="Last 3 Months">Last 3 Months</option>
          <option value="This Year">This Year</option>
        </select>
      </div>

      {/* Top 4 Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Study Time</p>
          <h3 className="text-2xl font-black text-slate-800">24h 30m</h3>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Lectures Watched</p>
          <h3 className="text-2xl font-black text-slate-800">{loading ? '...' : lecturesCount}</h3>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Quizzes Attempted</p>
          <h3 className="text-2xl font-black text-slate-800">{loading ? '...' : quizzesCount}</h3>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg. Score</p>
          <h3 className="text-2xl font-black text-indigo-600">{loading ? '...' : `${averageScore}%`}</h3>
        </div>
      </div>

      {/* Middle Grid: Study Time Graph & Topic Wise Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Study Time Graph Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Study Time (Hours)</h3>
          
          <div className="h-48 relative flex items-end justify-between px-2 pt-6 pb-2 border-b border-l border-slate-200">
            {/* Grid lines */}
            <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-100"></div>
            <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-100"></div>
            <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-100"></div>

            {/* Data points & connecting line simulation */}
            <div className="absolute inset-0 flex items-center justify-between px-6">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  points="20,110 80,95 140,70 200,90 260,55 320,65 380,25"
                />
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="absolute -bottom-6 inset-x-0 flex justify-between text-[11px] font-bold text-slate-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Topic Wise Performance Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-5">
          <h3 className="font-bold text-slate-800 text-base">Topic Wise Performance</h3>

          <div className="space-y-3.5">
            {topicPerformance.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.name}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Row: Weak Topics & Improve Now Button */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h3 className="font-bold text-slate-800 text-base">Weak Topics</h3>
          <div className="flex flex-wrap gap-4">
            {weakTopics.map((topic) => (
              <div key={topic.id} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>{topic.title}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => alert('Starting AI targeted revision for weak topics...')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition active:scale-95 flex-shrink-0"
        >
          Improve Now
        </button>
      </div>

    </div>
  );
}