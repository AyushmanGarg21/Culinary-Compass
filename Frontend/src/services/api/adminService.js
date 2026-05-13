import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/api';

export const adminService = {
  // ─── Manage Users & Creators ─────────────────────────────────────────────────

  /**
   * Get list of users
   * @param {string} search
   * @param {number} skip
   * @param {number} limit
   * @returns {Promise} - { users, total }
   */
  getUsers: async (search = '', skip = 0, limit = 100) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS, {
      params: { search, skip, limit }
    });
    return response.data.data;
  },

  /**
   * Get list of creators
   * @param {string} search
   * @param {number} skip
   * @param {number} limit
   * @returns {Promise} - { creators, total }
   */
  getCreators: async (search = '', skip = 0, limit = 100) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.CREATORS, {
      params: { search, skip, limit }
    });
    return response.data.data;
  },

  /**
   * Deactivate a user
   * @param {string} userId
   * @returns {Promise}
   */
  deactivateUser: async (userId) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ADMIN.DEACTIVATE_USER}/${userId}/deactivate`
    );
    return response.data.data;
  },

  /**
   * Activate a user
   * @param {string} userId
   * @returns {Promise}
   */
  activateUser: async (userId) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ADMIN.ACTIVATE_USER}/${userId}/activate`
    );
    return response.data.data;
  },

  /**
   * Delete a user
   * @param {string} userId
   * @returns {Promise}
   */
  deleteUser: async (userId) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.ADMIN.DELETE_USER}/${userId}`
    );
    return response.data.data;
  },

  /**
   * Remove creator status from a user
   * @param {string} userId
   * @returns {Promise}
   */
  removeCreatorStatus: async (userId) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ADMIN.REMOVE_CREATOR_STATUS}/${userId}/remove-creator-status`
    );
    return response.data.data;
  },

  // ─── Creator Requests ─────────────────────────────────────────────────────────

  /**
   * Get creator requests
   * @param {string} statusFilter - 'PENDING' | 'APPROVED' | 'REJECTED' | null
   * @param {number} skip
   * @param {number} limit
   * @returns {Promise} - { requests, total }
   */
  getCreatorRequests: async (statusFilter = 'PENDING', skip = 0, limit = 100) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.CREATOR_REQUESTS, {
      params: { status_filter: statusFilter, skip, limit }
    });
    return response.data.data;
  },

  /**
   * Approve a creator request
   * @param {number} requestId
   * @param {string} comments
   * @returns {Promise}
   */
  approveCreatorRequest: async (requestId, comments = '') => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ADMIN.APPROVE_CREATOR}/${requestId}/approve`,
      { comments }
    );
    return response.data.data;
  },

  /**
   * Reject a creator request
   * @param {number} requestId
   * @param {string} comments
   * @returns {Promise}
   */
  rejectCreatorRequest: async (requestId, comments = '') => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ADMIN.REJECT_CREATOR}/${requestId}/reject`,
      { comments }
    );
    return response.data.data;
  },

  // ─── Post Requests ────────────────────────────────────────────────────────────

  /**
   * Get post requests
   * @param {string} statusFilter - 'PENDING' | 'APPROVED' | 'REJECTED' | null
   * @param {number} skip
   * @param {number} limit
   * @returns {Promise} - { posts, total }
   */
  getPostRequests: async (statusFilter = 'PENDING', skip = 0, limit = 100) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.POST_REQUESTS, {
      params: { status_filter: statusFilter, skip, limit }
    });
    return response.data.data;
  },

  /**
   * Approve a post request
   * @param {number} postId
   * @param {string} comments
   * @returns {Promise}
   */
  approvePostRequest: async (postId, comments = '') => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ADMIN.APPROVE_POST}/${postId}/approve`,
      { comments }
    );
    return response.data.data;
  },

  /**
   * Reject a post request
   * @param {number} postId
   * @param {string} comments
   * @returns {Promise}
   */
  rejectPostRequest: async (postId, comments = '') => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ADMIN.REJECT_POST}/${postId}/reject`,
      { comments }
    );
    return response.data.data;
  },

  // ─── Admin Messages ───────────────────────────────────────────────────────────

  /**
   * Get all conversations (admin side)
   * @returns {Promise} - { conversations }
   */
  getConversations: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ADMIN_MESSAGES);
    return response.data.data;
  },

  /**
   * Get messages with a specific user (admin side)
   * @param {string} userId
   * @param {number} skip
   * @param {number} limit
   * @returns {Promise}
   */
  getMessagesWithUser: async (userId, skip = 0, limit = 50) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.ADMIN.ADMIN_MESSAGES.replace('/conversations', '')}/conversation/${userId}`,
      { params: { skip, limit } }
    );
    return response.data.data;
  },

  /**
   * Send a message to a user (admin side)
   * @param {string} userId
   * @param {string} content
   * @returns {Promise}
   */
  sendMessage: async (userId, content) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ADMIN.ADMIN_SEND_MESSAGE}/${userId}`,
      { content }
    );
    return response.data.data;
  },

  /**
   * Get total unread message count (admin side)
   * @returns {Promise} - { unread_count }
   */
  getUnreadCount: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ADMIN_UNREAD_COUNT);
    return response.data.data;
  },

  /**
   * Mark messages from a user as read (admin side)
   * @param {string} userId
   * @returns {Promise}
   */
  markAsRead: async (userId) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ADMIN.ADMIN_MARK_READ}/${userId}`
    );
    return response.data.data;
  }
};
