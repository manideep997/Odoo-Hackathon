const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { authenticateToken, requireUser } = require('../middleware/auth');

router.post('/answer/:answerId', authenticateToken, requireUser, voteController.voteAnswer);
router.delete('/answer/:answerId', authenticateToken, requireUser, voteController.removeVote);
router.get('/question/:questionId', authenticateToken, requireUser, voteController.getUserVotesForQuestion);

module.exports = router; 