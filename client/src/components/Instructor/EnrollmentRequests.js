import React, { useState, useEffect } from 'react';
import { enrollmentsAPI, coursesAPI } from '../../services/api';
import './EnrollmentRequests.css';

const EnrollmentRequests = ({ course: initialCourse, user, onBack, onLogout }) => {
  const [course, setCourse] = useState(initialCourse);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchEnrollments();
  }, [course.id]);

  useEffect(() => {
    setCourse(initialCourse);
  }, [initialCourse]);

  const fetchEnrollments = async () => {
    try {
      const response = await enrollmentsAPI.getByCourse(course.id);
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setMessage({ text: 'Error loading enrollment requests', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (enrollmentId, status) => {
    try {
      await enrollmentsAPI.update(enrollmentId, status);
      setMessage({
        text: `Enrollment ${status} successfully`,
        type: 'success'
      });
      
      // Refresh enrollments and update course
      await fetchEnrollments();
      
      // Fetch updated course data to reflect seat changes
      try {
        const response = await coursesAPI.getById(course.id);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching updated course:', error);
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.error || 'Error updating enrollment',
        type: 'error'
      });
    }
  };

  const pendingEnrollments = enrollments.filter(e => e.status === 'pending');
  const approvedEnrollments = enrollments.filter(e => e.status === 'approved');
  const rejectedEnrollments = enrollments.filter(e => e.status === 'rejected');

  return (
    <div className="enrollment-requests-page">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <button onClick={onBack} className="btn btn-secondary">
            ← Back to Courses
          </button>
          <h2>Enrollment Requests</h2>
        </div>
        <div className="nav-right">
          <span>{user.name}</span>
          <button onClick={onLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="course-header-card">
          <h1>{course.courseCode} - {course.title}</h1>
          <div className="course-stats">
            <span>Total Seats: {course.totalSeats}</span>
            <span>Available: {course.availableSeats}</span>
            <span>Enrolled: {approvedEnrollments.length}</span>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading enrollment requests...</div>
        ) : (
          <>
            {pendingEnrollments.length > 0 && (
              <div className="enrollment-section">
                <h2>Pending Requests ({pendingEnrollments.length})</h2>
                <div className="enrollments-list">
                  {pendingEnrollments.map((enrollment) => (
                    <EnrollmentCard
                      key={enrollment.id}
                      enrollment={enrollment}
                      onApprove={() => handleUpdateStatus(enrollment.id, 'approved')}
                      onReject={() => handleUpdateStatus(enrollment.id, 'rejected')}
                      canApprove={course.availableSeats > 0}
                    />
                  ))}
                </div>
              </div>
            )}

            {approvedEnrollments.length > 0 && (
              <div className="enrollment-section">
                <h2>Approved ({approvedEnrollments.length})</h2>
                <div className="enrollments-list">
                  {approvedEnrollments.map((enrollment) => (
                    <EnrollmentCard
                      key={enrollment.id}
                      enrollment={enrollment}
                      status="approved"
                    />
                  ))}
                </div>
              </div>
            )}

            {rejectedEnrollments.length > 0 && (
              <div className="enrollment-section">
                <h2>Rejected ({rejectedEnrollments.length})</h2>
                <div className="enrollments-list">
                  {rejectedEnrollments.map((enrollment) => (
                    <EnrollmentCard
                      key={enrollment.id}
                      enrollment={enrollment}
                      status="rejected"
                    />
                  ))}
                </div>
              </div>
            )}

            {enrollments.length === 0 && (
              <div className="no-enrollments">
                <p>No enrollment requests for this course yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const EnrollmentCard = ({ enrollment, onApprove, onReject, canApprove, status }) => {
  const getStatusBadge = () => {
    switch (status || enrollment.status) {
      case 'approved':
        return <span className="status-badge approved">Approved</span>;
      case 'rejected':
        return <span className="status-badge rejected">Rejected</span>;
      default:
        return <span className="status-badge pending">Pending</span>;
    }
  };

  return (
    <div className="enrollment-card">
      <div className="enrollment-header">
        <h3>{enrollment.studentName}</h3>
        {getStatusBadge()}
      </div>
      <div className="enrollment-details">
        <p><strong>University ID:</strong> {enrollment.studentUniversityId}</p>
        <p><strong>Submitted:</strong> {new Date(enrollment.submittedAt).toLocaleString()}</p>
      </div>
      {!status && onApprove && onReject && (
        <div className="enrollment-actions">
          <button
            onClick={onApprove}
            className="btn btn-success"
            disabled={!canApprove}
            title={!canApprove ? 'No seats available' : ''}
          >
            Approve
          </button>
          <button onClick={onReject} className="btn btn-danger">
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default EnrollmentRequests;
