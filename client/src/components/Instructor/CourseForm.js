import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../../services/api';
import './CourseForm.css';

const CourseForm = ({ course, instructor, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    title: '',
    semester: 'Fall 2024',
    totalSeats: '',
    prerequisites: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (course) {
      setFormData({
        courseCode: course.courseCode || '',
        title: course.title || '',
        semester: course.semester || 'Fall 2024',
        totalSeats: course.totalSeats || '',
        prerequisites: Array.isArray(course.prerequisites) 
          ? course.prerequisites.join(', ') 
          : course.prerequisites || '',
        description: course.description || ''
      });
    }
  }, [course]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const prerequisitesArray = formData.prerequisites
        ? formData.prerequisites.split(',').map(p => p.trim()).filter(p => p)
        : [];

      const courseData = {
        courseCode: formData.courseCode,
        title: formData.title,
        instructorId: instructor._id,
        instructorName: instructor.name,
        semester: formData.semester,
        totalSeats: parseInt(formData.totalSeats),
        prerequisites: prerequisitesArray,
        description: formData.description
      };

      if (course) {
        // Update existing course
        await coursesAPI.update(course.id, courseData);
      } else {
        // Create new course
        await coursesAPI.create(courseData);
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-form-overlay" onClick={onClose}>
      <div className="course-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="course-form-header">
          <h2>{course ? 'Edit Course' : 'Create New Course'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="course-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Course Code *</label>
            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              required
              placeholder="e.g., CS101"
            />
          </div>

          <div className="form-group">
            <label>Course Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Semester *</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2025">Spring 2025</option>
                <option value="Summer 2025">Summer 2025</option>
                <option value="Autumn 2025">Autumn 2025</option>
                <option value="Summer 2025">Summer 2026</option>
              </select>
            </div>

            <div className="form-group">
              <label>Total Seats *</label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Prerequisites (comma-separated)</label>
            <input
              type="text"
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleChange}
              placeholder="e.g., CS101, CS102"
            />
          </div>

          <div className="form-group">
            <label>Course Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter course description..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
