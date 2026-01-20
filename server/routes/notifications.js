const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/subscribe', notificationController.subscribe);
router.get('/:studentId', notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;
