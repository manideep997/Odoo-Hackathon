const Question = require('../models/Question');
const Tag = require('../models/Tag');
const { validate, validateQuery, questionSchemas, paginationSchema, searchSchema } = require('../utils/validation');
const { sanitizeHtml } = require('../utils/validation');

const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const user = req.user;

    const sanitizedDescription = sanitizeHtml(description);

    const question = new Question({
      title,
      description: sanitizedDescription,
      author: user._id,
      authorUsername: user.username,
      tags: tags || []
    });

    await question.save();

    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        await Tag.findOrCreate(tagName, user._id);
      }
    }

    
    await question.populate('author', 'username reputation avatar');

    res.status(201).json({
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      error: 'Failed to create question',
      message: 'Internal server error'
    });
  }
};

const getQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'newest', q: search, tag, author } = req.query;
    const skip = (page - 1) * limit;

    const filters = {
      skip,
      limit: parseInt(limit),
      sort
    };

    if (search) filters.search = search;
    if (tag) filters.tag = tag;
    if (author) filters.author = author;

    const questions = await Question.findWithFilters(filters);

    const totalQuery = { isApproved: true };
    if (tag) totalQuery.tags = { $in: [tag.toLowerCase()] };
    if (author) totalQuery.author = author;
    if (search) totalQuery.$text = { $search: search };

    const total = await Question.countDocuments(totalQuery);

    res.json({
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      error: 'Failed to get questions',
      message: 'Internal server error'
    });
  }
};

const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const question = await Question.findById(id)
      .populate('author', 'username reputation avatar bio')
      .populate('closedBy', 'username');

    if (!question) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The requested question does not exist'
      });
    }

    if (!question.isApproved && (!user || user.role !== 'admin')) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The requested question does not exist'
      });
    }

    if (!user || (user._id.toString() !== question.author._id.toString() && user.role !== 'admin')) {
      await question.incrementViews();
    }

    res.json({
      question
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      error: 'Failed to get question',
      message: 'Internal server error'
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;
    const user = req.user;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The requested question does not exist'
      });
    }

    const isOwner = question.author.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only edit your own questions'
      });
    }

    const sanitizedDescription = description ? sanitizeHtml(description) : question.description;

    if (title) question.title = title;
    if (description) question.description = sanitizedDescription;
    if (tags) question.tags = tags;

    await question.save();

    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        await Tag.findOrCreate(tagName, user._id);
      }
    }

    await question.populate('author', 'username reputation avatar');

    res.json({
      message: 'Question updated successfully',
      question
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      error: 'Failed to update question',
      message: 'Internal server error'
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The requested question does not exist'
      });
    }

    const isOwner = question.author.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own questions'
      });
    }

    await question.remove();

    res.json({
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      error: 'Failed to delete question',
      message: 'Internal server error'
    });
  }
};

const closeQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const user = req.user;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The requested question does not exist'
      });
    }

    const isOwner = question.author.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only close your own questions'
      });
    }

    question.isClosed = true;
    question.closedAt = new Date();
    question.closedBy = user._id;
    question.closedReason = reason || null;

    await question.save();

    res.json({
      message: 'Question closed successfully',
      question
    });
  } catch (error) {
    console.error('Close question error:', error);
    res.status(500).json({
      error: 'Failed to close question',
      message: 'Internal server error'
    });
  }
};

const reopenQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The requested question does not exist'
      });
    }

    const isOwner = question.author.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only reopen your own questions'
      });
    }

    question.isClosed = false;
    question.closedAt = null;
    question.closedBy = null;
    question.closedReason = null;

    await question.save();

    res.json({
      message: 'Question reopened successfully',
      question
    });
  } catch (error) {
    console.error('Reopen question error:', error);
    res.status(500).json({
      error: 'Failed to reopen question',
      message: 'Internal server error'
    });
  }
};

const getUserQuestions = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const user = await require('../models/User').findOne({ username });
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    const questions = await Question.find({
      author: user._id,
      isApproved: true
    })
      .sort({ createdAt: -1 })
      .populate('author', 'username reputation avatar')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments({
      author: user._id,
      isApproved: true
    });

    res.json({
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user questions error:', error);
    res.status(500).json({
      error: 'Failed to get user questions',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createQuestion: [validate(questionSchemas.create), createQuestion],
  getQuestions: [validateQuery({ ...paginationSchema, ...searchSchema }), getQuestions],
  getQuestion,
  updateQuestion: [validate(questionSchemas.update), updateQuestion],
  deleteQuestion,
  closeQuestion,
  reopenQuestion,
  getUserQuestions
}; 