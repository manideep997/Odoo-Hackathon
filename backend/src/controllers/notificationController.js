const Notification = require('../models/Notification');
const { getUnreadCount, markAsRead, markAllAsRead } = require('../utils/notificationService');

const getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (page - 1) * limit;
    const user = req.user;

    const options = {
      skip,
      limit: parseInt(limit),
      unreadOnly: unreadOnly === 'true'
    };

    const notifications = await Notification.getUserNotifications(user._id, options);

    const total = await Notification.countDocuments({
      user: user._id,
      ...(unreadOnly === 'true' && { isRead: false })
    });

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      error: 'Failed to get notifications',
      message: 'Internal server error'
    });
  }
};

const getUnreadCountHandler = async (req, res) => {
  try {
    const user = req.user;
    const count = await getUnreadCount(user._id);

    res.json({
      unreadCount: count
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      error: 'Failed to get unread count',
      message: 'Internal server error'
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const notification = await markAsRead(id, user._id);
    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found',
        message: 'The requested notification does not exist'
      });
    }

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      error: 'Failed to mark notification as read',
      message: 'Internal server error'
    });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const user = req.user;
    await markAllAsRead(user._id);

    res.json({
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      error: 'Failed to mark all notifications as read',
      message: 'Internal server error'
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: user._id
    });

    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found',
        message: 'The requested notification does not exist'
      });
    }

    res.json({
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      error: 'Failed to delete notification',
      message: 'Internal server error'
    });
  }
};

const getNotificationStats = async (req, res) => {
  try {
    const user = req.user;

    const stats = await Notification.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unreadCount: {
            $sum: { $cond: ['$isRead', 0, 1] }
          }
        }
      }
    ]);

    const totalNotifications = await Notification.countDocuments({ user: user._id });
    const totalUnread = await Notification.countDocuments({ user: user._id, isRead: false });

    const typeStats = {};
    stats.forEach(stat => {
      typeStats[stat._id] = {
        total: stat.count,
        unread: stat.unreadCount
      };
    });

    res.json({
      total: totalNotifications,
      unread: totalUnread,
      byType: typeStats
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      error: 'Failed to get notification statistics',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getNotifications: getUserNotifications,
  getUnreadCount: getUnreadCountHandler,
  markAsRead: markNotificationAsRead,
  markAllAsRead: markAllNotificationsAsRead,
  deleteNotification,
  getNotificationStats
}; 