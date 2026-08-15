import React, { useState, useEffect } from 'react';
import { authApi } from '../../api/authAPI';
import { studentAPI } from '../../api/studentAPI';

export default function StudentHome() {
  const [studentName, setStudentName] = useState('Student');
  const [stats, setStats] = useState({
    enrolledCoursesCount: 0,
    pendingQuizzesCount: 0,
    studyStreak: '0 Days',
    overallProgress: '0%'
  });
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [aiRecommendation, setAiRecommendation] = useState({
    topic: 'General Studies',
    description: 'Keep up with your course modules and quizzes to optimize your learning path.'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetching profile, courses, assignments, and dashboard info concurrently from studentAPI and authApi
        const [
          profileRes, 
          coursesRes, 
          assignmentsRes,
          dashboardRes
        ] = await Promise.allSettled([
          authApi.getProfile(),
          studentAPI.getCourses(),
          studentAPI.getAssignments(),
          studentAPI.getDashboard()
        ]);

        // 1. Handle Profile Name
        if (profileRes.status === 'fulfilled' && profileRes.value.data) {
          const userData = profileRes.value.data;
          if (userData.name) {
            setStudentName(userData.name);
          }
        }

        // 2. Handle Courses from studentAPI
        let fetchedCourses = [];
        if (coursesRes.status === 'fulfilled' && coursesRes.value.data) {
          const courseData = coursesRes.value.data;
          fetchedCourses = Array.isArray(courseData) ? courseData : (courseData.courses || []);
          setCourses(fetchedCourses);
        }

        // 3. Handle Assignments from studentAPI
        let fetchedAssignments = [];
        if (assignmentsRes.status === 'fulfilled' && assignmentsRes.value.data) {
          const assignmentData = assignmentsRes.value.data;
          const allAssignments = Array.isArray(assignmentData) ? assignmentData : (assignmentData.assignments || []);
          
          // Filter pending assignments for the student or use all
          fetchedAssignments = allAssignments.filter(a => {
            const submissions = a.submissions || [];
            // Check if current user has a pending or missing submission, or check global status
            return !a.status || a.status.toLowerCase() === 'pending';
          });
          setAssignments(fetchedAssignments);
        }

        // 4. Handle Dashboard Stats & Fallbacks from studentAPI dashboard
        if (dashboardRes.status === 'fulfilled' && dashboardRes.value.data) {
          const dashData = dashboardRes.value.data;
          
          if (dashData.aiRecommendation) {
            setAiRecommendation(dashData.aiRecommendation);
          }

          const courseCount = fetchedCourses.length > 0 ? fetchedCourses.length : (dashData.stats?.enrolledCoursesCount || 0);
          const pendingCount = fetchedAssignments.length > 0 ? fetchedAssignments.length : (dashData.stats?.pendingQuizzesCount || 0);

          let calculatedProgress = dashData.stats?.overallProgress || '0%';
          if (fetchedCourses.length > 0) {
            const totalProg = fetchedCourses.reduce((acc, c) => acc + (c.progress || 0), 0);
            calculatedProgress = `${Math.round(totalProg / fetchedCourses.length)}%`;
          }

          setStats({
            enrolledCoursesCount: courseCount,
            pendingQuizzesCount: pendingCount,
            studyStreak: dashData.stats?.studyStreak || '12 Days',
            overallProgress: calculatedProgress
          });
        } else {
          let calculatedProgress = '0%';
          if (fetchedCourses.length > 0) {
            const totalProg = fetchedCourses.reduce((acc, c) => acc + (c.progress || 0), 0);
            calculatedProgress = `${Math.round(totalProg / fetchedCourses.length)}%`;
          }
          setStats({
            enrolledCoursesCount: fetchedCourses.length,
            pendingQuizzesCount: fetchedAssignments.length,
            studyStreak: '12 Days',
            overallProgress: calculatedProgress
          });
        }

      } catch (err) {
        console.error('Error fetching dashboard backend data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 rounded-3xl text-white shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">Hello, {studentName}! 👋</h2>
          <p className="text-xs text-indigo-100 mt-1 font-medium">Ready to continue your learning journey today?</p>
        </div>
        <button
          onClick={() => navigateTo('/student/ai-tutor')}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-600 font-bold text-xs rounded-2xl shadow-md hover:bg-indigo-50 transition active:scale-95"
        >
          🤖 Ask AI Tutor
        </button>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => navigateTo('/student/courses')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md hover:shadow-lg transition cursor-pointer space-y-1"
        >
          <p className="text-[11px] font-extrabold uppercase text-slate-400">Enrolled Courses</p>
          <h3 className="text-2xl font-extrabold text-slate-800">
            {loading ? '...' : stats.enrolledCoursesCount}
          </h3>
          <p className="text-[11px] font-bold text-indigo-600">View Courses →</p>
        </div>

        <div
          onClick={() => navigateTo('/student/ai-quiz')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md hover:shadow-lg transition cursor-pointer space-y-1"
        >
          <p className="text-[11px] font-extrabold uppercase text-slate-400">Pending Quizzes</p>
          <h3 className="text-2xl font-extrabold text-amber-600">
            {loading ? '...' : stats.pendingQuizzesCount}
          </h3>
          <p className="text-[11px] font-bold text-amber-600">Attempt Now →</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md space-y-1">
          <p className="text-[11px] font-extrabold uppercase text-slate-400">Study Streak</p>
          <h3 className="text-2xl font-extrabold text-emerald-600">
            {loading ? '...' : stats.studyStreak} 🔥
          </h3>
          <p className="text-[11px] font-medium text-slate-400">Keep it up!</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md space-y-1">
          <p className="text-[11px] font-extrabold uppercase text-slate-400">Overall Progress</p>
          <h3 className="text-2xl font-extrabold text-indigo-600">
            {loading ? '...' : stats.overallProgress}
          </h3>
          <p className="text-[11px] font-medium text-slate-400">Semester Average</p>
        </div>
      </div>

      {/* Main Grid: Courses & AI Rec */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Courses & Recent Assignments (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Courses Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Your Active Courses</h3>
              <button
                onClick={() => navigateTo('/student/courses')}
                className="text-indigo-600 font-bold text-xs hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {loading ? (
                <p className="text-xs text-slate-400 text-center py-4">Loading courses...</p>
              ) : courses.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No active courses found.</p>
              ) : (
                courses.map((course) => (
                  <div key={course.id || course._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{course.title} {course.code ? `(${course.code})` : ''}</h4>
                        <p className="text-[11px] text-slate-500">{course.instructor?.name || course.instructor || 'Instructor'} {course.nextLecture ? `• Up next: ${course.nextLecture}` : ''}</p>
                      </div>
                      <span className="text-xs font-extrabold text-indigo-600">{course.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${course.progress || 0}%` }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Assignments Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Pending Assignments</h3>
              <button
                onClick={() => navigateTo('/student/assignments')}
                className="text-indigo-600 font-bold text-xs hover:underline"
              >
                Go to Assignments →
              </button>
            </div>

            <div className="space-y-2">
              {loading ? (
                <p className="text-xs text-slate-400 text-center py-4">Loading assignments...</p>
              ) : assignments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No pending assignments. Great job!</p>
              ) : (
                assignments.map((item) => (
                  <div key={item.id || item._id} className="flex justify-between items-center p-3 bg-amber-50/50 border border-amber-100 rounded-2xl">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">{item.courseId?.title || item.course || 'General'} • Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Upcoming'}</p>
                    </div>
                    <button
                      onClick={() => navigateTo('/student/assignments')}
                      className="px-3 py-1.5 bg-amber-600 text-white text-[11px] font-bold rounded-xl hover:bg-amber-700 transition"
                    >
                      Submit 📤
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* AI Recommendation Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-indigo-500/30 text-indigo-300 rounded-lg">
              ✨ AI Recommendation
            </span>
            <h4 className="text-sm font-bold leading-relaxed">
              Based on your progress, we recommend focusing on <span className="text-indigo-400">"{aiRecommendation.topic}"</span>.
            </h4>
            <p className="text-xs text-slate-400 font-medium">{aiRecommendation.description}</p>
            <button
              onClick={() => navigateTo('/student/ai-quiz')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95"
            >
              Start Practice Quiz 🎯
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}