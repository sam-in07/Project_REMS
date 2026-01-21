import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesAPI, notificationsAPI } from '../../services/api';
import NotificationPanel from './NotificationPanel';
import './StudentDashboard.css';

const StudentDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getByStudent(user.id);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const filterCourses = () => {
    if (!searchTerm) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter(
      (course) =>
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="student-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <h2>University Course Registration</h2>
        </div>
        <div className="nav-right">
          <div className="notification-icon-container" onClick={() => setShowNotifications(!showNotifications)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
          <div className="user-menu">
            <span>{user.name}</span>
            <button onClick={onLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onNotificationClick={fetchNotifications}
        />
      )}

      <div className="container">
        <div className="dashboard-header">
          <h1>Student Dashboard</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by Course Code or Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="no-results">No courses found</div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CourseCard = ({ course, navigate }) => {
  const handleViewCourse = () => {
    navigate(`/course/${course._id}`);
  };

  return (
    <div className="course-card">
      <div className="course-header">
        <h3>{course.courseCode}</h3>
        <span className="course-semester">{course.semester}</span>
      </div>
      <h4 className="course-title">{course.title}</h4>
      <div className="course-info">
        <p>
          <strong>Instructor:</strong> {course.instructorName}
        </p>
        <p>
          <strong>Available Seats:</strong>{' '}
          <span className={course.availableSeats > 0 ? 'seats-available' : 'seats-full'}>
            {course.availableSeats} / {course.totalSeats}
          </span>
        </p>
      </div>
      <button onClick={handleViewCourse} className="btn btn-primary">
        View Course
      </button>
    </div>
  );
};

export default StudentDashboard;
