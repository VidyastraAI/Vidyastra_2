import React, { useState } from 'react';

// Mock Processing Jobs Data
const MOCK_PROCESSING_JOBS = [
  {
    id: 1,
    title: 'Lecture 14: B-Trees & Clustered Indexing',
    course: 'CS201 - Database Management Systems',
    status: 'Completed',
    progress: 100,
    uploadTime: '02 Aug 2026, 11:30 AM',
    aiNotesGenerated: true,
    quizGenerated: true,
    summaryPreview: 'Detailed B-Tree indexing summary generated including node insertion heuristics and clustered vs non-clustered index comparison.',
  },
  {
    id: 2,
    title: 'Lecture 09: Supervised Learning EDA & Regression',
    course: 'DS204 - Data Science',
    status: 'In Progress',
    progress: 65,
    uploadTime: 'Today, 10:15 AM',
    aiNotesGenerated: true,
    quizGenerated: false,
    summaryPreview: 'Transcription complete. AI is currently generating multiple-choice quiz questions from the lecture audio...',
  },
  {
    id: 3,
    title: 'Lecture 12: Dynamic Programming LCS Algorithm',
    course: 'CS305 - DAA',
    status: 'In Progress',
    progress: 30,
    uploadTime: 'Today, 11:45 AM',
    aiNotesGenerated: false,
    quizGenerated: false,
    summaryPreview: 'Audio transcribing in progress (Whisper AI engine)...',
  },
];

export default function LectureProcessingCenter() {
  const [jobs, setJobs] = useState(MOCK_PROCESSING_JOBS);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Modals
  const [previewJob, setPreviewJob] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // New Upload Form State
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCourse, setNewJobCourse] = useState('CS201 - DBMS');
  const [selectedFile, setSelectedFile] = useState(null);

  // Filter Jobs
  const filteredJobs = jobs.filter((job) => {
    if (activeFilter === 'In Progress') return job.status === 'In Progress';
    if (activeFilter === 'Completed') return job.status === 'Completed';
    return true;
  });

  // Re-process Job
  const handleReprocess = (id) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'In Progress', progress: 45 } : j))
    );
    alert('AI Re-processing triggered for this lecture!');
  };

  // Delete Job
  const handleDeleteJob = (id) => {
    if (window.confirm('Are you sure you want to remove this processing job?')) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }
  };

  // Handle New Upload Submission
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newJobTitle) return;

    const newJobObj = {
      id: Date.now(),
      title: newJobTitle,
      course: newJobCourse,
      status: 'In Progress',
      progress: 15,
      uploadTime: 'Just Now',
      aiNotesGenerated: false,
      quizGenerated: false,
      summaryPreview: 'Video uploaded successfully. Initializing AI audio pipeline...',
    };

    setJobs([newJobObj, ...jobs]);
    setIsUploadModalOpen(false);
    setNewJobTitle('');
    setSelectedFile(null);
    alert('Lecture video uploaded! Added to AI Processing queue.');
  };

  return (
    <div className="space-y-6 animate-fadeIn relative max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Lecture Processing Center</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor automatic audio transcription, AI summary extraction, and quiz generation
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center gap-1.5"
        >
          📹 Upload New Lecture
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          {['All', 'In Progress', 'Completed'].map((filter) => {
            const count = jobs.filter((j) => (filter === 'All' ? true : j.status === filter)).length;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                  activeFilter === filter
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{filter} Jobs</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeFilter === filter ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-bold">
            No processing jobs found for this filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-3xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-indigo-100 transition shadow-xs hover:shadow-md space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                      {job.course}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 mt-1">{job.title}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Uploaded: {job.uploadTime}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    job.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700 animate-pulse'
                  }`}>
                    ● {job.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 bg-white p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-600">AI Pipeline Progress</span>
                    <span className="text-indigo-600">{job.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>

                {/* Sub-steps Badges & Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold">
                    <span className={`px-2.5 py-1 rounded-lg border ${
                      job.aiNotesGenerated ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {job.aiNotesGenerated ? '✓ AI Notes Ready' : '⏳ AI Notes Pending'}
                    </span>

                    <span className={`px-2.5 py-1 rounded-lg border ${
                      job.quizGenerated ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {job.quizGenerated ? '✓ AI Quiz Ready' : '⏳ Quiz Pending'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReprocess(job.id)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                      title="Re-process AI Pipeline"
                    >
                      🔄 Re-process
                    </button>

                    <button
                      onClick={() => setPreviewJob(job)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center gap-1"
                    >
                      👁️ View Details
                    </button>

                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 font-bold text-xs rounded-xl transition"
                      title="Delete Job"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL 1: PREVIEW OUTPUT POPUP */}
      {previewJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 space-y-4 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">{previewJob.title}</h3>
                <p className="text-xs text-indigo-600 font-bold">{previewJob.course}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewJob(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                Pipeline Status: {previewJob.status} ({previewJob.progress}%)
              </span>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
                <p className="font-bold text-slate-900 mb-1">AI Output Summary:</p>
                {previewJob.summaryPreview}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewJob(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Navigating to Content Library...');
                  window.location.href = '/faculty/content-library';
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
              >
                Open in Content Library →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD NEW LECTURE MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Upload Lecture Video</h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Lecture Title</label>
                <input
                  type="text"
                  placeholder="e.g. B-Trees Insertion & Deletion Operations"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Course</label>
                <select
                  value={newJobCourse}
                  onChange={(e) => setNewJobCourse(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="CS201 - Database Management Systems">CS201 - DBMS</option>
                  <option value="DS204 - Data Science">DS204 - Data Science</option>
                  <option value="CS305 - DAA">CS305 - Design & Analysis of Algorithms</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Video File (MP4/MKV)</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
                >
                  Start Processing 🚀
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}