import React, { useState } from 'react';

const MOCK_FACULTY_COURSES = [
  {
    id: 1,
    code: 'CS201',
    title: 'Database Management Systems',
    studentsCount: 68,
    lecturesCount: 24,
    status: 'Active',
    semester: 'Spring 2026',
  },
  {
    id: 2,
    code: 'DS204',
    title: 'Data Science & Machine Learning',
    studentsCount: 72,
    lecturesCount: 30,
    status: 'Active',
    semester: 'Spring 2026',
  },
  {
    id: 3,
    code: 'CS305',
    title: 'Design & Analysis of Algorithms',
    studentsCount: 44,
    lecturesCount: 20,
    status: 'Archived',
    semester: 'Fall 2025',
  },
];

export default function MyCourses() {
  const [courses, setCourses] = useState(MOCK_FACULTY_COURSES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: '', title: '', semester: 'Spring 2026' });

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.title) return;

    const courseObj = {
      id: Date.now(),
      code: newCourse.code,
      title: newCourse.title,
      studentsCount: 0,
      lecturesCount: 0,
      status: 'Active',
      semester: newCourse.semester,
    };

    setCourses([courseObj, ...courses]);
    setIsAddModalOpen(false);
    setNewCourse({ code: '', title: '', semester: 'Spring 2026' });
    alert('New Course Created Successfully!');
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Courses</h2>
          <p className="text-xs text-slate-500">Manage curriculum, lectures, and students enrolled in your subjects</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
        >
          ➕ Create New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                  {course.code}
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${
                  course.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {course.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">{course.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{course.semester}</p>

              <div className="pt-2 grid grid-cols-2 gap-2 text-center text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-extrabold text-slate-800">{course.studentsCount}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Students</p>
                </div>
                <div>
                  <p className="font-extrabold text-slate-800">{course.lecturesCount}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Lectures</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => window.location.href = '/faculty/content-library'}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition"
              >
                Manage Content 📂
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-800">Add New Course</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g. CS201"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border rounded-2xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Operating Systems"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-2xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-2xl">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}