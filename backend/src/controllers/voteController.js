const Vote = require('../models/Vote');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const { validate, voteSchemas } = require('../utils/validation');
const { createVoteNotification } = require('../utils/notificationService');

const voteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { voteType } = req.body;
    const user = req.user;

    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({
        error: 'Answer not found',
        message: 'The requested answer does not exist'
      });
    }

    if (!answer.isApproved) {
      return res.status(404).json({
        error: 'Answer not found',
        message: 'The requested answer does not exist'
      });
    }

    if (answer.author.toString() === user._id.toString()) {
      return res.status(400).json({
        error: 'Cannot vote on own answer',
        message: 'You cannot vote on your own answer'
      });
    }

    const existingVote = await Vote.findByUserAndAnswer(user._id, answerId);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await Vote.removeVote(user._id, answerId);
        await answer.updateVoteCounts();

        res.json({
          message: 'Vote removed successfully',
          voteCount: answer.voteCount
        });
      } else {
        existingVote.voteType = voteType;
        await existingVote.save();
        await answer.updateVoteCounts();

        await createVoteNotification(
          answer.author,
          user._id,
          user.username,
          answerId,
          answer.question,
          voteType
        );

        res.json({
          message: 'Vote updated successfully',
          voteCount: answer.voteCount
        });
      }
    } else {
      await Vote.createOrUpdateVote(user._id, answerId, answer.question, voteType);
      await answer.updateVoteCounts();

      await createVoteNotification(
        answer.author,
        user._id,
        user.username,
        answerId,
        answer.question,
        voteType
      );

      res.json({
        message: 'Vote recorded successfully',
        voteCount: answer.voteCount
      });
    }
  } catch (error) {
    console.error('Vote answer error:', error);
    res.status(500).json({
      error: 'Failed to vote on answer',
      message: 'Internal server error'
    });
  }
};

const removeVote = async (req, res) => {
  try {
    const { answerId } = req.params;
    const user = req.user;

    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({
        error: 'Answer not found',
        message: 'The requested answer does not exist'
      });
    }

    const existingVote = await Vote.findByUserAndAnswer(user._id, answerId);
    if (!existingVote) {
      return res.status(400).json({
        error: 'No vote found',
        message: 'You have not voted on this answer'
      });
    }

    await Vote.removeVote(user._id, answerId);
    await answer.updateVoteCounts();

    res.json({
      message: 'Vote removed successfully',
      voteCount: answer.voteCount
    });
  } catch (error) {
    console.error('Remove vote error:', error);
    res.status(500).json({
      error: 'Failed to remove vote',
      message: 'Internal server error'
    });
  }
};

const getUserVotesForQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const user = req.user;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The requested question does not exist'
      });
    }

    const votes = await Vote.getUserVotesForQuestion(user._id, questionId);

    const voteMap = {};
    votes.forEach(vote => {
      voteMap[vote.answer.id] = vote.voteType;
    });

    res.json({
      votes: voteMap
    });
  } catch (error) {
    console.error('Get user votes error:', error);
    res.status(500).json({
      error: 'Failed to get user votes',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  voteAnswer: [validate(voteSchemas.create), voteAnswer],
  removeVote,
  getUserVotesForQuestion
}; 