import React, { useState } from 'react';

// Mock Hardcoded Admin Courses Data
const MOCK_COURSES = [
  {
    id: 1,
    name: 'Database Management Systems (DBMS)',
    category: 'Computer Science',
    students: 68,
    status: 'Published',
    description: 'Relational database concepts, SQL queries, B-Trees indexing, and transaction normalization rules.',
  },
  {
    id: 2,
    name: 'Data Science & Machine Learning',
    category: 'Data Science',
    students: 72,
    status: 'Published',
    description: 'Exploratory data analysis, Python Pandas, Seaborn pairplots, and supervised regression models.',
  },
  {
    id: 3,
    name: 'Design and Analysis of Algorithms (DAA)',
    category: 'Computer Science',
    students: 44,
    status: 'Pending Approval',
    description: 'Asymptotic notation, divide and conquer strategies, dynamic programming, and greedy algorithms.',
  },
  {
    id: 4,
    name: 'Operating Systems & Process Management',
    category: 'Computer Science',
    students: 55,
    status: 'Published',
    description: 'Process scheduling, CPU synchronization, deadlocks prevention, and virtual memory paging.',
  },
  {
    id: 5,
    name: 'Artificial Intelligence & Neural Networks',
    category: 'Artificial Intelligence',
    students: 0,
    status: 'Archived',
    description: 'Introductory deep learning concepts, perceptrons, backpropagation, and searching heuristics.',
  },
];

export default function CourseManagement() {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [activeTab, setActiveTab] = useState('All Courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [previewCourse, setPreviewCourse] = useState(null);

  // Form State for Add New Course
  const [newCourse, setNewCourse] = useState({
    name: '',
    category: 'Computer Science',
    students: 0,
    status: 'Published',
    description: '',
  });

  // Handle Add New Course
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.name) return;

    const createdObj = {
      id: Date.now(),
      name: newCourse.name,
      category: newCourse.category,
      students: Number(newCourse.students) || 0,
      status: newCourse.status,
      description: newCourse.description || 'Comprehensive curriculum created by academic faculty.',
    };

    setCourses([createdObj, ...courses]);
    setIsAddModalOpen(false);
    setNewCourse({ name: '', category: 'Computer Science', students: 0, status: 'Published', description: '' });
    alert('New course added to catalog successfully!');
  };

  // Handle Edit Course
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setCourses((prev) =>
      prev.map((c) => (c.id === editingCourse.id ? editingCourse : c))
    );
    setEditingCourse(null);
    alert('Course details updated successfully!');
  };

  // Handle Delete Course
  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to remove this course from the portal?')) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      alert('Course deleted successfully!');
    }
  };

  // Filter Logic
  const filteredCourses = courses.filter((course) => {
    // 1. Tab Filter
    let tabMatch = true;
    if (activeTab === 'Pending Approval') tabMatch = course.status === 'Pending Approval';
    if (activeTab === 'Published') tabMatch = course.status === 'Published';
    if (activeTab === 'Archived') tabMatch = course.status === 'Archived';

    // 2. Category Filter
    let categoryMatch = categoryFilter === 'All Categories' ? true : course.category === categoryFilter;

    // 3. Search Query Match
    let searchMatch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    return tabMatch && categoryMatch && searchMatch;
  });

  return (
    <div className="space-y-6 animate-fadeIn relative max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Courses</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage global academic course catalog, approval pipeline, and enrollment</p>
        </div>
      </div>

      {/* Main Container Card Matching Screenshot */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
        
        {/* Navigation Tabs & Action Button Row Matching Screenshot */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          
          <div className="flex items-center gap-2 overflow-x-auto">
            {['All Courses', 'Pending Approval', 'Published', 'Archived'].map((tab) => {
              const count = courses.filter((c) => {
                if (tab === 'All Courses') return true;
                if (tab === 'Pending Approval') return c.status === 'Pending Approval';
                if (tab === 'Published') return c.status === 'Published';
                if (tab === 'Archived') return c.status === 'Archived';
                return true;
              }).length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab}</span>
                  {count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
          >
            + Add Course
          </button>

        </div>

        {/* Search Bar & Category Dropdown Filter Row Matching Screenshot */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="🔍 Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="w-full sm:w-auto flex justify-end">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="All Categories">All Categories</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Data Science">Data Science</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
            </select>
          </div>

        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto min-h-[220px]">
          {filteredCourses.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-bold text-xs space-y-2">
              <div className="text-3xl">📚</div>
              <p>No courses found matching criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">CATEGORY</th>
                  <th className="py-3 px-4">STUDENTS</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-bold text-slate-900 max-w-[250px] truncate">{course.name}</td>
                    <td className="py-4 px-4 font-bold text-indigo-600">{course.category}</td>
                    <td className="py-4 px-4 font-bold text-slate-800">{course.students} Students</td>
                    <td className="py-4 px-4 font-bold">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${
                        course.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : course.status === 'Pending Approval'
                          ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit */}
                        <button
                          onClick={() => setEditingCourse(course)}
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs transition"
                          title="Edit Course"
                        >
                          ✏️
                        </button>

                        {/* Preview */}
                        <button
                          onClick={() => setPreviewCourse(course)}
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs transition"
                          title="Preview Course Details"
                        >
                          👁️
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-400 hover:text-rose-600 flex items-center justify-center font-bold text-xs transition"
                          title="Delete Course"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination & Counter Footer Bar Matching Screenshot */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <span>
            Showing 1 to {filteredCourses.length} of 256 courses
          </span>

          {/* Pagination Numbers Matching Screenshot */}
          <div className="flex items-center gap-1 font-bold">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-7 h-7 rounded-xl text-xs flex items-center justify-center transition ${
                  currentPage === num
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {num}
              </button>
            ))}
            <span className="px-1 text-slate-400">...</span>
            <button
              onClick={() => setCurrentPage(43)}
              className={`w-7 h-7 rounded-xl text-xs flex items-center justify-center transition ${
                currentPage === 43
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              43
            </button>
          </div>
        </div>

      </div>

      {/* MODAL 1: ADD NEW COURSE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Add New Course</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Course Name</label>
                <input
                  type="text"
                  placeholder="e.g. Design & Analysis of Algorithms"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">Category</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600">Status</label>
                  <select
                    value={newCourse.status}
                    onChange={(e) => setNewCourse({ ...newCourse, status: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Published">Published</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Course Description</label>
                <textarea
                  rows="3"
                  placeholder="Enter syllabus summary..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
                >
                  Create Course
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: EDIT COURSE */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Edit Course</h3>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Course Name</label>
                <input
                  type="text"
                  value={editingCourse.name}
                  onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Status</label>
                <select
                  value={editingCourse.status}
                  onChange={(e) => setEditingCourse({ ...editingCourse, status: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
                >
                  <option value="Published">Published</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 3: PREVIEW COURSE */}
      {previewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">{previewCourse.name}</h3>
                <p className="text-xs text-indigo-600 font-bold">{previewCourse.category} • {previewCourse.students} Students Enrolled</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCourse(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
              <p className="font-bold text-slate-900 mb-1">Course Overview:</p>
              {previewCourse.description}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewCourse(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}