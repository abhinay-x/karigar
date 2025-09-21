import jwt from 'jsonwebtoken';
import Artisan from '../models/Artisan.js';
import demoDataService from '../services/demoDataService.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    const demoMode = req.headers['x-demo-mode'] === 'true';

    // Check for demo mode first
    if (demoMode || req.query.demo === 'true') {
      const demoArtisan = demoDataService.getDemoArtisan();
      req.user = demoArtisan;
      req.isDemo = true;
      logger.info('Demo mode activated for request');
      return next();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required. Use demo=true for demo mode.',
        demoAvailable: true
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const artisan = await Artisan.findById(decoded.id).select('-password');
    
    if (!artisan) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - artisan not found'
      });
    }

    // Check if user is verified
    if (!artisan.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address'
      });
    }

    // Add artisan to request object
    req.user = artisan;
    req.isDemo = false;
    next();

  } catch (error) {
    logger.error('Authentication failed:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Use demo=true for demo mode.',
        demoAvailable: true
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Use demo=true for demo mode.',
        demoAvailable: true
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Middleware to check if user has specific role
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Middleware to check if user owns the resource
 */
export const requireOwnership = (resourceIdField = 'artisanId') => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id.toString();
      const resourceId = req.params.id || req.body[resourceIdField] || req.query[resourceIdField];

      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID required'
        });
      }

      // For direct user ID comparison
      if (resourceIdField === 'userId' || resourceIdField === 'artisanId') {
        if (resourceId !== userId) {
          return res.status(403).json({
            success: false,
            message: 'Access denied - not resource owner'
          });
        }
      }

      next();
    } catch (error) {
      logger.error('Ownership check error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const artisan = await Artisan.findById(decoded.id).select('-password');
      
      if (artisan && artisan.isVerified) {
        req.user = artisan;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
};
