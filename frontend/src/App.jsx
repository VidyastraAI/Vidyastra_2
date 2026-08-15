import React, { useState, useEffect } from 'react';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// // Admin Dashboard Pages (9)
// import AdminHome from './pages/adashboard/AdminHome';
// import UserManagement from './pages/adashboard/UserManagement';
// import CourseManagement from './pages/adashboard/CourseManagement';
// import ContentModeration from './pages/adashboard/ContentModeration';
// import AIManagement from './pages/adashboard/AIManagement';
// import AnalyticsReports from './pages/adashboard/AnalyticsReports';
// import SystemLogs from './pages/adashboard/SystemManagement';
// import NotificationsManagement from './pages/adashboard/NotificationsManagement';
// import AdminSettings from './pages/adashboard/Settings';

// // Faculty Dashboard Pages (12)
// import FacultyHome from './pages/fdashboard/FacultyHome';
// import FacultyCourses from './pages/fdashboard/MyCourses';
// import LiveClass from './pages/fdashboard/LiveClass';
// import RecordUploadLecture from './pages/fdashboard/RecordUploadLecture';
// import LectureProcessingCenter from './pages/fdashboard/LectureProcessingCenter';
// import ContentLibrary from './pages/fdashboard/ContentLibrary';
// import Students from './pages/fdashboard/Students';
// import AssignmentsAssessments from './pages/fdashboard/AssignmentsAssessments';
// import FacultyAnalytics from './pages/fdashboard/Analytics';
// import AIAssistant from './pages/fdashboard/AIAssistant';
// import MessagesAnnouncements from './pages/fdashboard/MessagesAnnouncements';
// import FacultyProfileSettings from './pages/fdashboard/ProfileSettings';

// Student Dashboard Pages (10)
import StudentHome from './pages/sdashboard/StudentHome';
import StudentCourses from './pages/sdashboard/MyCourses';
import LectureLibrary from './pages/sdashboard/LectureLibrary';
import AINotes from './pages/sdashboard/AINotes';
import AIQuiz from './pages/sdashboard/AIQuiz';
import Assignments from './pages/sdashboard/Assignments';
import AITutor from './pages/sdashboard/AITutor';
import ProgressAnalytics from './pages/sdashboard/ProgressAnalytics';
import Notifications from './pages/sdashboard/Notifications';
import StudentProfileSettings from './pages/sdashboard/ProfileSettings';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    const path = window.location.pathname;
    return path === '/' ? '/login' : path;
  });

  // Keep browser URL synchronized with state if using standard routing simulation
  useEffect(() => {
    if (window.location.pathname !== currentPath) {
      window.history.pushState({}, '', currentPath);
    }
  }, [currentPath]);

  // Navigation Helper
  const navigate = (path) => setCurrentPath(path);

  // Router Switcher Logic
  const renderPage = () => {
    // --- Auth Routes ---
    if (currentPath === '/login' || currentPath === '/') {
      return (
        <Login
          onLogin={(role) => {
            if (role === 'admin') navigate('/admin/home');
            else if (role === 'faculty') navigate('/faculty/home');
            else navigate('/student/home');
          }}
          onSwitchToRegister={() => navigate('/register')}
        />
      );
    }
    if (currentPath === '/register') {
      return <Register onSwitchToLogin={() => navigate('/login')} />;
    }

    // // --- Admin Routes (/admin/...) ---
    // if (currentPath.startsWith('/admin')) {
    //   return (
    //     <DashboardLayout role="admin" currentPath={currentPath} navigate={navigate}>
    //       {currentPath === '/admin/home' && <AdminHome />}
    //       {currentPath === '/admin/users' && <UserManagement />}
    //       {currentPath === '/admin/courses' && <CourseManagement />}
    //       {currentPath === '/admin/moderation' && <ContentModeration />}
    //       {currentPath === '/admin/ai-management' && <AIManagement />}
    //       {currentPath === '/admin/analytics' && <AnalyticsReports />}
    //       {currentPath === '/admin/logs' && <SystemLogs />}
    //       {currentPath === '/admin/notifications' && <NotificationsManagement />}
    //       {currentPath === '/admin/settings' && <AdminSettings />}
    //     </DashboardLayout>
    //   );
    // }

    // // --- Faculty Routes (/faculty/...) ---
    // if (currentPath.startsWith('/faculty')) {
    //   return (
    //     <DashboardLayout role="faculty" currentPath={currentPath} navigate={navigate}>
    //       {currentPath === '/faculty/home' && <FacultyHome />}
    //       {currentPath === '/faculty/courses' && <FacultyCourses />}
    //       {currentPath === '/faculty/live-class' && <LiveClass />}
    //       {currentPath === '/faculty/record-upload' && <RecordUploadLecture />}
    //       {currentPath === '/faculty/processing-center' && <LectureProcessingCenter />}
    //       {currentPath === '/faculty/content-library' && <ContentLibrary />}
    //       {currentPath === '/faculty/students' && <Students />}
    //       {currentPath === '/faculty/assignments' && <AssignmentsAssessments />}
    //       {currentPath === '/faculty/analytics' && <FacultyAnalytics />}
    //       {currentPath === '/faculty/ai-assistant' && <AIAssistant />}
    //       {currentPath === '/faculty/messages' && <MessagesAnnouncements />}
    //       {currentPath === '/faculty/settings' && <FacultyProfileSettings />}
    //     </DashboardLayout>
    //   );
    // }

    // --- Student Routes (/student/...) ---
    if (currentPath.startsWith('/student')) {
      return (
        <DashboardLayout role="student" currentPath={currentPath} navigate={navigate}>
          {currentPath === '/student/home' && <StudentHome />}
          {currentPath === '/student/courses' && <StudentCourses />}
          {currentPath === '/student/lecture-library' && <LectureLibrary />}
          {currentPath === '/student/ai-notes' && <AINotes />}
          {currentPath === '/student/ai-quiz' && <AIQuiz />}
          {currentPath === '/student/assignments' && <Assignments />}
          {currentPath === '/student/ai-tutor' && <AITutor />}
          {currentPath === '/student/progress' && <ProgressAnalytics />}
          {currentPath === '/student/notifications' && <Notifications />}
          {currentPath === '/student/settings' && <StudentProfileSettings />}
        </DashboardLayout>
      );
    }

    // Fallback
    return <div className="p-12 text-center">404 - Page Not Found</div>;
  };

  return <div className="min-h-screen bg-slate-50 font-sans">{renderPage()}</div>;
}

