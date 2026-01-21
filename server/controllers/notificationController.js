const Notification = require('../models/Notification');
const Course = require('../models/Course');

// Subscribe a student to course notifications
const subscribe = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ error: 'Student ID and Course ID required' });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already subscribed
    const existing = await Notification.findOne({ studentId, courseId, message: { $regex: /Subscribed/i } });
    if (existing) {
      return res.status(400).json({ error: 'Already subscribed to notifications for this course' });
    }

    // Create a subscription notification (you can also store subscriptions in a separate model if needed)
    const notification = new Notification({
      studentId,
      courseId,
      message: `Subscribed to notifications for ${course.courseCode} - ${course.title}`,
      read: false
    });

    await notification.save();
    res.json({ message: 'Subscribed to notifications successfully', notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get notifications for a student
const getNotifications = async (req, res) => {
  try {
    const { studentId } = req.params;
    const notifications = await Notification.find({ studentId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  subscribe,
  getNotifications,
  markAsRead
};