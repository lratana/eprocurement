// Authentication Middleware
// This middleware verifies JWT tokens for protected routes

const jwt = require('jsonwebtoken');

// JWT Secret (should match the one in user.controller.js)
const JWT_SECRET = 'your-secret-key-change-this-in-production';

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    // Check if token starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Invalid token format. Use: Bearer <token>'
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Token is required.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request object
    req.user = decoded;
    
    // Continue to next middleware or route handler
    next();

  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Token has expired. Please login again.'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during authentication.'
    });
  }
};

module.exports = authMiddleware;