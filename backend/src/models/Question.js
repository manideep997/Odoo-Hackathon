const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 300,
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    authorUsername: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    views: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: Boolean,
        default: true
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
    answerCount: {
        type: Number,
        default: 0
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    closedAt: {
        type: Date,
        default: null
    },
    closedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    closedReason: {
        type: String,
        default: null
    }
}, {timestamps: true});

questionSchema.index({title: 'text', description: 'text'});
questionSchema.index({tags: 1});
questionSchema.index({author: 1});
questionSchema.index({createdAt: -1});
questionSchema.index({voteCount: -1});
questionSchema.index({views: 1});

questionSchema.virtual('slug').get(function() {
    return this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
});

questionSchema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
};

questionSchema.methods.updateVoteCount = function() {
    return this.model('Vote').aggregate([
        {$match: {question: this._id}},
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
    }else{
        this.upvotes = 0;
        this.downvotes = 0;
        this.voteCount = 0;
    }
    return this.save();
    });
};

questionSchema.methods.updateAnswerCount = function() {
    return this.model('Answer').countDocuments({
        question: this._id,
        isApproved: true
    }).then(count => {
        this.answerCount = count;
        return this.save();
    });
}

questionSchema.statics.findWithFilters = function(filters) {
    const query = {isApproved: true};

    if (filters.tag) {
        query.tags = {$in: [filters.tag.toLowerCase()]};
    }

    if (filters.author) {
        query.author = filters.author;
    }

    if (filters.search) {
        query.$text = {$search: filters.search};
    }

    const sortOptions = {};
    switch (filters.sort) {
        case 'votes':
            sortOptions.voteCount = -1;
            break;
        case 'views':
            sortOptions.views = -1;
            break;
        case 'answers':
            sortOptions.answerCount = -1;
            break;
        default:
            sortOptions.createdAt = -1;
    }

    return this.find(query)
     .sort(sortOptions)
     .populate('author', 'username reputation avatar')
     .skip(filters.skip || 0)
     .limit(filters.limit || 20);
};

questionSchema.pre('save', function(next) {
    if (this.isModified('author') &&  !this.authorUsername){
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

module.exports = mongoose.model('Question', questionSchema);