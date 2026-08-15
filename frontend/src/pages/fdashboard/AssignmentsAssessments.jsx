import React, { useState } from 'react';

// Mock Hardcoded Assignments Data
const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    title: 'DBMS Indexing & B-Trees Assignment',
    course: 'Database Management Systems',
    dueDate: '10 Aug 2026',
    totalMarks: 20,
    submissionsCount: 42,
    totalStudents: 68,
    status: 'Active',
    description: 'Solve B-Tree and B+ Tree insertion/deletion problems and write SQL queries for clustered indexes.',
    submittedStudents: [
      { id: 101, name: 'Vikash Kushwah', studentId: 'STU2024001', file: 'vikash_dbms_indexing.pdf', marks: 18, feedback: 'Great query optimization!' },
      { id: 102, name: 'Mohit', studentId: 'STU2024002', file: 'mohit_b_trees.pdf', marks: null, feedback: '' },
      { id: 103, name: 'Dhruv Tyagi', studentId: 'STU2024003', file: 'dhruv_sql_lab.pdf', marks: null, feedback: '' },
    ]
  },
  {
    id: 2,
    title: 'Data Preprocessing EDA Notebook',
    course: 'Data Science',
    dueDate: '08 Aug 2026',
    totalMarks: 25,
    submissionsCount: 50,
    totalStudents: 72,
    status: 'Active',
    description: 'Clean the provided Iris dataset, handle missing values, and generate Seaborn pairplots.',
    submittedStudents: [
      { id: 201, name: 'Mohit', studentId: 'STU2024002', file: 'mohit_eda_iris.ipynb', marks: 23, feedback: 'Excellent pairplot analysis.' },
    ]
  },
];