// Reusable Layout Wrapper with Dynamic Sidebar Routing Links
function DashboardLayout({ role, currentPath, navigate, children }) {
  const adminLinks = [
    { label: 'Overview', path: '/admin/home' },
    { label: 'User Management', path: '/admin/users' },
    { label: 'Course Management', path: '/admin/courses' },
    { label: 'Content Moderation', path: '/admin/moderation' },
    { label: 'AI Management', path: '/admin/ai-management' },
    { label: 'Analytics & Reports', path: '/admin/analytics' },
    { label: 'System Logs', path: '/admin/logs' },
    { label: 'Notifications', path: '/admin/notifications' },
    { label: 'Settings', path: '/admin/settings' },
  ];

  const facultyLinks = [
    { label: 'Dashboard Home', path: '/faculty/home' },
    { label: 'My Courses', path: '/faculty/courses' },
    { label: 'Live Class', path: '/faculty/live-class' },
    { label: 'Record / Upload', path: '/faculty/record-upload' },
    { label: 'Processing Center', path: '/faculty/processing-center' },
    { label: 'Content Library', path: '/faculty/content-library' },
    { label: 'Students', path: '/faculty/students' },
    { label: 'Assignments', path: '/faculty/assignments' },
    { label: 'Analytics', path: '/faculty/analytics' },
    { label: 'AI Assistant', path: '/faculty/ai-assistant' },
    { label: 'Messages', path: '/faculty/messages' },
    { label: 'Profile & Settings', path: '/faculty/settings' },
  ];

  const studentLinks = [
    { label: 'Dashboard Home', path: '/student/home' },
    { label: 'My Courses', path: '/student/courses' },
    { label: 'Lecture Library', path: '/student/lecture-library' },
    { label: 'AI Notes', path: '/student/ai-notes' },
    { label: 'AI Quiz', path: '/student/ai-quiz' },
    { label: 'Assignments', path: '/student/assignments' },
    { label: 'AI Tutor', path: '/student/ai-tutor' },
    { label: 'Progress & Analytics', path: '/student/progress' },
    { label: 'Notifications', path: '/student/notifications' },
    { label: 'Profile & Settings', path: '/student/settings' },
  ];

  const links = role === 'admin' ? adminLinks : role === 'faculty' ? facultyLinks : studentLinks;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className={`w-64 ${role === 'admin' ? 'bg-slate-900 text-white' : 'bg-white border-r border-slate-200'} flex flex-col justify-between`}>
        <div>
          <div className={`p-5 font-bold text-lg border-b ${role === 'admin' ? 'border-slate-800 text-indigo-400' : 'border-slate-100 text-indigo-600'}`}>
            VidyAstra {role.toUpperCase()}
          </div>
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] text-sm font-medium">
            {links.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`w-full text-left px-4 py-2.5 rounded-xl transition ${
                  currentPath === link.path
                    ? role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 font-semibold'
                    : role === 'admin' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200/20">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold uppercase transition"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 capitalize">
            {currentPath.split('/').pop().replace('-', ' ')}
          </h2>
          <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full uppercase tracking-wider">
            Role: {role}
          </span>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}