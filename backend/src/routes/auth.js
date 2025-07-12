const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireUser } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users/:username', authController.getUserByUsername);

router.get('/me', authenticateToken, authController.getProfile);
router.put('/me', authenticateToken, requireUser, authController.updateProfile);
router.post('/change-password', authenticateToken, requireUser, authController.changePassword);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router; 