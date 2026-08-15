import React, { useState } from 'react';

// Mock Hardcoded Logs Data
const MOCK_SYSTEM_LOGS = [
  {
    id: 1,
    time: '18 May 2026, 10:30 AM',
    type: 'Info',
    message: 'User login: admin@vidyastra.ai',
    status: 'Success',
    ip: '192.168.1.102',
    details: 'Admin user authenticated successfully via Web Admin Portal.',
  },
  {
    id: 2,
    time: '18 May 2026, 10:35 AM',
    type: 'Warning',
    message: 'High AI usage detected',
    status: 'Warning',
    ip: '10.0.4.12',
    details: 'AI Whisper transcription pipeline CPU load crossed 85% safety threshold.',
  },
  {
    id: 3,
    time: '18 May 2026, 10:30 AM',
    type: 'Error',
    message: 'File upload failed: lecture.mp4',
    status: 'Resolved',
    ip: '172.16.0.44',
    details: 'Connection reset mid-chunk upload. Temporary chunk buffer auto-cleared.',
  },
  {
    id: 4,
    time: '17 May 2026, 04:12 PM',
    type: 'Info',
    message: 'PostgreSQL Automated Database Backup Completed',
    status: 'Success',
    ip: '127.0.0.1',
    details: '4.2GB compressed dump file successfully transferred to cloud bucket.',
  },
  {
    id: 5,
    time: '16 May 2026, 09:10 AM',
    type: 'Error',
    message: 'SMTP Socket Connection Timeout',
    status: 'Resolved',
    ip: '192.168.1.1',
    details: 'Mail gateway auto-reconnected successfully on retry attempt #2.',
  },
];

// Mock Backups Data
const MOCK_BACKUPS = [
  { id: 1, date: '15 May 2026, 02:00 AM', status: 'Success', size: '4.2 GB', type: 'Automated' },
  { id: 2, date: '14 May 2026, 03:00 AM', status: 'Success', size: '4.1 GB', type: 'Automated' },
  { id: 3, date: '13 May 2026, 03:00 AM', status: 'Success', size: '4.1 GB', type: 'Automated' },
  { id: 4, date: '12 May 2026, 03:00 AM', status: 'Success', size: '4.0 GB', type: 'Manual' },
];

