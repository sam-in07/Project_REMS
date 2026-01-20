const enrollmentService = require('../services/enrollmentService');
const courseService = require('../services/courseService');
const notificationService = require('../services/notificationService');

const createEnrollment = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ error: 'Student ID and Course ID required' });
    }

    // Check if course exists
    const course = await courseService.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Create enrollment request with pending status
    const enrollment = await enrollmentService.createEnrollment({
      studentId,
      courseId,
      status: 'pending'
    });

    res.status(201).json(enrollment);
  } catch (error) {
    // Handle Prisma unique constraint error (already enrolled)
    if (error.code === 'P2002' || error.message.includes('already exists')) {
      return res.status(400).json({ error: 'Already enrolled or enrollment request exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

const getEnrollmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = await enrollmentService.getEnrollmentsByCourse(courseId);
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEnrollmentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const enrollments = await enrollmentService.getEnrollmentsByStudent(studentId);
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Valid status required (pending/approved/rejected)' });
    }

    const enrollment = await enrollmentService.getEnrollmentById(id);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const course = await courseService.getCourseById(enrollment.courseId);
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
      await courseService.updateCourse(course.id, {
        availableSeats: course.availableSeats - 1
      });
    }

    // Handle rejection - if it was approved, increase seats back
    if (status === 'rejected' && enrollment.status === 'approved') {
      const wasFull = course.availableSeats === 0;
      const newAvailableSeats = course.availableSeats + 1;
      
      await courseService.updateCourse(course.id, {
        availableSeats: newAvailableSeats
      });

      // If course was full (0 seats) and now has a seat available (1 seat), notify subscribed students
      if (wasFull && newAvailableSeats === 1) {
        const message = `A seat is now available for ${course.courseCode} - ${course.title}`;
        await notificationService.notifySubscribedStudents(course.id, message);
      }
    }

    // Update enrollment status
    const updatedEnrollment = await enrollmentService.updateEnrollment(id, { status });

    res.json(updatedEnrollment);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEnrollment,
  getEnrollmentsByCourse,
  getEnrollmentsByStudent,
  updateEnrollment
};
