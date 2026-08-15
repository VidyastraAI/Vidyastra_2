import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../api/studentAPI';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await studentAPI.getCourses();
        // Supports responses returned directly as an array or wrapped under res.data.data / res.data
        const courseData = res.data?.data || res.data;
        if (Array.isArray(courseData)) {
          setCourses(courseData);
        }
      } catch (err) {
        console.error('Error fetching courses from backend:', err);
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const filteredCourses = courses.filter((c) => {
    const matchesTab = activeTab === 'All' ? true : c.status === activeTab;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Courses</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage and track your enrolled curriculum courses</p>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="🔍 Search courses or instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-xs"
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 overflow-x-auto">
          {['All', 'In Progress', 'Completed', 'Wishlist'].map((tab) => {
            const count = courses.filter((c) => tab === 'All' || c.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-bold text-slate-500">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-bold text-red-500">{error}</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="text-4xl">📚</div>
            <p className="text-sm font-bold text-slate-600">No courses found matching your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {filteredCourses.map((course) => (
              <div
                key={course.id || course._id}
                className="p-5 rounded-3xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-indigo-100 transition shadow-xs hover:shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl bg-white p-2.5 rounded-2xl border border-slate-100 shadow-xs">
                      {course.thumbnail || '📖'}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${
                      course.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      course.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {course.status || 'In Progress'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{course.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">Instructor: {course.instructor}</p>
                  </div>

                  {/* Progress Bar */}
                  {course.status !== 'Wishlist' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-500">{course.completedLessons || 0}/{course.lessonsCount || 0} Modules Completed</span>
                        <span className="text-indigo-600">{course.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${course.progress || 0}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigateTo('/student/lecture-library')}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-sm transition active:scale-95"
                  >
                    {course.status === 'Completed' ? 'Review Content 📖' : 'Continue Learning ▶'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}