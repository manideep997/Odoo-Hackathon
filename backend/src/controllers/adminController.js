const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const { 
  createQuestionModerationNotification, 
  createAnswerModerationNotification,
  createUserModerationNotification 
} = require('../utils/notificationService');

const getAllQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'approved') {
      query.isApproved = true;
    }

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .populate('author', 'username email role')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments(query);

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
    console.error('Get all questions error:', error);
    res.status(500).json({
      error: 'Failed to get questions',
      message: 'Internal server error'
    });
  }
};

const approveQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = req.user;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The requested question does not exist'
      });
    }

    question.isApproved = true;
    await question.save();

    await createQuestionModerationNotification(
      question.author,
      question.title,
      question._id,
      true,
      admin.username
    );

    res.json({
      message: 'Question approved successfully',
      question
    });
  } catch (error) {
    console.error('Approve question error:', error);
    res.status(500).json({
      error: 'Failed to approve question',
      message: 'Internal server error'
    });
  }
};

const rejectQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const admin = req.user;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        error: 'Question not found',
        message: 'The requested question does not exist'
      });
    }

    question.isApproved = false;
    await question.save();

    await createQuestionModerationNotification(
      question.author,
      question.title,
      question._id,
      false,
      admin.username
    );

    res.json({
      message: 'Question rejected successfully',
      question
    });
  } catch (error) {
    console.error('Reject question error:', error);
    res.status(500).json({
      error: 'Failed to reject question',
      message: 'Internal server error'
    });
  }
};

const getAllAnswers = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'approved') {
      query.isApproved = true;
    }

    const answers = await Answer.find(query)
      .sort({ createdAt: -1 })
      .populate('author', 'username email role')
      .populate('question', 'title')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Answer.countDocuments(query);

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
    console.error('Get all answers error:', error);
    res.status(500).json({
      error: 'Failed to get answers',
      message: 'Internal server error'
    });
  }
};

const approveAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = req.user;

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({
        error: 'Answer not found',
        message: 'The requested answer does not exist'
      });
    }

    answer.isApproved = true;
    await answer.save();

    await createAnswerModerationNotification(
      answer.author,
      answer._id,
      answer.question,
      true,
      admin.username
    );

    res.json({
      message: 'Answer approved successfully',
      answer
    });
  } catch (error) {
    console.error('Approve answer error:', error);
    res.status(500).json({
      error: 'Failed to approve answer',
      message: 'Internal server error'
    });
  }
};

const rejectAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const admin = req.user;

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({
        error: 'Answer not found',
        message: 'The requested answer does not exist'
      });
    }

    answer.isApproved = false;
    await answer.save();

    await createAnswerModerationNotification(
      answer.author,
      answer._id,
      answer.question,
      false,
      admin.username
    );

    res.json({
      message: 'Answer rejected successfully',
      answer
    });
  } catch (error) {
    console.error('Reject answer error:', error);
    res.status(500).json({
      error: 'Failed to reject answer',
      message: 'Internal server error'
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role = 'all', status = 'all' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (role !== 'all') {
      query.role = role;
    }
    if (status === 'banned') {
      query.isBanned = true;
    } else if (status === 'active') {
      query.isBanned = false;
    }

    const users = await User.find(query)
      .select('-hashedPassword')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      error: 'Failed to get users',
      message: 'Internal server error'
    });
  }
};

const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const admin = req.user;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        error: 'Cannot ban admin',
        message: 'Cannot ban an administrator'
      });
    }

    user.isBanned = true;
    await user.save();

    await createUserModerationNotification(
      user._id,
      true,
      admin.username,
      reason
    );

    res.json({
      message: 'User banned successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({
      error: 'Failed to ban user',
      message: 'Internal server error'
    });
  }
};

const unbanUser = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = req.user;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    user.isBanned = false;
    await user.save();

    await createUserModerationNotification(
      user._id,
      false,
      admin.username
    );

    res.json({
      message: 'User unbanned successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({
      error: 'Failed to unban user',
      message: 'Internal server error'
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const admin = req.user;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'Role must be either "user" or "admin"'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'User role updated successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      error: 'Failed to update user role',
      message: 'Internal server error'
    });
  }
};

const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalQuestions,
      totalAnswers,
      totalVotes,
      bannedUsers,
      pendingQuestions,
      pendingAnswers
    ] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments(),
      Answer.countDocuments(),
      require('../models/Vote').countDocuments(),
      User.countDocuments({ isBanned: true }),
      Question.countDocuments({ isApproved: false }),
      Answer.countDocuments({ isApproved: false })
    ]);

    const recentQuestions = await Question.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'username');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email role createdAt');

    res.json({
      stats: {
        totalUsers,
        totalQuestions,
        totalAnswers,
        totalVotes,
        bannedUsers,
        pendingQuestions,
        pendingAnswers
      },
      recentActivity: {
        questions: recentQuestions,
        users: recentUsers
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: 'Internal server error'
    });
  }
};

const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const pendingQuestions = await Question.find({ isApproved: false })
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const pendingAnswers = await Answer.find({ isApproved: false })
      .populate('author', 'username email')
      .populate('question', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPending = await Question.countDocuments({ isApproved: false }) +
                        await Answer.countDocuments({ isApproved: false });

    res.json({
      reports: {
        pendingQuestions,
        pendingAnswers
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalPending,
        pages: Math.ceil(totalPending / limit)
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      error: 'Failed to get reports',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllQuestions,
  approveQuestion,
  rejectQuestion,
  getAllAnswers,
  approveAnswer,
  rejectAnswer,
  getAllUsers,
  banUser,
  unbanUser,
  updateUserRole,
  getStats,
  getReports
}; 