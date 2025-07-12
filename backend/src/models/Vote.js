const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  voteType: {
    type: String,
    enum: ['upvote', 'downvote'],
    required: true
  }
}, {timestamps: true});

voteSchema.index({ user: 1, answer: 1 }, { unique: true });
voteSchema.index({ answer: 1 });
voteSchema.index({ question: 1 });

voteSchema.statics.findByUserAndAnswer = function(userId, answerId) {
    return this.findOne({ user: userId, answer: answerId });
};

voteSchema.statics.getVoteCounts = function(answerId) {
    return this.aggregate([
      { $match: { answer: answerId } },
      {
        $group: {
          _id: null,
          upvotes: { $sum: { $cond: [{ $eq: ['$voteType', 'upvote'] }, 1, 0] } },
          downvotes: { $sum: { $cond: [{ $eq: ['$voteType', 'downvote'] }, 1, 0] } }
        }
      }
    ]);
};

voteSchema.statics.createOrUpdateVote = function(userId, answerId, questionId, voteType) {
    return this.findOneAndUpdate(
      { user: userId, answer: answerId },
      { 
        user: userId, 
        answer: answerId, 
        question: questionId, 
        voteType: voteType 
      },
      { upsert: true, new: true }
    );
};

voteSchema.statics.removeVote = function(userId, answerId) {
    return this.findOneAndDelete({ user: userId, answer: answerId });
};

voteSchema.statics.getUserVotesForAnswers = function(userId, answerIds) {
    return this.find({
      user: userId,
      answer: { $in: answerIds }
    }).lean();
};

voteSchema.statics.getUserVotesForQuestion = function(userId, questionId) {
    return this.find({
      user: userId,
      question: questionId
    }).populate('answer', 'id');
  };
  
  module.exports = mongoose.model('Vote', voteSchema); 