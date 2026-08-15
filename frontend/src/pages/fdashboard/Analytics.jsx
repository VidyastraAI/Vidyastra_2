import React, { useState } from 'react';

// Timeframe Metrics Data Map
const METRICS_BY_TIMEFRAME = {
  'This Month': {
    avgAttendance: '86%',
    lecturesConducted: '18',
    contentGenerated: '42',
    studentEngagement: '78%',
    chartPoints: [30, 55, 48, 45, 62, 52, 70],
  },
  'Last Month': {
    avgAttendance: '82%',
    lecturesConducted: '22',
    contentGenerated: '38',
    studentEngagement: '74%',
    chartPoints: [25, 40, 50, 60, 55, 65, 60],
  },
  'This Semester': {
    avgAttendance: '88%',
    lecturesConducted: '64',
    contentGenerated: '120',
    studentEngagement: '81%',
    chartPoints: [40, 60, 70, 65, 80, 75, 88],
  },
  'All Time': {
    avgAttendance: '85%',
    lecturesConducted: '142',
    contentGenerated: '280',
    studentEngagement: '79%',
    chartPoints: [35, 50, 65, 75, 70, 85, 90],
  },
};

const TOP_PERFORMING_LECTURES = [
  { id: 1, title: '1. DSA - Arrays', score: '92%', course: 'Data Structures' },
  { id: 2, title: '2. DBMS - Normalization', score: '88%', course: 'DBMS' },
  { id: 3, title: '3. OS - Process Management', score: '85%', course: 'Operating Systems' },
  { id: 4, title: '4. AI Lab - Searching', score: '80%', course: 'Artificial Intelligence' },
];

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('This Month');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const currentMetrics = METRICS_BY_TIMEFRAME[timeframe] || METRICS_BY_TIMEFRAME['This Month'];

  return (
    <div className="space-y-6 animate-fadeIn relative max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track attendance, lecture engagement, and content metrics</p>
        </div>

        {/* Timeframe Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Filter:</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-xs"
          >
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="This Semester">This Semester</option>
            <option value="All Time">All Time</option>
          </select>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        
        {/* Overview Metric Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md space-y-1">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">AVG. ATTENDANCE</p>
            <h3 className="text-2xl font-extrabold text-indigo-600">{currentMetrics.avgAttendance}</h3>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md space-y-1">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">LECTURES CONDUCTED</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{currentMetrics.lecturesConducted}</h3>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md space-y-1">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">CONTENT GENERATED</p>
            <h3 className="text-2xl font-extrabold text-purple-600">{currentMetrics.contentGenerated}</h3>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md space-y-1">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">STUDENT ENGAGEMENT</p>
            <h3 className="text-2xl font-extrabold text-emerald-600">{currentMetrics.studentEngagement}</h3>
          </div>
        </div>

        {/* Graph & Top Lectures Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Lecture Views Interactive Chart (8 Cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Lecture Views</h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                {timeframe}
              </span>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="w-full h-48 relative flex items-end justify-between px-2 pt-6">
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                {/* Background grid lines */}
                <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#f1f5f9" strokeDasharray="4" />
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#f1f5f9" strokeDasharray="4" />
                <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#f1f5f9" strokeDasharray="4" />

                {/* Line Path */}
                <path
                  d="M 10 120 Q 80 50, 150 80 T 290 40 T 430 90 T 570 30"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Data Dots */}
              {[
                { label: '1 May', val: '280 views' },
                { label: '8 May', val: '450 views' },
                { label: '15 May', val: '620 views' },
                { label: '22 May', val: '510 views' },
                { label: '29 May', val: '780 views' },
              ].map((pt, i) => (
                <div key={i} className="z-10 flex flex-col items-center group relative cursor-pointer">
                  <div className="w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow-md group-hover:scale-125 transition"></div>
                  
                  {/* Tooltip */}
                  <span className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-md transition whitespace-nowrap">
                    {pt.val}
                  </span>
                  
                  <span className="text-[11px] font-bold text-slate-400 mt-8">{pt.label}</span>
                </div>
              ))}
            </div>

            {/* Link Action */}
            <div className="text-center border-t border-slate-100 pt-3">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition"
              >
                View Detailed Report →
              </button>
            </div>
          </div>

          {/* Top Performing Lectures (4 Cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
              Top Performing Lectures
            </h3>

            <div className="space-y-3">
              {TOP_PERFORMING_LECTURES.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 hover:bg-indigo-50/50 transition cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{item.course}</p>
                  </div>
                  <span className="text-xs font-extrabold text-indigo-600 bg-white px-2.5 py-1 rounded-xl shadow-xs border border-indigo-100">
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* DETAILED REPORT MODAL POPUP */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 space-y-5 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Detailed Performance Analytics</h3>
                <p className="text-[11px] text-indigo-600 font-bold">Report for: {timeframe}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-medium text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Total Enrolled Active Students</span>
                <strong className="text-slate-900">184 Students</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Average Student Watch Duration</span>
                <strong className="text-slate-900">38.4 Mins / Lecture</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>AI Generated Quiz Attempt Rate</span>
                <strong className="text-slate-900">84.2%</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Highest Scoring Class</span>
                <strong className="text-indigo-600">CS201 - DBMS (92%)</strong>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => alert('Exporting Analytics CSV Report...')}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
              >
                Export CSV 📥
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}