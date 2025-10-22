// Authentication Routes
// This file contains all authentication-related routes

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth');

// 🔐 Public Routes (no authentication required)

// Simple test route
router.get('/test-simple', (req, res) => {
  res.json({
    status: 'success',
    message: 'Auth routes are working!'
  });
});

// User Registration
router.post('/signup', userController.signUp);

// User Login
router.post('/signin', userController.signIn);

// 🔒 Protected Routes (authentication required)

// Get user profile
router.get('/profile', authMiddleware, userController.getProfile);

// Update user profile
router.put('/profile', authMiddleware, userController.updateProfile);

// 📋 Test route to check if authentication is working
router.get('/test', authMiddleware, (req, res) => {
  res.json({
    status: 'success',
    message: 'Authentication is working!',
    user: {
      id: req.user.userId,
      email: req.user.email
    }
  });
});

module.exports = router;