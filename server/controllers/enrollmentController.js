const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

// Create enrollment request
const createEnrollment = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ error: 'Student ID and Course ID required' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled or enrollment request exists' });
    }

    // Create enrollment request with pending status
    const enrollment = new Enrollment({
      studentId,
      courseId,
      status: 'pending'
    });

    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get enrollments by course
const getEnrollmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = await Enrollment.find({ courseId })
      .populate('studentId', 'name email department')
      .populate('courseId', 'courseCode title semester');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get enrollments by student
const getEnrollmentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const enrollments = await Enrollment.find({ studentId })
      .populate('courseId', 'courseCode title semester');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update enrollment status
const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Valid status required (pending/approved/rejected)' });
    }

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const course = await Course.findById(enrollment.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Handle approval logic
    // Handle approval logic
if (status === 'approved' && enrollment.status !== 'approved') {
  if (course.availableSeats <= 0) {
    return res.status(400).json({ error: 'No seats available' });
  }
  course.availableSeats -= 1;
  await course.save();

  // ✅ Create notification for student
  await Notification.create({
    studentId: enrollment.studentId,
    courseId: enrollment.courseId,
    message: `Your enrollment for ${course.courseCode} - ${course.title} has been approved.`,
    read: false,
    timestamp: new Date()
  });
}

    // Handle rejection logic
    if (status === 'rejected' && enrollment.status === 'approved') {
      const wasFull = course.availableSeats === 0;
      course.availableSeats += 1;
      await course.save();

      // (Optional) notify subscribed students if seats open up
      if (wasFull && course.availableSeats === 1) {
        console.log(`Notification: A seat is now available for ${course.courseCode} - ${course.title}`);
        // Later you can integrate Notification model here
      }
    }

    enrollment.status = status;
    await enrollment.save();

    res.json(enrollment);
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