export default function SystemManagement() {
  const [activeTab, setActiveTab] = useState('Server Status'); // Default Tab
  const [logs] = useState(MOCK_SYSTEM_LOGS);
  const [backups, setBackups] = useState(MOCK_BACKUPS);
  const [showAllLogs, setShowAllLogs] = useState(false);

  // Modal Popups State
  const [selectedLog, setSelectedLog] = useState(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Trigger Manual Backup
  const handleTriggerManualBackup = () => {
    const newBackup = {
      id: Date.now(),
      date: 'Today, Just Now',
      status: 'Success',
      size: '4.3 GB',
      type: 'Manual',
    };
    setBackups([newBackup, ...backups]);
    alert('New manual system backup archive generated successfully!');
  };

  return (
    <div className="space-y-6 animate-fadeIn relative max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">System Infrastructure</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time system health, server status, storage capacity, and audit logs
          </p>
        </div>
      </div>

      {/* WORKING NAVIGATION TABS (Top Switcher) */}
      <div className="p-1.5 bg-slate-100/90 rounded-3xl border border-slate-200/80 w-fit flex items-center gap-1 shadow-inner">
        {[
          { id: 'System Health', label: 'System Health' },
          { id: 'Server Status', label: 'Server Status' },
          { id: 'Storage', label: 'Storage' },
          { id: 'Backup', label: 'Backup' },
          { id: 'Logs', label: 'Logs' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-2xl text-xs font-bold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 shadow-md font-extrabold scale-105'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DYNAMIC CONTENT SWITCHING BASED ON ACTIVE TAB */}

      {/* TAB 1: SYSTEM HEALTH VIEW */}
      {activeTab === 'System Health' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">
                Uptime Status
              </span>
              <h3 className="text-2xl font-extrabold text-slate-800">99.98%</h3>
              <p className="text-xs text-slate-400 font-medium">System online for last 48 days</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md">
                CPU Load Average
              </span>
              <h3 className="text-2xl font-extrabold text-indigo-600">34.2%</h3>
              <p className="text-xs text-slate-400 font-medium">Optimal performance across 8 cores</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md">
                RAM Utilization
              </span>
              <h3 className="text-2xl font-extrabold text-purple-600">18.4 GB / 32 GB</h3>
              <p className="text-xs text-slate-400 font-medium">57.5% memory allocated</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVER STATUS VIEW (Screen Shown in Screenshot) */}
      {(activeTab === 'Server Status' || activeTab === 'Logs') && (
        <div className="space-y-6 animate-fadeIn">
          {/* THREE CARDS ROW MATCHING SCREENSHOT EXACTLY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* CARD 1: SERVER OVERVIEW (4 COLS) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4 flex flex-col justify-between">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
                Server Overview
              </h3>

              <div className="space-y-3 text-xs font-medium">
                {[
                  { name: 'Web Server', status: 'Healthy' },
                  { name: 'Database Server', status: 'Healthy' },
                  { name: 'AI Processing Server', status: 'Healthy' },
                  { name: 'File Storage', status: 'Healthy' },
                  { name: 'Cache Server', status: 'Healthy' },
                ].map((server, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-700 font-bold">{server.name}</span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 font-extrabold text-[10px] rounded-md border border-emerald-100">
                      {server.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 2: STORAGE USAGE DONUT CHART (4 COLS) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4 flex flex-col items-center justify-between text-center">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 w-full text-left">
                Storage Usage
              </h3>

              {/* Donut Chart Indicator */}
              <div className="relative w-36 h-36 flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-600"
                    strokeDasharray="72, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-slate-800">72%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Used</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 text-[11px] font-bold text-slate-600 border-t border-slate-100 pt-3 w-full">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  <span>Used: 720 GB</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                  <span>Available: 280 GB</span>
                </div>
              </div>
            </div>

            {/* CARD 3: RECENT BACKUPS (4 COLS) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4 flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 text-sm">Recent Backups</h3>
              </div>

              <div className="space-y-2.5 text-xs font-medium">
                {backups.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1">
                    <span className="text-slate-600 font-bold">{item.date}</span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 font-extrabold text-[10px] rounded-md border border-emerald-100">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 text-right">
                <button
                  type="button"
                  onClick={() => setIsBackupModalOpen(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition"
                >
                  View All Backup →
                </button>
              </div>
            </div>

          </div>

          {/* BOTTOM SECTION: SYSTEM LOGS TABLE */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">System Logs (Recent)</h3>
              <button
                type="button"
                onClick={() => setShowAllLogs(!showAllLogs)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition"
              >
                {showAllLogs ? 'Show Less' : 'View All Logs →'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">TIME</th>
                    <th className="py-3 px-4">TYPE</th>
                    <th className="py-3 px-4">MESSAGE</th>
                    <th className="py-3 px-4 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {(showAllLogs ? logs : logs.slice(0, 3)).map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      <td className="py-4 px-4 text-slate-500 font-bold">{log.time}</td>
                      <td className="py-4 px-4 font-extrabold">
                        <span className={`px-2 py-0.5 rounded-md ${
                          log.type === 'Info' ? 'text-indigo-600 bg-indigo-50' :
                          log.type === 'Warning' ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-800">{log.message}</td>
                      <td className="py-4 px-4 text-right font-extrabold">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] ${
                          log.status === 'Success' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' :
                          log.status === 'Warning' ? 'text-amber-600 bg-amber-50 border border-amber-100' :
                          'text-indigo-600 bg-indigo-50 border border-indigo-100'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STORAGE DETAILS VIEW */}
      {activeTab === 'Storage' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl space-y-4 animate-fadeIn">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-3">Detailed Cloud Storage Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
            <div className="p-4 bg-slate-50 rounded-2xl border">
              <p className="text-slate-400">Lecture Videos (MP4/MKV)</p>
              <p className="text-lg text-slate-800 mt-1">540 GB</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border">
              <p className="text-slate-400">AI Generated PDFs & Notes</p>
              <p className="text-lg text-slate-800 mt-1">110 GB</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border">
              <p className="text-slate-400">Database Snapshots</p>
              <p className="text-lg text-slate-800 mt-1">70 GB</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BACKUP MANAGEMENT VIEW */}
      {activeTab === 'Backup' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-slate-800 text-sm">System Backup Archives</h3>
            <button
              onClick={handleTriggerManualBackup}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition"
            >
              📦 Trigger New Backup Now
            </button>
          </div>

          <div className="space-y-2">
            {backups.map((b) => (
              <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-800">{b.date}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Type: {b.type} • Size: {b.size}</p>
                </div>
                <button
                  onClick={() => alert(`Downloading backup file (${b.size})...`)}
                  className="px-4 py-1.5 bg-indigo-600 text-white font-bold rounded-xl text-xs"
                >
                  Download Archive 📥
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: BACKUPS OVERLAY */}
      {isBackupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">System Backups Archive</h3>
                <p className="text-xs text-indigo-600 font-bold">Automated PostgreSQL & Storage Snapshots</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBackupModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {backups.map((b) => (
                <div key={b.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{b.date}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Archive Size: {b.size}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading backup archive (${b.size})...`)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    Download 📥
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleTriggerManualBackup}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
              >
                📦 Create Manual Backup
              </button>

              <button
                type="button"
                onClick={() => setIsBackupModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: LOG DETAILS POPUP */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">{selectedLog.message}</h3>
                <p className="text-[11px] text-slate-400 font-bold">{selectedLog.time}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-400 font-bold">Origin IP</span>
                <strong className="text-slate-800">{selectedLog.ip}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-400 font-bold">Event Type</span>
                <strong className="text-indigo-600">{selectedLog.type}</strong>
              </div>
              <div className="space-y-1 pt-1">
                <span className="text-slate-400 font-bold">Full Trace Details:</span>
                <p className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 font-mono text-[11px]">
                  {selectedLog.details}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}