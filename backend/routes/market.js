import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Market route is up' });
});

export default router;
