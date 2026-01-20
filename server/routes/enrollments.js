const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

router.post('/', enrollmentController.createEnrollment);
router.get('/course/:courseId', enrollmentController.getEnrollmentsByCourse);
router.get('/student/:studentId', enrollmentController.getEnrollmentsByStudent);
router.put('/:id', enrollmentController.updateEnrollment);

module.exports = router;
