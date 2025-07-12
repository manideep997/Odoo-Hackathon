const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken, requireUser } = require('../middleware/auth');

router.get('/', authenticateToken, requireUser, notificationController.getNotifications);
router.get('/unread-count', authenticateToken, requireUser, notificationController.getUnreadCount);
router.put('/:id/read', authenticateToken, requireUser, notificationController.markAsRead);
router.put('/read-all', authenticateToken, requireUser, notificationController.markAllAsRead);

module.exports = router; 