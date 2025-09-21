import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import Artisan from '../models/Artisan.js';
import { 
  generateToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  authenticateToken 
} from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { cacheService } from '../config/redis.js';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register new artisan
 * @access Public
 */
router.post('/register', [
  body('personalInfo.name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('personalInfo.email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('personalInfo.phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian mobile number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('craftDetails.primaryCraft')
    .isIn(['pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork', 'leather', 'painting', 'sculpture', 'other'])
    .withMessage('Please select a valid craft category'),
  
  body('craftDetails.experience')
    .isInt({ min: 0, max: 80 })
    .withMessage('Experience must be between 0 and 80 years'),
  
  body('personalInfo.location.state')
    .notEmpty()
    .withMessage('State is required'),
  
  body('personalInfo.location.district')
    .notEmpty()
    .withMessage('District is required'),
  
  body('personalInfo.location.village')
    .notEmpty()
    .withMessage('Village/City is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { personalInfo, password, craftDetails } = req.body;

    // Check if artisan already exists
    const existingArtisan = await Artisan.findOne({
      $or: [
        { 'personalInfo.email': personalInfo.email },
        { 'personalInfo.phone': personalInfo.phone }
      ]
    });

    if (existingArtisan) {
      return res.status(400).json({
        success: false,
        message: 'Artisan already exists with this email or phone number'
      });
    }

    // Create new artisan
    const artisan = new Artisan({
      personalInfo,
      password,
      craftDetails,
      digitalProfile: {
        storefront: {
          url: `${personalInfo.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          isActive: false,
          theme: 'heritage'
        },
        aiPreferences: {
          contentTone: 'traditional',
          targetAudience: 'national',
          voicePersonality: 'friendly'
        }
      },
      // Mark verified for MVP/demo so protected routes work immediately
      isVerified: true
    });

    await artisan.save();

    // Generate tokens
    const token = generateToken(artisan._id);
    const refreshToken = generateRefreshToken(artisan._id);

    // Remove password from response
    const artisanResponse = artisan.toObject();
    delete artisanResponse.password;

    // Update login stats
    artisan.activity.loginCount += 1;
    artisan.activity.lastLogin = new Date();
    await artisan.save();

    res.status(201).json({
      success: true,
      message: 'Artisan registered successfully',
      data: {
        artisan: artisanResponse,
        token,
        refreshToken
      }
    });

  } catch (error) {
    logger.error('Registration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login artisan
 * @access Public
 */
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find artisan and include password for comparison
    const artisan = await Artisan.findOne({ 'personalInfo.email': email }).select('+password');

    if (!artisan) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordCorrect = await artisan.correctPassword(password, artisan.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate tokens
    const token = generateToken(artisan._id);
    const refreshToken = generateRefreshToken(artisan._id);

    // Update login stats
    artisan.activity.loginCount += 1;
    artisan.activity.lastLogin = new Date();
    await artisan.save();

    // Remove password from response
    const artisanResponse = artisan.toObject();
    delete artisanResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        artisan: artisanResponse,
        token,
        refreshToken
      }
    });

  } catch (error) {
    logger.error('Login failed:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh-token', [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if artisan exists
    const artisan = await Artisan.findById(decoded.id);

    if (!artisan) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newToken = generateToken(artisan._id);
    const newRefreshToken = generateRefreshToken(artisan._id);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    logger.error('Token refresh failed:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current artisan profile
 * @access Private
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const artisan = await Artisan.findById(req.user._id);

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Artisan not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: artisan
    });

  } catch (error) {
    logger.error('Profile retrieval failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route PUT /api/auth/profile
 * @desc Update artisan profile
 * @access Private
 */
router.put('/profile', authenticateToken, [
  body('personalInfo.name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('personalInfo.phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian mobile number'),
  
  body('craftDetails.experience')
    .optional()
    .isInt({ min: 0, max: 80 })
    .withMessage('Experience must be between 0 and 80 years')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updates = req.body;
    const artisan = await Artisan.findById(req.user._id);

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Artisan not found'
      });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
          // Handle nested objects
          artisan[key] = { ...artisan[key], ...updates[key] };
        } else {
          artisan[key] = updates[key];
        }
      }
    });

    await artisan.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: artisan
    });

  } catch (error) {
    logger.error('Profile update failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/auth/change-password
 * @desc Change artisan password
 * @access Private
 */
router.post('/change-password', authenticateToken, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const artisan = await Artisan.findById(req.user._id).select('+password');

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Artisan not found'
      });
    }

    // Check current password
    const isCurrentPasswordCorrect = await artisan.correctPassword(currentPassword, artisan.password);

    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    artisan.password = newPassword;
    await artisan.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Password change failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout artisan (invalidate token)
 * @access Private
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a production app, you might want to blacklist the token
    // For now, we'll just return success
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    logger.error('Logout failed:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route DELETE /api/auth/account
 * @desc Delete artisan account
 * @access Private
 */
router.delete('/account', authenticateToken, [
  body('password')
    .notEmpty()
    .withMessage('Password is required for account deletion')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { password } = req.body;
    const artisan = await Artisan.findById(req.user._id).select('+password');

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Artisan not found'
      });
    }

    // Verify password
    const isPasswordCorrect = await artisan.correctPassword(password, artisan.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Delete artisan account
    await Artisan.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    logger.error('Account deletion failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
