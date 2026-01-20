const mockDb = require('../services/mockDb');

const subscribe = (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ error: 'Student ID and Course ID required' });
    }

    // Verify course exists
    const course = mockDb.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Subscribe to notifications
    const subscribed = mockDb.subscribeToCourseNotifications(studentId, courseId);
    
    if (!subscribed) {
      return res.status(400).json({ error: 'Already subscribed to notifications for this course' });
    }

    res.json({ message: 'Subscribed to notifications successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNotifications = (req, res) => {
  try {
    const { studentId } = req.params;
    const notifications = mockDb.getNotificationsByStudent(studentId);
    
    // Sort by createdAt (newest first)
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = (req, res) => {
  try {
    const { id } = req.params;
    const notification = mockDb.updateNotification(id, { read: true });
    
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
