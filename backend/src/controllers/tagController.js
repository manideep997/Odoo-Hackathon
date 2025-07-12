const Tag = require('../models/Tag');
const { validate, tagSchemas } = require('../utils/validation');

const getTags = async (req, res) => {
    try {
      const { page = 1, limit = 50 } = req.query;
      const skip = (page - 1) * limit;
  
      const tags = await Tag.find({ isActive: true })
        .sort({ questionCount: -1, name: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('name description questionCount');
  
      const total = await Tag.countDocuments({ isActive: true });
  
      res.json({
        tags,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get tags error:', error);
      res.status(500).json({
        error: 'Failed to get tags',
        message: 'Internal server error'
      });
    }
};

const getPopularTags = async (req, res) => {
    try {
      const { limit = 20 } = req.query;
  
      const tags = await Tag.getPopularTags(parseInt(limit));
  
      res.json({
        tags
      });
    } catch (error) {
      console.error('Get popular tags error:', error);
      res.status(500).json({
        error: 'Failed to get popular tags',
        message: 'Internal server error'
      });
    }
};

const searchTags = async (req, res) => {
    try {
      const { q: searchTerm, limit = 10 } = req.query;
  
      if (!searchTerm || searchTerm.trim().length === 0) {
        return res.status(400).json({
          error: 'Search term required',
          message: 'Please provide a search term'
        });
      }
  
      const tags = await Tag.searchTags(searchTerm.trim(), parseInt(limit));
  
      res.json({
        tags
      });
    } catch (error) {
      console.error('Search tags error:', error);
      res.status(500).json({
        error: 'Failed to search tags',
        message: 'Internal server error'
      });
    }
};

const createTag = async (req, res) => {
    try {
      const { name, description } = req.body;
  
      const existingTag = await Tag.findOne({ name: name.toLowerCase() });
      if (existingTag) {
        return res.status(400).json({
          error: 'Tag already exists',
          message: 'A tag with this name already exists'
        });
      }
  
      const tag = new Tag({
        name,
        description,
        createdBy: req.user._id
      });
  
      await tag.save();
  
      res.status(201).json({
        message: 'Tag created successfully',
        tag
      });
    } catch (error) {
      console.error('Create tag error:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({
          error: 'Tag already exists',
          message: 'A tag with this name already exists'
        });
      }
  
      res.status(500).json({
        error: 'Failed to create tag',
        message: 'Internal server error'
      });
    }
};

const updateTag = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, isActive } = req.body;
  
      const tag = await Tag.findById(id);
      if (!tag) {
        return res.status(404).json({
          error: 'Tag not found',
          message: 'The requested tag does not exist'
        });
      }
  
      if (name !== undefined) tag.name = name;
      if (description !== undefined) tag.description = description;
      if (isActive !== undefined) tag.isActive = isActive;
  
      await tag.save();
  
      res.json({
        message: 'Tag updated successfully',
        tag
      });
    } catch (error) {
      console.error('Update tag error:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({
          error: 'Tag name already exists',
          message: 'A tag with this name already exists'
        });
      }
  
      res.status(500).json({
        error: 'Failed to update tag',
        message: 'Internal server error'
      });
    }
};
  
const deleteTag = async (req, res) => {
    try {
      const { id } = req.params;
  
      const tag = await Tag.findById(id);
      if (!tag) {
        return res.status(404).json({
          error: 'Tag not found',
          message: 'The requested tag does not exist'
        });
      }
  
      const questionCount = await require('../models/Question').countDocuments({
        tags: tag.name,
        isApproved: true
      });
  
      if (questionCount > 0) {
        return res.status(400).json({
          error: 'Cannot delete tag',
          message: `This tag is used by ${questionCount} questions. Consider deactivating it instead.`
        });
      }
  
      await tag.remove();
  
      res.json({
        message: 'Tag deleted successfully'
      });
    } catch (error) {
      console.error('Delete tag error:', error);
      res.status(500).json({
        error: 'Failed to delete tag',
        message: 'Internal server error'
      });
    }
};
  
const getTagStats = async (req, res) => {
    try {
      const stats = await Tag.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalTags: { $sum: 1 },
            totalQuestions: { $sum: '$questionCount' },
            avgQuestionsPerTag: { $avg: '$questionCount' }
          }
        }
      ]);
  
      const topTags = await Tag.find({ isActive: true })
        .sort({ questionCount: -1 })
        .limit(10)
        .select('name questionCount');
  
      res.json({
        stats: stats[0] || { totalTags: 0, totalQuestions: 0, avgQuestionsPerTag: 0 },
        topTags
      });
    } catch (error) {
      console.error('Get tag stats error:', error);
      res.status(500).json({
        error: 'Failed to get tag statistics',
        message: 'Internal server error'
      });
    }
};
  
  module.exports = {
    getTags,
    getPopularTags,
    searchTags,
    createTag: [validate(tagSchemas.create), createTag],
    updateTag,
    deleteTag,
    getTagStats
}; 