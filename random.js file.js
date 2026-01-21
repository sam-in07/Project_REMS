// - enrollment.js → enrollmentController.js → Enrollment.js
// - notification.js → notificationController.js → Notification.js
// course ?
const Notification = require('../models/Notification');

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
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Subscribe (optional, for seat availability)
const subscribe = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    await Notification.create({
      studentId,
      courseId,
      message: `You will be notified when seats open for this course.`,
      read: false
    });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getNotifications, markAsRead, subscribe };