const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { authenticateToken, requireUser, requireOwnership } = require('../middleware/auth');
const Question = require('../models/Question');

router.get('/', questionController.getQuestions);
router.get('/:id', questionController.getQuestion);
router.get('/user/:username', questionController.getUserQuestions);

router.post('/', authenticateToken, requireUser, questionController.createQuestion);
router.put('/:id', authenticateToken, requireUser, requireOwnership(Question), questionController.updateQuestion);
router.delete('/:id', authenticateToken, requireUser, requireOwnership(Question), questionController.deleteQuestion);
router.post('/:id/close', authenticateToken, requireUser, requireOwnership(Question), questionController.closeQuestion);
router.post('/:id/reopen', authenticateToken, requireUser, requireOwnership(Question), questionController.reopenQuestion);

module.exports = router; 