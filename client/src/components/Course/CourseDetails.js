import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI, enrollmentsAPI, notificationsAPI } from '../../services/api';
import './CourseDetails.css';

const CourseDetails = ({ user, onLogout }) => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchCourse();
    fetchEnrollment();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await coursesAPI.getById(courseId);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      setMessage({ text: 'Error loading course', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollment = async () => {
    if (user.role !== 'student') return;

    try {
      const response = await enrollmentsAPI.getByStudent(user.id);
      const userEnrollment = response.data.find((e) => e.courseId === courseId);
      setEnrollment(userEnrollment);
    } catch (error) {
      console.error('Error fetching enrollment:', error);
    }
  };

  const handleEnroll = () => {
    if (course.availableSeats > 0) {
      setShowEnrollForm(true);
    }
  };

  const handleNotifyMe = async () => {
    try {
      await notificationsAPI.subscribe(user._id, courseId);
      setMessage({
        text: 'You will be notified when a seat becomes available',
        type: 'success'
      });
    } catch (error) {
      setMessage({
        text: error.response?.data?.error || 'Error subscribing to notifications',
        type: 'error'
      });
    }
  };

  const handleSubmitEnrollment = async (e) => {
    e.preventDefault();
    try {
      await enrollmentsAPI.create({
  studentId: user._id,
  courseId: courseId
});
      setMessage({
        text: 'Enrollment request submitted successfully',
        type: 'success'
      });
      setShowEnrollForm(false);
      fetchEnrollment();
    } catch (error) {
      setMessage({
        text: error.response?.data?.error || 'Error submitting enrollment',
        type: 'error'
      });
    }
  };

  const handleLeave = async () => {
    if (window.confirm('Are you sure you want to leave this course?')) {
      try {
        await enrollmentsAPI.update(enrollment.id, 'rejected');
        setMessage({ text: 'You have left the course', type: 'success' });
        fetchEnrollment();
        fetchCourse();
      } catch (error) {
        setMessage({
          text: error.response?.data?.error || 'Error leaving course',
          type: 'error'
        });
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (!course) {
    return <div className="error">Course not found</div>;
  }

  const isEnrolled = enrollment && enrollment.status === 'approved';
  const isPending = enrollment && enrollment.status === 'pending';
  const canEnroll = course.availableSeats > 0 && !enrollment;
  const isFull = course.availableSeats === 0;

  return (
    <div className="course-details-page">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            ← Back
          </button>
          <h2>Course Details</h2>
        </div>
        <div className="nav-right">
          <span>{user.name}</span>
          <button onClick={onLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="course-details-card">
          <div className="course-header-section">
            <h1>{course.courseCode} - {course.title}</h1>
            <span className="course-semester">{course.semester}</span>
          </div>

          <div className="course-info-section">
            <div className="info-row">
              <strong>Instructor:</strong> {course.instructorName}
            </div>
            <div className="info-row">
              <strong>Seats:</strong>{' '}
              <span className={course.availableSeats > 0 ? 'seats-available' : 'seats-full'}>
                {course.availableSeats} / {course.totalSeats}
              </span>
            </div>
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="info-row">
                <strong>Prerequisites:</strong> {course.prerequisites.join(', ')}
              </div>
            )}
            {course.description && (
              <div className="info-row">
                <strong>Description:</strong>
                <p>{course.description}</p>
              </div>
            )}
          </div>

          {user.role === 'student' && (
            <div className="course-actions">
              {isEnrolled && (
                <button onClick={handleLeave} className="btn btn-danger">
                  Leave Course
                </button>
              )}
              {isPending && (
                <div className="status-message">
                  Your enrollment request is pending approval
                </div>
              )}
              {canEnroll && (
                <button onClick={handleEnroll} className="btn btn-success">
                  Enroll in Course
                </button>
              )}
              {isFull && !enrollment && (
                <button onClick={handleNotifyMe} className="btn btn-primary">
                  Notify Me When Seat Available
                </button>
              )}
            </div>
          )}

          {showEnrollForm && (
            <div className="enrollment-form-modal">
              <div className="enrollment-form">
                <h3>Enroll in Course</h3>
                <form onSubmit={handleSubmitEnrollment}>
                  <div className="form-group">
                    <label>Student Name</label>
                    <input type="text" value={user.name} disabled />
                  </div>
                  <div className="form-group">
                    <label>University ID</label>
                    <input type="text" value={user.universityId} disabled />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={user.email} disabled />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input type="text" value={user.department || 'N/A'} disabled />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-success">
                      Submit Enrollment Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEnrollForm(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
