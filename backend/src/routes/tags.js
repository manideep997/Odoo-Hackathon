const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', tagController.getTags);
router.get('/popular', tagController.getPopularTags);
router.get('/search', tagController.searchTags);

router.post('/', authenticateToken, requireAdmin, tagController.createTag);
router.put('/:id', authenticateToken, requireAdmin, tagController.updateTag);
router.delete('/:id', authenticateToken, requireAdmin, tagController.deleteTag);

module.exports = router; 