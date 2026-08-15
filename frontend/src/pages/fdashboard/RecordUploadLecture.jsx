import React, { useState, useRef } from 'react';
import { lectureApi } from '../../API/lectureApi';

export default function RecordUploadLecture() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'record'
  
  // Upload Form States (Clean Initial State)
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('Database Management Systems');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSaving] = useState(false);
  
  // AI Pipeline Action Toggles
  const [generateNotes, setGenerateNotes] = useState(true);
  const [generateQuiz, setGenerateQuiz] = useState(true);
  const [generateTranscript, setGenerateTranscript] = useState(true);

  // Live Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);

  // Upload Progress Overlay Modal State
  const [isProcessingModal, setIsProcessingModal] = useState(false);

  // 1. Start Real WebCam & Microphone Camera Recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      videoChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Camera/Microphone permission error:', err);
      alert('Camera and Microphone access permissions are required for live recording.');
    }
  };

  // 2. Stop Live Camera Recording & Directly Stream Blob to Backend API
  const handleStopRecording = async () => {
    clearInterval(timerRef.current);
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }

    setIsRecording(false);
    setIsProcessingModal(true);

    setTimeout(async () => {
      const videoBlob = new Blob(videoChunksRef.current, { type: 'video/mp4' });
      const recordedFile = new File([videoBlob], `recorded_lecture_${Date.now()}.mp4`, { type: 'video/mp4' });

      const formData = new FormData();
      formData.append('title', `Live Camera Lecture - ${new Date().toLocaleDateString()}`);
      formData.append('courseId', course);
      formData.append('description', 'Recorded live via browser MediaStream');
      formData.append('video', recordedFile);
      formData.append('generateNotes', generateNotes);
      formData.append('generateQuiz', generateQuiz);
      formData.append('generateTranscript', generateTranscript);

      try {
        await lectureApi.uploadLecture(formData);
        alert('Live camera recorded lecture uploaded and sent to backend database successfully!');
        window.location.href = '/faculty/processing-center';
      } catch (err) {
        console.error('Recording Stream Upload Error:', err);
        alert('Failed to upload live recording to backend API: ' + (err.response?.data?.message || err.message));
      } finally {
        setIsProcessingModal(false);
      }
    }, 600);
  };

  // Format Helper for Recording Timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 3. Real Backend API Form Submission for File Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a valid lecture title.');
      return;
    }
    if (!selectedFile) {
      alert('Please select a video file to upload.');
      return;
    }

    setIsProcessingModal(true);
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('courseId', course);
      formData.append('description', description);
      formData.append('video', selectedFile);
      formData.append('generateNotes', generateNotes);
      formData.append('generateQuiz', generateQuiz);
      formData.append('generateTranscript', generateTranscript);

      // Real POST /lectures API Call
      await lectureApi.uploadLecture(formData);

      alert('Lecture Video successfully uploaded to server and queued for AI processing!');
      
      // Reset Form State
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      
      // Redirect to Faculty Processing Queue
      window.location.href = '/faculty/processing-center';
    } catch (error) {
      console.error('Lecture Upload API Error:', error);
      alert('Error uploading video to server: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessingModal(false);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn relative max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Record & Upload Lecture</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Record live camera lectures or upload video files to trigger AI auto-note extraction
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'upload'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📤 Upload Video File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('record')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'record'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎥 Live Camera Record
          </button>
        </div>
      </div>

      {/* MODE 1: UPLOAD RECORDED VIDEO */}
      {activeTab === 'upload' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
          <form onSubmit={handleUploadSubmit} className="space-y-5">
            
            {/* Title & Course Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Lecture Title</label>
                <input
                  type="text"
                  placeholder="e.g. B-Trees & Clustered Indexing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Course Name / Code</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="CS201">Database Management Systems (CS201)</option>
                  <option value="DS204">Data Science & ML (DS204)</option>
                  <option value="CS305">Design & Analysis of Algorithms (CS305)</option>
                </select>
              </div>
            </div>

            {/* Drag & Drop File Zone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Video File Input (MP4, MKV, AVI)</label>
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20 rounded-3xl p-8 text-center cursor-pointer transition group">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="hidden"
                  id="lectureVideoFileInput"
                />
                <label htmlFor="lectureVideoFileInput" className="cursor-pointer space-y-2 block">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold mx-auto group-hover:scale-110 transition shadow-inner">
                    📹
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {selectedFile ? selectedFile.name : 'Click to select video file from device'}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                      Supports MP4, MKV, AVI formats
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Description / Key Topics */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Lecture Summary / Overview</label>
              <textarea
                rows="3"
                placeholder="Briefly describe key concepts covered in this lecture..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* AI Auto-Processing Options */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">AI Extraction Pipelines:</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateNotes}
                    onChange={(e) => setGenerateNotes(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span>Auto-Generate AI Notes</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateQuiz}
                    onChange={(e) => setGenerateQuiz(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span>Create Practice Quiz</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateTranscript}
                    onChange={(e) => setGenerateTranscript(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span>Speech-to-Text Transcript</span>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Uploading to API...' : '🚀 Upload Video & Start Processing'}
            </button>

          </form>
        </div>
      )}

      {/* MODE 2: LIVE CAMERA RECORDING */}
      {activeTab === 'record' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
          <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden relative flex items-center justify-center text-white border border-slate-800 shadow-inner">
            
            {isRecording ? (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-600/20 text-rose-500 border-2 border-rose-500 flex items-center justify-center font-bold text-2xl mx-auto animate-pulse">
                  🎙️
                </div>
                <p className="text-sm font-extrabold tracking-wider">LIVE RECORDING IN PROGRESS...</p>
                <div className="px-4 py-1.5 bg-rose-600 text-white font-mono text-xs font-bold rounded-full inline-block shadow-md">
                  ⏱️ {formatTime(recordingTime)}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="text-4xl">📷</div>
                <p className="text-xs font-bold text-slate-400">Click button below to enable camera and start live recording</p>
              </div>
            )}

          </div>

          <div className="flex justify-center gap-4 pt-2">
            {!isRecording ? (
              <button
                type="button"
                onClick={handleStartRecording}
                className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center gap-2"
              >
                🔴 Start Camera Recording
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopRecording}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center gap-2"
              >
                ⏹️ Stop & Send Recording
              </button>
            )}
          </div>
        </div>
      )}

      {/* UPLOAD PROCESSING MODAL */}
      {isProcessingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-sm p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold mx-auto animate-spin">
              ⚙️
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Streaming Video Data...</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Uploading payload to backend endpoint</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}