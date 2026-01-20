const notificationService = require('../services/notificationService');
const courseService = require('../services/courseService');

const subscribe = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ error: 'Student ID and Course ID required' });
    }

    // Verify course exists
    const course = await courseService.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Subscribe to notifications
    await notificationService.subscribeToCourseNotifications(studentId, courseId);

    res.json({ message: 'Subscribed to notifications successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { studentId } = req.params;
    const notifications = await notificationService.getNotificationsByStudent(studentId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  subscribe,
  getNotifications,
  markAsRead
};
