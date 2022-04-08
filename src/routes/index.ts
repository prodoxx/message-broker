import express from 'express';
import { messageController } from '../controllers';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

// rate limiting config
const generalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const healthCheckRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10000 // limit each IP to 100 requests per windowMs
});

// routes
router.get('/health-check', healthCheckRateLimiter, (_req, res) => res.status(200).json({ message: 'OK' }));

// message api routes
router.post('/message', generalRateLimiter, messageController.sendMessage);
router.get('/message', generalRateLimiter, messageController.readMessage);

module.exports = router;
