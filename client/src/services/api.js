import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials)
};

// Courses API
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (courseData) => api.post('/courses', courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: (id) => api.delete(`/courses/${id}`),
  getByInstructor: (instructorId) => api.get(`/courses/instructor/${instructorId}`)
};

// Enrollments API
export const enrollmentsAPI = {
  create: (enrollmentData) => api.post('/enrollments', enrollmentData),
  getByCourse: (courseId) => api.get(`/enrollments/course/${courseId}`),
  getByStudent: (studentId) => api.get(`/enrollments/student/${studentId}`),
  update: (id, status) => api.put(`/enrollments/${id}`, { status })
};

// Notifications API
export const notificationsAPI = {
  subscribe: (studentId, courseId) => api.post('/notifications/subscribe', { studentId, courseId }),
  getByStudent: (studentId) => api.get(`/notifications/${studentId}`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`)
};

export default api;
