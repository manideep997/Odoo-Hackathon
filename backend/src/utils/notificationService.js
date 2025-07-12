const Notification = require('../models/Notification');
const User = require('../models/User');

const extractMentions = (content) => {
    const mentionPattern = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionPattern.exec(content)) !== null) {
      mentions.push(match[1]);
    }
    
    return [...new Set(mentions)]; // Remove duplicates
};

const createMentionNotifications = async (content, fromUserId, fromUsername, relatedQuestionId, relatedAnswerId) => {
    try {
      const mentions = extractMentions(content);
      
      for (const mentionedUsername of mentions) {
        const mentionedUser = await User.findOne({ username: mentionedUsername });
        
        if (mentionedUser && mentionedUser._id.toString() !== fromUserId.toString()) {
          await Notification.createNotification({
            userId: mentionedUser._id,
            type: 'mention',
            message: `${fromUsername} mentioned you in a ${relatedAnswerId ? 'comment' : 'question'}`,
            relatedQuestionId,
            relatedAnswerId,
            fromUserId,
            fromUsername
          });
        }
      }
    } catch (error) {
      console.error('Error creating mention notifications:', error);
    }
};

const createAnswerNotification = async (questionAuthorId, answerAuthorId, answerAuthorUsername, questionTitle, questionId, answerId) => {
    try {
      if (questionAuthorId.toString() !== answerAuthorId.toString()) {
        await Notification.createNotification({
          userId: questionAuthorId,
          type: 'answer_to_question',
          message: `${answerAuthorUsername} answered your question: "${questionTitle}"`,
          relatedQuestionId: questionId,
          relatedAnswerId: answerId,
          fromUserId: answerAuthorId,
          fromUsername: answerAuthorUsername
        });
      }
    } catch (error) {
      console.error('Error creating answer notification:', error);
    }
};

const createVoteNotification = async (answerAuthorId, voterId, voterUsername, answerId, questionId, voteType) => {
    try {
      if (answerAuthorId.toString() !== voterId.toString()) {
        const voteAction = voteType === 'upvote' ? 'upvoted' : 'downvoted';
        
        await Notification.createNotification({
          userId: answerAuthorId,
          type: 'vote_on_answer',
          message: `${voterUsername} ${voteAction} your answer`,
          relatedQuestionId: questionId,
          relatedAnswerId: answerId,
          fromUserId: voterId,
          fromUsername: voterUsername,
          metadata: { voteType }
        });
      }
    } catch (error) {
      console.error('Error creating vote notification:', error);
    }
};

const createQuestionModerationNotification = async (questionAuthorId, questionTitle, questionId, isApproved, moderatorUsername) => {
    try {
      const action = isApproved ? 'approved' : 'rejected';
      
      await Notification.createNotification({
        userId: questionAuthorId,
        type: isApproved ? 'question_approved' : 'question_rejected',
        message: `Your question "${questionTitle}" has been ${action} by ${moderatorUsername}`,
        relatedQuestionId: questionId,
        fromUsername: moderatorUsername,
        metadata: { action }
      });
    } catch (error) {
      console.error('Error creating question moderation notification:', error);
    }
};

const createAnswerModerationNotification = async (answerAuthorId, answerId, questionId, isApproved, moderatorUsername) => {
    try {
      const action = isApproved ? 'approved' : 'rejected';
      
      await Notification.createNotification({
        userId: answerAuthorId,
        type: isApproved ? 'answer_approved' : 'answer_rejected',
        message: `Your answer has been ${action} by ${moderatorUsername}`,
        relatedQuestionId: questionId,
        relatedAnswerId: answerId,
        fromUsername: moderatorUsername,
        metadata: { action }
      });
    } catch (error) {
      console.error('Error creating answer moderation notification:', error);
    }
};

const createUserModerationNotification = async (userId, isBanned, moderatorUsername, reason = null) => {
    try {
      const action = isBanned ? 'banned' : 'unbanned';
      
      await Notification.createNotification({
        userId,
        type: isBanned ? 'user_banned' : 'user_unbanned',
        message: `Your account has been ${action} by ${moderatorUsername}${reason ? `: ${reason}` : ''}`,
        fromUsername: moderatorUsername,
        metadata: { action, reason }
      });
    } catch (error) {
      console.error('Error creating user moderation notification:', error);
    }
};

const getUnreadCount = async (userId) => {
    try {
      return await Notification.getUnreadCount(userId);
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
};

const markAsRead = async (notificationId, userId) => {
    try {
      return await Notification.markAsRead(notificationId, userId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
};

const markAllAsRead = async (userId) => {
    try {
      return await Notification.markAllAsRead(userId);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
};

const cleanupOldNotifications = async (daysOld = 30) => {
    try {
      const result = await Notification.deleteOldNotifications(daysOld);
      console.log(`Cleaned up ${result.deletedCount} old notifications`);
      return result;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      throw error;
    }
};

module.exports = {
    extractMentions,
    createMentionNotifications,
    createAnswerNotification,
    createVoteNotification,
    createQuestionModerationNotification,
    createAnswerModerationNotification,
    createUserModerationNotification,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    cleanupOldNotifications
}; 