import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../api/studentAPI';

// Relative path fallback for local public video
const PUBLIC_LECTURE_VIDEO = encodeURI('/dbms_lecture.mp4');

export default function LectureLibrary() {
  const [lectures, setLectures] = useState([]);
  const [activeTab, setActiveTab] = useState('All Lectures');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [playingLecture, setPlayingLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Lectures from Backend API using studentApi
  const fetchLectures = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentAPI.getLectures();
      if (response.data && Array.isArray(response.data)) {
        setLectures(
          response.data.map((item) => ({
            id: item._id || item.id,
            title: item.title,
            course: item.course || 'Database Management Systems',
            duration: item.duration || '45 Mins',
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '2026-03-01',
            instructor: item.instructor || 'Dr. Sharma',
            videoUrl: item.videoUrl || PUBLIC_LECTURE_VIDEO,
            isBookmarked: item.isBookmarked || false,
          }))
        );
      } else {
        setLectures([]);
      }
    } catch (err) {
      console.error('Error fetching lectures:', err);
      setError('Failed to load lectures library from server.');
      setLectures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  // Toggle Bookmark State via API
  const toggleBookmark = async (id, e) => {
    e.stopPropagation();
    try {
      await studentAPI .toggleBookmark(id);
      setLectures((prev) =>
        prev.map((lec) => (lec.id === id ? { ...lec, isBookmarked: !lec.isBookmarked } : lec))
      );
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      alert('Failed to update bookmark status.');
    }
  };

  // Play Lecture Video
  const handleWatchLecture = (lec) => {
    setPlayingLecture(lec);
  };

  // Filter Lectures
  const filteredLectures = lectures.filter((lec) => {
    const matchesTab = activeTab === 'Bookmarked' ? lec.isBookmarked : true;
    const matchesCourse = selectedCourse === 'All' ? true : lec.course === selectedCourse;
    const matchesSearch = lec.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCourse && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn relative">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Lecture Library</h2>
          <p className="text-xs text-slate-500 mt-0.5">Browse and rewatch recorded class lectures</p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="🔍 Search lecture title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-xs"
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            {['All Lectures', 'Bookmarked'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                  activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Course Filter Dropdown */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="All">All Courses</option>
            <option value="Database Management Systems">DBMS</option>
            <option value="Data Science">Data Science</option>
            <option value="Design & Analysis of Algorithms">DAA</option>
          </select>
        </div>

        {/* Lectures Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-bold text-xs">
            Loading lectures library...
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500 font-bold text-xs">
            {error}
          </div>
        ) : filteredLectures.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="text-4xl">🎥</div>
            <p className="text-sm font-bold text-slate-600">No lectures found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredLectures.map((lec) => (
              <div
                key={lec.id}
                className="bg-slate-50/50 border border-slate-100 rounded-3xl p-4 space-y-3 hover:bg-white hover:border-indigo-100 transition shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center text-white">
                    <span className="text-3xl animate-pulse">▶</span>
                    <button
                      onClick={(e) => toggleBookmark(lec.id, e)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 text-xs font-bold text-slate-800 hover:bg-white transition"
                    >
                      {lec.isBookmarked ? '⭐' : '☆'}
                    </button>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                    {lec.course}
                  </span>

                  <h3 className="text-xs font-bold text-slate-800 leading-snug">{lec.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{lec.instructor} • {lec.duration}</p>
                </div>

                <button
                  onClick={() => handleWatchLecture(lec)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  ▶ Watch Recorded Video
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Local Video Player Modal Popup */}
      {playingLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-3xl p-6 space-y-4 animate-fadeIn">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">{playingLecture.title}</h3>
                <p className="text-[11px] text-indigo-600 font-bold">{playingLecture.course} • {playingLecture.instructor}</p>
              </div>
              <button
                onClick={() => setPlayingLecture(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            {/* Native HTML5 Video Player */}
            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
              <video
                controls
                autoPlay
                controlsList="nodownload"
                className="w-full h-full object-contain"
                src={playingLecture.videoUrl}
              >
                Your browser does not support playing local video files.
              </video>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setPlayingLecture(null)}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition"
              >
                Close Video Player
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}