const mongoose = require('mongoose');
const { getDefaultHighWaterMark } = require('stream');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 2,
        maxlength: 30,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 300,
        default: ''
    },
    questionCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {timestamps: true});

tagSchema.index({ name: 1 });
tagSchema.index({ questionCount: -1 });
tagSchema.index({ isActive: 1 });

tagSchema.virtual('display_name').get(function() {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
});

tagSchema.statics.findOrCreate = function(tagName, userID = null) {
    return this.findOne({name: tagName.toLowerCase()})
    .then(tag => {
        if (tag) {
            return tag;
        }
        return this.create({
            name: tagName.toLowerCase(),
            createdBy: userID,
        });
    });
};

tagSchema.statics.getPopularTags = function(limit = 20) {
    return this.find({isActive: true})
     .sort({questionCount: -1})
     .limit(limit)
     .select('name description questionCount');
};

tagSchema.statics.searchTags = function(searchTerm, limit = 10) {
    return this.find({
        name: { $regex: searchTerm, $options: 'i' },
        isActive: true
    })
    .sort({questionCount: -1})
    .limit(limit)
    .select('name description questionCount');
};

tagSchema.statics.updateQuestionCount = function(tagName) {
    return this.model('Question').countDocuments({
        tags: tagName.toLowerCase(),
        isApproved: true
    }).then(count => {
        return this.findOneAndUpdate(
            {name: tagName.toLowerCase()},
            {questionCount: count},
            {new: true}
        );
    });
}

tagSchema.statics.updateAllQuestionCounts = function() {
    return this.find({isActive: true}).then(tags => {
        const updatePromises = tags.map(tag => {
            return this.updateQuestionCount(tag.name);
        });
        return Promise.all(updatePromises);
    });
};

tagSchema.methods.incrementQuestionCount = function() {
    this.questionCount += 1;
    return this.save();
};

tagSchema.methods.decrementQuestionCount = function() {
    this.questionCount = Math.max(0, this.questionCount - 1);
    return this.save();
};

tagSchema.pre('save', function(next) {
    if (this.isModified('name')){
        this.name = this.name.toLowerCase();
    }
    next();
});

tagSchema.post('save', function(){
    if (this.isModified('name')){
        this.constructor.updateQuestionCount(this.name);
    }
});

module.exports = mongoose.model('Tag', tagSchema);