import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../../services/api';
import CourseForm from './CourseForm';
import EnrollmentRequests from './EnrollmentRequests';
import './InstructorDashboard.css';

const InstructorDashboard = ({ user, onLogout }) => {
  const [courses, setCourses] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getByInstructor(user._id);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, [user._id]);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getByInstructor(user._id);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setShowCourseForm(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const handleCourseFormClose = () => {
    setShowCourseForm(false);
    setEditingCourse(null);
    fetchCourses();
  };

  const handleViewRequests = (course) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    fetchCourses();
  };

  if (selectedCourse) {
    return (
      <EnrollmentRequests
        course={selectedCourse}
        user={user}
        onBack={handleBackToCourses}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="instructor-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <h2>Instructor Dashboard</h2>
        </div>
        <div className="nav-right">
          <span>{user.name}</span>
          <button onClick={onLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="dashboard-header">
          <h1>My Courses</h1>
          <button onClick={handleCreateCourse} className="btn btn-primary">
            Create New Course
          </button>
        </div>

        {showCourseForm && (
          <CourseForm
            course={editingCourse}
            instructor={user}
            onClose={handleCourseFormClose}
            onSuccess={handleCourseFormClose}
          />
        )}

        {loading ? (
          <div className="loading">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="no-courses">
            <p>You haven't created any courses yet.</p>
            <button onClick={handleCreateCourse} className="btn btn-primary">
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={handleEditCourse}
                onViewRequests={handleViewRequests}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CourseCard = ({ course, onEdit, onViewRequests }) => {
  const enrolledCount = course.totalSeats - course.availableSeats;

  return (
    <div className="course-card">
      <div className="course-header">
        <h3>{course.courseCode}</h3>
        <span className="course-semester">{course.semester}</span>
      </div>
      <h4 className="course-title">{course.title}</h4>
      <div className="course-info">
        <p>
          <strong>Enrolled:</strong> {enrolledCount} / {course.totalSeats}
        </p>
        <p>
          <strong>Available Seats:</strong> {course.availableSeats}
        </p>
      </div>
      <div className="course-actions">
        <button onClick={() => onEdit(course)} className="btn btn-secondary">
          Edit Course
        </button>
        <button onClick={() => onViewRequests(course)} className="btn btn-primary">
          View Enrollment Requests
        </button>
      </div>
    </div>
  );
};

export default InstructorDashboard;
