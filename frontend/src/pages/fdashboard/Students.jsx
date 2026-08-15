import React, { useState } from 'react';

// Mock Hardcoded Students Data from screenshot
const MOCK_STUDENTS = [
  { id: 1, name: 'Ram Prasad', email: 'ram.prasad@student.com', course: 'DSA', attendance: '92%', progress: '75%', lastActive: 'Today', phone: '+91 9876543210' },
  { id: 2, name: 'Priya Singh', email: 'priya.singh@student.com', course: 'DSA', attendance: '88%', progress: '60%', lastActive: 'Yesterday', phone: '+91 9876543211' },
  { id: 3, name: 'Sohan Das', email: 'sohan.das@student.com', course: 'DSA', attendance: '76%', progress: '45%', lastActive: 'Today', phone: '+91 9876543212' },
  { id: 4, name: 'Neha Verma', email: 'neha.verma@student.com', course: 'DBMS', attendance: '91%', progress: '70%', lastActive: 'Today', phone: '+91 9876543213' },
  { id: 5, name: 'Ketan Patel', email: 'ketan.patel@student.com', course: 'DBMS', attendance: '82%', progress: '55%', lastActive: 'Yesterday', phone: '+91 9876543214' },
  { id: 6, name: 'Vikash Kushwah', email: 'vikash@student.com', course: 'DSA', attendance: '95%', progress: '90%', lastActive: 'Today', phone: '+91 9876543215' },
  { id: 7, name: 'Mohit', email: 'mohit@student.com', course: 'DBMS', attendance: '89%', progress: '82%', lastActive: 'Today', phone: '+91 9876543216' },
];

export default function Students() {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null); // Detail Modal
  const [showAll, setShowAll] = useState(false);

  // Filter students based on search query
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedStudents = showAll ? filteredStudents : filteredStudents.slice(0, 5);

  // Export CSV Handler
  const handleExportCSV = () => {
    alert('Student analytics report exported successfully as CSV!');
  };

  return (
    <div className="space-y-6 animate-fadeIn relative max-w-6xl mx-auto">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Students</h2>
          <p className="text-xs text-slate-500 mt-0.5">Monitor attendance, progress, and activity of enrolled students</p>
        </div>

        {/* Search & Export Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-xs"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-2xl shadow-xs transition flex items-center gap-1.5 whitespace-nowrap active:scale-95"
          >
            📥 Export
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-sm">
            All Students ({filteredStudents.length})
          </h3>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    No students found matching your search.
                  </td>
                </tr>
              ) : (
                displayedStudents.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                  >
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-inner">
                        👤
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{student.name}</p>
                        <p className="text-[11px] text-slate-400 font-normal">{student.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-indigo-600">{student.course}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{student.attendance}</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600">{student.progress}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-bold">{student.lastActive}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View All Toggle Link */}
        {filteredStudents.length > 5 && (
          <div className="pt-3 text-center border-t border-slate-100">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition"
            >
              {showAll ? 'Show Less ' : 'View All Students →'}
            </button>
          </div>
        )}

      </div>

      {/* STUDENT DETAIL MODAL POPUP */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-5 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shadow-inner">
                  👤
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">{selectedStudent.name}</h3>
                  <p className="text-xs text-indigo-600 font-bold">{selectedStudent.course} Enrolled</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-medium text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-400 font-bold">Email Address</span>
                <strong className="text-slate-900">{selectedStudent.email}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-400 font-bold">Phone Contact</span>
                <strong className="text-slate-900">{selectedStudent.phone}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-400 font-bold">Overall Attendance</span>
                <strong className="text-slate-900">{selectedStudent.attendance}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-400 font-bold">Course Completion Progress</span>
                <strong className="text-emerald-600">{selectedStudent.progress}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-bold">Last Portal Activity</span>
                <strong className="text-slate-900">{selectedStudent.lastActive}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => alert(`Sending message to ${selectedStudent.name}...`)}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
              >
                Send Direct Message 💬
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}