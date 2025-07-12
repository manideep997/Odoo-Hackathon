const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'answer_to_question',
      'mention',
      'comment_on_answer',
      'vote_on_answer',
      'question_approved',
      'question_rejected',
      'answer_approved',
      'answer_rejected',
      'user_banned',
      'user_unbanned'
    ],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedQuestion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    default: null
  },
  relatedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    default: null
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  fromUsername: {
    type: String,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ type: 1 });

notificationSchema.statics.createNotification = function(data) {
    return this.create({
      user: data.userId,
      type: data.type,
      message: data.message,
      relatedQuestion: data.relatedQuestionId || null,
      relatedAnswer: data.relatedAnswerId || null,
      fromUser: data.fromUserId || null,
      fromUsername: data.fromUsername || null,
      metadata: data.metadata || {}
    });
};

notificationSchema.statics.getUserNotifications = function(userId, options = {}) {
    const query = { user: userId };
    
    if (options.unreadOnly) {
      query.isRead = false;
    }
    
    if (options.type) {
      query.type = options.type;
    }
    
    return this.find(query)
      .sort({ createdAt: -1 })
      .populate('relatedQuestion', 'title')
      .populate('relatedAnswer', 'content')
      .populate('fromUser', 'username avatar')
      .skip(options.skip || 0)
      .limit(options.limit || 20);
};

notificationSchema.statics.markAsRead = function(notificationId, userId) {
    return this.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );
};

notificationSchema.statics.markAllAsRead = function(userId) {
    return this.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );
};

notificationSchema.statics.getUnreadCount = function(userId) {
    return this.countDocuments({ user: userId, isRead: false });
};

notificationSchema.statics.deleteOldNotifications = function(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    return this.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true
    });
};

notificationSchema.methods.markAsRead = function() {
    this.isRead = true;
    return this.save();
};

notificationSchema.pre('save', function(next) {
    if (this.isModified('fromUser') && !this.fromUsername && this.fromUser) {
      this.model('User').findById(this.fromUser)
        .then(user => {
          if (user) {
            this.fromUsername = user.username;
          }
          next();
        })
        .catch(next);
    } else {
      next();
    }
  });
  
  module.exports = mongoose.model('Notification', notificationSchema); 