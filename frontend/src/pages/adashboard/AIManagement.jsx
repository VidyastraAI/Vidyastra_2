import React, { useState, useEffect } from 'react';
import { get } from '../../api.js';

export default function AiManagement() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState([
    { label: 'Total AI Requests (This Week)', value: '18,325', badge: '+12.3%', positive: true },
    { label: 'Avg. Response Time', value: '2.4 sec', badge: '-0.3%', positive: true },
    { label: 'Tokens Consumed', value: '5.2M', badge: '+10.2%', positive: false },
    { label: 'Cost Dist.', value: '$1,245.30', badge: '+5.1%', negative: true },
  ]);
  const [features, setFeatures] = useState([
    { label: 'Notes Generation', val: '35%', color: 'bg-indigo-600' },
    { label: 'Quiz Generation', val: '25%', color: 'bg-teal-500' },
    { label: 'Summarization', val: '20%', color: 'bg-amber-500' },
    { label: 'Transcription', val: '10%', color: 'bg-rose-500' },
    { label: 'Others', val: '10%', color: 'bg-slate-400' },
  ]);
  const [models, setModels] = useState([
    { name: 'GPT-4o', status: 'Healthy' },
    { name: 'Whisper', status: 'Healthy' },
    { name: 'Llama 3', status: 'Healthy' },
    { name: 'TTS Model', status: 'Healthy' },
    { name: 'Embeddings', status: 'Healthy' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get('/admin/ai-management', { params: { tab: activeTab } })
      .then((data) => {
        if (data) {
          if (data.stats) setStats(data.stats);
          if (data.features) setFeatures(data.features);
          if (data.models) setModels(data.models);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch AI management data, using mock fallback:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeTab]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Tabs & Settings Row */}
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-fit">
          {['Overview', 'Usage Monitor', 'Model Settings', 'Processing Queue', 'API Usage'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button onClick={() => alert('Opening AI Config Settings')} className="p-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-700 hover:bg-slate-50">
          ⚙️
        </button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-800">{s.value}</h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{s.badge}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Grid: Trend, Features Breakdown, Model Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* AI Requests Trend (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">AI Requests Trend</h3>
          <div className="h-40 w-full flex items-end justify-between px-2 pt-4 pb-2 border-b border-l border-slate-200 relative">
            <svg className="absolute inset-0 w-full h-full overflow-visible p-2" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="15,100 65,80 115,95 165,70 215,85 265,50"
              />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Requests by Feature (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Requests by Feature</h3>
          <div className="space-y-2.5 pt-2">
            {features.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${f.color}`}></span>
                  <span>{f.label}</span>
                </div>
                <span className="text-slate-900">{f.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Model Status (3 Cols) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Model Status</h3>
          <div className="space-y-3 pt-2">
            {models.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">{m.name}</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{m.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="text-center pt-2">
        <button onClick={() => alert('Loading full AI analytics...')} className="text-xs font-bold text-indigo-600 hover:underline">
          View Full AI Analytics →
        </button>
      </div>

    </div>
  );
}