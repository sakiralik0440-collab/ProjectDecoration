// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getMe, requestOtp, verifyOtp } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/register/request-otp', requestOtp);
router.post('/register/verify-otp', verifyOtp);

// Protected route
router.get('/me', authMiddleware, getMe);

module.exports = router;
