import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/api';

export const socialService = {
  /**
   * Get feed of posts from followed users
   * @param {number} skip
   * @param {number} limit
   * @returns {Promise} - { posts, total }
   */
  getFeed: async (skip = 0, limit = 10) => {
    const response = await apiClient.get(API_ENDPOINTS.SOCIAL.FEED, {
      params: { skip, limit }
    });
    return response.data.data;
  },

  /**
   * Get list of users the current user is following
   * @param {number} skip
   * @param {number} limit
   * @returns {Promise} - { following, total }
   */
  getFollowing: async (skip = 0, limit = 10) => {
    const response = await apiClient.get(API_ENDPOINTS.SOCIAL.FOLLOWING, {
      params: { skip, limit }
    });
    return response.data.data;
  },

  /**
   * Follow a user
   * @param {string} targetUserId
   * @returns {Promise}
   */
  followUser: async (targetUserId) => {
    const response = await apiClient.post(API_ENDPOINTS.SOCIAL.FOLLOW, {
      target_user_id: targetUserId
    });
    return response.data.data;
  },

  /**
   * Unfollow a user
   * @param {string} targetUserId
   * @returns {Promise}
   */
  unfollowUser: async (targetUserId) => {
    const response = await apiClient.post(API_ENDPOINTS.SOCIAL.UNFOLLOW, {
      target_user_id: targetUserId
    });
    return response.data.data;
  },

  /**
   * Search creators by name
   * @param {string} search
   * @param {number} skip
   * @param {number} limit
   * @returns {Promise} - { creators, total }
   */
  searchCreators: async (search = '', skip = 0, limit = 10) => {
    const response = await apiClient.get(API_ENDPOINTS.SOCIAL.SEARCH_CREATORS, {
      params: { search, skip, limit }
    });
    return response.data.data;
  },

  /**
   * Get creator details
   * @param {string} creatorId
   * @returns {Promise} - creator profile
   */
  getCreatorDetails: async (creatorId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.SOCIAL.CREATOR_DETAILS}/${creatorId}`
    );
    return response.data.data;
  }
};
