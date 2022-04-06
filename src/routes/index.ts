import express from 'express';

const router = express.Router();

// routes
router.get('/health-check', (_req, res) => res.status(200).json({ message: 'OK' }));

export default router;
