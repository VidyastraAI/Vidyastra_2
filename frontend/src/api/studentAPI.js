import api from './axios';

export const studentAPI = {
  // Courses
  getCourses: () => api.get('/student/courses'),

  // Assignments
  getAssignments: () => api.get('/student/assignments'),
  submitAssignment: (id, data) => api.post(`/student/assignments/${id}/submit`, data),

  // Lecture Library
  getAllLectures: () => api.get('/student/lectures'),
  getLectureById: (id) => api.get(`/student/lectures/${id}`),

  // Notifications
  getAllNotifications: () => api.get('/student/notifications'),
  markNotificationAsRead: (id) => api.patch(`/student/notifications/${id}/read`),
  deleteNotification: (id) => api.delete(`/student/notifications/${id}`),

  // Dashboard
  getDashboard: () => api.get('/student/dashboard'),

  // Profile Settings
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),

  // Progress Analytics
  getProgressAnalytics: () => api.get('/student/analytics'),

  // AI Quiz
  generateAiQuiz: (data) => api.post('/student/ai/quiz/generate', data),

  // AI Notes
  generateAiNotes: (data) => api.post('/student/ai/notes/generate', data),

  // AI Tutor
  sendAiTutorMessage: (data) => api.post('/student/ai/tutor/tutor', data),
};