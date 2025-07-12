const Answer = require('../models/Answer');
const Question = require('../models/Question');
const { validate, answerSchemas, paginationSchema } = require('../utils/validation');
const { sanitizeHtml } = require('../utils/validation');
const { 
  createAnswerNotification, 
  createMentionNotifications 
} = require('../utils/notificationService');

const createAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;
    const user = req.user;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The requested question does not exist'
      });
    }

    if (!question.isApproved) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The requested question does not exist'
      });
    }

    const sanitizedContent = sanitizeHtml(content);

    const answer = new Answer({
      question: questionId,
      content: sanitizedContent,
      author: user._id,
      authorUsername: user.username
    });

    await answer.save();

    await answer.populate('author', 'username reputation avatar');

    await createAnswerNotification(
      question.author,
      user._id,
      user.username,
      question.title,
      questionId,
      answer._id
    );

    await createMentionNotifications(
      content,
      user._id,
      user.username,
      questionId,
      answer._id
    );

    res.status(201).json({
      message: 'Answer created successfully',
      answer
    });
  } catch (error) {
    console.error('Create answer error:', error);
    res.status(500).json({
      error: 'Failed to create answer',
      message: 'Internal server error'
    });
  }
};

const getAnswersByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { page = 1, limit = 10, sort = 'votes' } = req.query;
    const skip = (page - 1) * limit;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The requested question does not exist'
      });
    }

    const options = {
      skip,
      limit: parseInt(limit),
      sort
    };

    const answers = await Answer.findByQuestion(questionId, options);

    const total = await Answer.countDocuments({
      question: questionId,
      isApproved: true
    });

    res.json({
      answers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get answers error:', error);
    res.status(500).json({
      error: 'Failed to get answers',
      message: 'Internal server error'
    });
  }
};

const updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({
        error: 'Answer not found',
        message: 'The requested answer does not exist'
      });
    }

    const isOwner = answer.author.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only edit your own answers'
      });
    }

    const sanitizedContent = sanitizeHtml(content);

    answer.content = sanitizedContent;
    await answer.save();

    await answer.populate('author', 'username reputation avatar');

    res.json({
      message: 'Answer updated successfully',
      answer
    });
  } catch (error) {
    console.error('Update answer error:', error);
    res.status(500).json({
      error: 'Failed to update answer',
      message: 'Internal server error'
    });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({
        error: 'Answer not found',
        message: 'The requested answer does not exist'
      });
    }

    const isOwner = answer.author.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own answers'
      });
    }

    await answer.remove();

    res.json({
      message: 'Answer deleted successfully'
    });
  } catch (error) {
    console.error('Delete answer error:', error);
    res.status(500).json({
      error: 'Failed to delete answer',
      message: 'Internal server error'
    });
  }
};

const acceptAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({
        error: 'Answer not found',
        message: 'The requested answer does not exist'
      });
    }

    const question = await Question.findById(answer.question);
    if (!question) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The question for this answer does not exist'
      });
    }

    const isQuestionOwner = question.author.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isQuestionOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only the question author can accept answers'
      });
    }

    await Answer.updateMany(
      { question: answer.question, isAccepted: true },
      { isAccepted: false, acceptedAt: null, acceptedBy: null }
    );

    await answer.accept(user._id);

    await answer.populate('author', 'username reputation avatar');
    await answer.populate('acceptedBy', 'username');

    res.json({
      message: 'Answer accepted successfully',
      answer
    });
  } catch (error) {
    console.error('Accept answer error:', error);
    res.status(500).json({
      error: 'Failed to accept answer',
      message: 'Internal server error'
    });
  }
};

const unacceptAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({
        error: 'Answer not found',
        message: 'The requested answer does not exist'
      });
    }

    const question = await Question.findById(answer.question);
    if (!question) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The question for this answer does not exist'
      });
    }

    const isQuestionOwner = question.author.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isQuestionOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only the question author can unaccept answers'
      });
    }

    await answer.unaccept();

    await answer.populate('author', 'username reputation avatar');

    res.json({
      message: 'Answer unaccepted successfully',
      answer
    });
  } catch (error) {
    console.error('Unaccept answer error:', error);
    res.status(500).json({
      error: 'Failed to unaccept answer',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createAnswer: [validate(answerSchemas.create), createAnswer],
  getAnswersByQuestion: [validate(paginationSchema), getAnswersByQuestion],
  updateAnswer: [validate(answerSchemas.update), updateAnswer],
  deleteAnswer,
  acceptAnswer,
  unacceptAnswer
}; 