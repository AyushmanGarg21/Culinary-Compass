import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/api';

export const messagesService = {
  // ─── User ↔ User ────────────────────────────────────────────────────────────

  /**
   * Get all conversations for the current user
   * @returns {Promise} - { conversations }
   */
  getConversations: async () => {
    const response = await apiClient.get(API_ENDPOINTS.MESSAGES.CONVERSATIONS);
    return response.data.data;
  },

  /**
   * Get messages for a specific conversation
   * @param {string} creatorId
   * @param {number} skip
   * @param {number} limit
   * @returns {Promise} - messages data
   */
  getMessages: async (creatorId, skip = 0, limit = 50) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.MESSAGES.CONVERSATION}/${creatorId}`,
      { params: { skip, limit } }
    );
    return response.data.data;
  },

  /**
   * Send a message to another user
   * @param {string} receiverId
   * @param {string} content
   * @returns {Promise} - sent message data
   */
  sendMessage: async (receiverId, content) => {
    const response = await apiClient.post(API_ENDPOINTS.MESSAGES.SEND, {
      receiver_id: receiverId,
      content
    });
    return response.data.data;
  },

  /**
   * Mark all messages in a conversation as read
   * @param {string} creatorId
   * @returns {Promise}
   */
  markAsRead: async (creatorId) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.MESSAGES.MARK_READ}/${creatorId}`
    );
    return response.data.data;
  },

  // ─── User ↔ Admin ────────────────────────────────────────────────────────────

  /**
   * Get messages between user and admin
   * @param {number} skip
   * @param {number} limit
   * @returns {Promise} - messages data
   */
  getAdminMessages: async (skip = 0, limit = 50) => {
    const response = await apiClient.get(API_ENDPOINTS.MESSAGES.ADMIN_MESSAGES, {
      params: { skip, limit }
    });
    return response.data.data;
  },

  /**
   * Send a message to admin
   * @param {string} content
   * @returns {Promise} - sent message data
   */
  sendMessageToAdmin: async (content) => {
    const response = await apiClient.post(API_ENDPOINTS.MESSAGES.ADMIN_SEND, {
      content
    });
    return response.data.data;
  },

  /**
   * Get count of unread admin messages
   * @returns {Promise} - { unread_count }
   */
  getAdminUnreadCount: async () => {
    const response = await apiClient.get(API_ENDPOINTS.MESSAGES.ADMIN_UNREAD);
    return response.data.data;
  }
};
