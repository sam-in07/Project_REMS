const express = require('express');
const router = express.Router(); // router jeta express theke asche
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
