const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const rateLimit = require('express-rate-limit');

// Rate limiting: 20 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many requests from this IP, please try again later."
});

router.get('/analyze/:symbol', limiter, aiController.analyzeStock);
router.get('/price/:symbol', aiController.getPrice);
router.post('/chat', limiter, aiController.chatAdvisor);

module.exports = router;
