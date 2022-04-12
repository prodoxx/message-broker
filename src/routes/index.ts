import express from 'express';
import { messageController } from '../controllers';

const router = express.Router();

// routes
router.get('/health-check', (_req, res) => res.status(200).json({ message: 'OK' }));

// message api routes
router.post('/message', messageController.sendMessage);
router.get('/message', messageController.readMessage);

module.exports = router;
