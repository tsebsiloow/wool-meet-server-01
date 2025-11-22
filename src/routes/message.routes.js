// src/routes/message.routes.js
const router = require('express').Router();
const messageController = require('../controllers/message.controller');

router.get('/messages/recent', messageController.recent);

module.exports = router;
