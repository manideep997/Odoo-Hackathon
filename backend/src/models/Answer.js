const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    content: {
        type: String,
        required: true,
        minlength: 10
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorUsername: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: true
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    acceptedAt: {
        type: Date,
        default: null
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    voteCount: {
        type: Number,
        default: 0
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
}, {timestamps: true});

answerSchema.index({question: 1, voteCount: -1});
answerSchema.index({author: 1});
answerSchema.index({createdAt: -1});
answerSchema.index({isAccepted: 1});

answerSchema.methods.updateVoteCount = function() {
    return this.model('Vote').aggregate([
        {$match: {answer: this._id}},
        {
            $group: {
                _id: null,
                upvotes: {$sum: {$cond: [{$eq: ['voteType', 'upvote']}, 1, 0]}},
                downvotes: {$sum: {$cond: [{$eq: ['voteType', 'downvote']}, 1, 0]}},
            }
        }
    ]).then(result => {
        if (result.length > 0) {
            this.upvotes = result[0].upvotes;
            this.downvotes = result[0].downvotes;
            this.voteCount = this.upvotes - this.downvotes;
        } else {
        this.upvotes = 0;
        this.downvotes = 0;
        this.voteCount = 0;
        }
        return this.save();
    });
};

answerSchema.methods.updateCommentCount = function() {
    return this.model('Comment').countDocuments({ 
      answer: this._id, 
      isApproved: true 
    }).then(count => {
      this.commentCount = count;
      return this.save();
    });
};

answerSchema.methods.accept = function(userId) {
    this.isAccepted = true;
    this.acceptedAt = new Date();
    this.acceptedBy = userId;
    return this.save();
};

answerSchema.methods.unaccept = function() {
    this.isAccepted = false;
    this.acceptedAt = null;
    this.acceptedBy = null;
    return this.save();
};

answerSchema.statics.findByQuestion = function(questionId, options = {}) {
    const query = { 
      question: questionId, 
      isApproved: true 
    };
    
    const sortOptions = {};
    switch (options.sort) {
      case 'votes':
        sortOptions.voteCount = -1;
        break;
      case 'oldest':
        sortOptions.createdAt = 1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      default:
        // Default: accepted answers first, then by votes
        sortOptions.isAccepted = -1;
        sortOptions.voteCount = -1;
    }
  
    return this.find(query)
      .sort(sortOptions)
      .populate('author', 'username reputation avatar')
      .populate('acceptedBy', 'username')
      .skip(options.skip || 0)
      .limit(options.limit || 10);
};

answerSchema.pre('save', function(next) {
    if (this.isModified('author') && !this.authorUsername) {
      this.model('User').findById(this.author)
        .then(user => {
          if (user) {
            this.authorUsername = user.username;
          }
          next();
        })
        .catch(next);
    } else {
      next();
    }
});

answerSchema.post('save', function() {
    this.model('Question').findById(this.question)
      .then(question => {
        if (question) {
          question.updateAnswerCount();
        }
      })
      .catch(err => console.error('Error updating question answer count:', err));
});

answerSchema.post('remove', function() {
    this.model('Question').findById(this.question)
      .then(question => {
        if (question) {
          question.updateAnswerCount();
        }
      })
      .catch(err => console.error('Error updating question answer count:', err));
});

module.exports = mongoose.model('Answer', answerSchema);