const mockDb = require('../services/mockDb');

const createEnrollment = (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ error: 'Student ID and Course ID required' });
    }

    // Check if course exists
    const course = mockDb.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = mockDb.getEnrollmentsByStudent(studentId)
      .find(e => e.courseId === courseId);
    
    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled or enrollment request exists' });
    }

    // Create enrollment request with pending status
    const enrollment = mockDb.createEnrollment({
      studentId,
      courseId,
      status: 'pending'
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEnrollmentsByCourse = (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = mockDb.getEnrollmentsByCourse(courseId);
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEnrollmentsByStudent = (req, res) => {
  try {
    const { studentId } = req.params;
    const enrollments = mockDb.getEnrollmentsByStudent(studentId);
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEnrollment = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Valid status required (pending/approved/rejected)' });
    }

    const enrollment = mockDb.getEnrollmentById(id);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const course = mockDb.getCourseById(enrollment.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Handle approval logic
    if (status === 'approved' && enrollment.status !== 'approved') {
      // Check if seats are available
      if (course.availableSeats <= 0) {
        return res.status(400).json({ error: 'No seats available' });
      }

      // Decrease available seats
      course.availableSeats -= 1;
      mockDb.updateCourse(course.id, { availableSeats: course.availableSeats });
    }

    // Handle rejection - if it was approved, increase seats back
    if (status === 'rejected' && enrollment.status === 'approved') {
      const wasFull = course.availableSeats === 0;
      course.availableSeats += 1;
      mockDb.updateCourse(course.id, { availableSeats: course.availableSeats });

      // If course was full (0 seats) and now has a seat available (1 seat), notify subscribed students
      if (wasFull && course.availableSeats === 1) {
        const message = `A seat is now available for ${course.courseCode} - ${course.title}`;
        mockDb.notifySubscribedStudents(course.id, message);
      }
    }

    // Update enrollment status
    const updatedEnrollment = mockDb.updateEnrollment(id, { status });

    res.json(updatedEnrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEnrollment,
  getEnrollmentsByCourse,
  getEnrollmentsByStudent,
  updateEnrollment
};
