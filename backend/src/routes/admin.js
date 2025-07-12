const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.use(authenticateToken, requireAdmin);

router.get('/questions', adminController.getAllQuestions);
router.put('/questions/:id/approve', adminController.approveQuestion);
router.put('/questions/:id/reject', adminController.rejectQuestion);

router.get('/answers', adminController.getAllAnswers);
router.put('/answers/:id/approve', adminController.approveAnswer);
router.put('/answers/:id/reject', adminController.rejectAnswer);

router.get('/users', adminController.getAllUsers);
router.put('/users/:id/ban', adminController.banUser);
router.put('/users/:id/unban', adminController.unbanUser);
router.put('/users/:id/role', adminController.updateUserRole);

router.get('/stats', adminController.getStats);
router.get('/reports', adminController.getReports);

module.exports = router; 