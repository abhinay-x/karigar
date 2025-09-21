import express from 'express';

const router = express.Router();

// Placeholder routes for Artisan features
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Artisan route is up' });
});

export default router;