export default function AssignmentsAssessments() {
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Post Assignment Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    course: 'Database Management Systems',
    dueDate: '',
    totalMarks: '20',
    description: '',
  });

  // Grade Submissions Modal State
  const [gradingAssignment, setGradingAssignment] = useState(null);
  const [activeStudentToGrade, setActiveStudentToGrade] = useState(null);
  const [gradeMarks, setGradeMarks] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Handle Create New Assignment
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return;

    const newAssignment = {
      id: Date.now(),
      title: formData.title,
      course: formData.course,
      dueDate: formData.dueDate,
      totalMarks: Number(formData.totalMarks) || 20,
      submissionsCount: 0,
      totalStudents: 68,
      status: 'Active',
      description: formData.description || 'Complete the assignment tasks and submit before due date.',
      submittedStudents: []
    };

    setAssignments([newAssignment, ...assignments]);
    setIsPostModalOpen(false);
    setFormData({ title: '', course: 'Database Management Systems', dueDate: '', totalMarks: '20', description: '' });
    alert('New Assignment Published Successfully!');
  };

  // Open Grading View
  const handleOpenGradingModal = (assignment) => {
    setGradingAssignment(assignment);
    if (assignment.submittedStudents.length > 0) {
      const firstStudent = assignment.submittedStudents[0];
      setActiveStudentToGrade(firstStudent);
      setGradeMarks(firstStudent.marks !== null ? firstStudent.marks : '');
      setGradeFeedback(firstStudent.feedback || '');
    } else {
      setActiveStudentToGrade(null);
    }
  };

  // Save Student Grade
  const handleSaveStudentGrade = (e) => {
    e.preventDefault();
    if (!activeStudentToGrade) return;

    const updatedSubmissions = gradingAssignment.submittedStudents.map((st) =>
      st.id === activeStudentToGrade.id
        ? { ...st, marks: Number(gradeMarks), feedback: gradeFeedback }
        : st
    );

    const updatedAssignment = { ...gradingAssignment, submittedStudents: updatedSubmissions };

    setGradingAssignment(updatedAssignment);
    setAssignments((prev) =>
      prev.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a))
    );

    alert(`Marks updated for ${activeStudentToGrade.name}!`);
  };

  // Delete Assignment
  const handleDeleteAssignment = (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredAssignments = assignments.filter((a) => {
    if (activeFilter === 'Active') return a.status === 'Active';
    if (activeFilter === 'Closed') return a.status === 'Closed';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn relative max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Assignments & Assessments</h2>
          <p className="text-xs text-slate-500 mt-0.5">Create assignments, review submissions, and submit student grades</p>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center gap-1.5"
        >
          + Post New Assignment
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          {['All', 'Active', 'Closed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {filter} Assignments
            </button>
          ))}
        </div>

        {/* Assignments Cards List */}
        {filteredAssignments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-bold">
            No assignments found for this category.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-indigo-100 transition shadow-xs hover:shadow-md space-y-4"
              >
                {/* Header Row */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                      {item.course}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 mt-1">{item.title}</h3>
                  </div>

                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                    Due: {item.dueDate}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {item.description}
                </p>

                {/* Footer Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs font-bold">
                  <div className="text-slate-600">
                    <span>Submissions: </span>
                    <strong className="text-slate-900">{item.submissionsCount} / {item.totalStudents} Students</strong>
                    <span className="text-slate-400 font-medium ml-3">• Total Marks: {item.totalMarks}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteAssignment(item.id)}
                      className="px-3 py-1.5 text-slate-400 hover:text-rose-600 font-bold transition text-xs"
                      title="Delete assignment"
                    >
                      Delete 🗑️
                    </button>

                    <button
                      onClick={() => handleOpenGradingModal(item)}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center gap-1.5"
                    >
                      Grade Submissions 📝
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL 1: POST NEW ASSIGNMENT */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Post New Assignment</h3>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. B-Trees & SQL Indexing Problem Set"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Course</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Database Management Systems">Database Management Systems</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design & Analysis of Algorithms">Design & Analysis of Algorithms</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600">Total Marks</label>
                  <input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Task Instructions & Description</label>
                <textarea
                  rows="3"
                  placeholder="Provide guidance on what students should upload..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
                >
                  Publish Assignment
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: EVALUATE & GRADE SUBMISSIONS */}
      {gradingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-2xl p-6 space-y-5 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Grade Student Submissions</h3>
                <p className="text-xs text-indigo-600 font-bold">{gradingAssignment.title} (Max Marks: {gradingAssignment.totalMarks})</p>
              </div>
              <button
                type="button"
                onClick={() => setGradingAssignment(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            {gradingAssignment.submittedStudents.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-bold">
                No submissions received for this assignment yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Student Submission Selector List (5 Cols) */}
                <div className="md:col-span-5 border-r border-slate-100 pr-0 md:pr-3 space-y-2">
                  <h4 className="text-[11px] font-extrabold uppercase text-slate-400">Select Student Submission:</h4>
                  {gradingAssignment.submittedStudents.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => {
                        setActiveStudentToGrade(st);
                        setGradeMarks(st.marks !== null ? st.marks : '');
                        setGradeFeedback(st.feedback || '');
                      }}
                      className={`p-3 rounded-2xl border transition cursor-pointer space-y-1 ${
                        activeStudentToGrade?.id === st.id
                          ? 'bg-indigo-50 border-indigo-200'
                          : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-800">{st.name}</span>
                        {st.marks !== null ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
                            {st.marks}/{gradingAssignment.totalMarks}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">{st.studentId}</p>
                    </div>
                  ))}
                </div>

                {/* Evaluation Form (7 Cols) */}
                <div className="md:col-span-7 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                  {activeStudentToGrade && (
                    <>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800">{activeStudentToGrade.name}</h4>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-indigo-600 flex items-center justify-between">
                          <span className="truncate">📄 {activeStudentToGrade.file}</span>
                          <button
                            onClick={() => alert(`Downloading ${activeStudentToGrade.file}...`)}
                            className="text-[11px] text-slate-500 hover:text-slate-800 underline"
                          >
                            Download
                          </button>
                        </div>
                      </div>

                      <form onSubmit={handleSaveStudentGrade} className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-slate-600">Marks Obtained (Out of {gradingAssignment.totalMarks})</label>
                          <input
                            type="number"
                            max={gradingAssignment.totalMarks}
                            value={gradeMarks}
                            onChange={(e) => setGradeMarks(e.target.value)}
                            placeholder={`0 - ${gradingAssignment.totalMarks}`}
                            required
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-600">Teacher Feedback / Remarks</label>
                          <textarea
                            rows="3"
                            value={gradeFeedback}
                            onChange={(e) => setGradeFeedback(e.target.value)}
                            placeholder="Add evaluation remarks..."
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95"
                        >
                          Save Marks & Feedback 💾
                        </button>
                      </form>
                    </>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}