import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/api';

export const authService = {
  /**
   * Register a new user
   * @param {Object} data - { email, password, name?, phone_no? }
   * @returns {Promise} - { user, access_token, refresh_token, token_type }
   */
  signup: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, data);
    return response.data.data;
  },

  /**
   * Sign in a user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - { user, access_token, refresh_token, token_type }
   */
  signin: async (credentials) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGNIN, credentials);
    return response.data.data;
  },

  /**
   * Sign in an admin
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - { admin, access_token, refresh_token, token_type }
   */
  adminSignin: async (credentials) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.ADMIN_SIGNIN, credentials);
    return response.data.data;
  },

  /**
   * Logout current user
   * @returns {Promise} - { message }
   */
  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data.data;
  },

  /**
   * Get current user info
   * @returns {Promise} - User object
   */
  getCurrentUser: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data.data;
  },

  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise} - { access_token, token_type }
   */
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken
    });
    return response.data.data;
  },

  /**
   * Update current user profile
   * @param {Object} data - profile fields to update
   * @returns {Promise} - updated User object
   */
  updateProfile: async (data) => {
    const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
    return response.data.data;
  },

  /**
   * Upload profile picture
   * @param {File} file - image file
   * @returns {Promise} - updated User object
   */
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE_PROFILE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  }
};
