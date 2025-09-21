import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import { processVoiceCommand, transcribeAudio } from '../config/openSourceAI.js';
import { authenticateToken } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Configure multer for audio uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit for audio
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'audio/wav',
      'audio/mp3',
      'audio/mpeg',
      'audio/webm',
      'audio/ogg',
      'audio/m4a',
      'application/octet-stream'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

// Supported languages for demo
const supportedLanguages = {
  'hi-IN': { name: 'Hindi (India)', voice: 'hi-IN-Wavenet-A' },
  'en-IN': { name: 'English (India)', voice: 'en-IN-Wavenet-D' },
  'bn-IN': { name: 'Bengali (India)', voice: 'bn-IN-Wavenet-A' },
  'ta-IN': { name: 'Tamil (India)', voice: 'ta-IN-Wavenet-A' },
  'te-IN': { name: 'Telugu (India)', voice: 'te-IN-Wavenet-A' },
  'mr-IN': { name: 'Marathi (India)', voice: 'mr-IN-Wavenet-A' }
};

/**
 * @route POST /api/voice/command
 * @desc Process voice command and return response
 * @access Private
 */
router.post('/command',
  authenticateToken,
  upload.single('audio'),
  [
    body('sessionId').optional().isString(),
    body('languageHint').optional().isIn(Object.keys(supportedLanguages))
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Audio file is required'
        });
      }

      const { sessionId = `voice_${Date.now()}`, languageHint = 'hi-IN' } = req.body;
      const artisanId = req.user._id;
      const audioBuffer = req.file.buffer;

      // Transcribe audio first
      const transcription = await transcribeAudio(audioBuffer, languageHint);
      
      // Process the transcribed command
      const response = await processVoiceCommand(transcription.transcript, {
        artisanId,
        sessionId,
        language: languageHint
      });

      res.json({
        success: true,
        message: 'Voice command processed successfully',
        data: {
          transcription: transcription.transcript,
          ...response,
          sessionId,
          language: languageHint
        }
      });

    } catch (error) {
      logger.error('Voice command processing failed:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to process voice command',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/voice/supported-languages
 * @desc Get list of supported languages for voice commerce
 * @access Private
 */
router.get('/supported-languages', authenticateToken, async (req, res) => {
  try {
    const languages = Object.entries(supportedLanguages).map(
      ([code, info]) => ({
        code,
        ...info
      })
    );

    res.json({
      success: true,
      message: 'Supported languages retrieved successfully',
      data: {
        languages,
        total: languages.length,
        defaultLanguage: 'hi-IN'
      }
    });

  } catch (error) {
    logger.error('Failed to get supported languages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get supported languages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/voice/status
 * @desc Get voice commerce engine status
 * @access Private
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const status = {
      engineInitialized: true,
      supportedLanguages: Object.keys(supportedLanguages).length,
      features: {
        speechToText: true,
        textToSpeech: true,
        intentRecognition: true,
        multilingualSupport: true,
        conversationContext: true
      },
      demoMode: true,
      timestamp: new Date(),
      version: '1.0.0'
    };

    res.json({
      success: true,
      message: 'Voice commerce status retrieved',
      data: status
    });

  } catch (error) {
    logger.error('Voice status check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get voice commerce status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
