import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/api';

export const dashboardService = {
  /**
   * Get meals for a specific date
   * @param {string} date - ISO date string e.g. "2025-05-13"
   * @returns {Promise} - meals data
   */
  getMeals: async (date) => {
    const response = await apiClient.post(API_ENDPOINTS.DASHBOARD.MEALS, { date });
    return response.data.data;
  },

  /**
   * Get calories intake for a specific date
   * @param {string} date - ISO date string
   * @returns {Promise} - { total_calories, target_calories }
   */
  getCaloriesIntake: async (date) => {
    const response = await apiClient.post(API_ENDPOINTS.DASHBOARD.CALORIES, { date });
    return response.data.data;
  },

  /**
   * Mark meals as done
   * @param {number[]} mealIds - array of meal planner IDs
   * @returns {Promise}
   */
  markMealsDone: async (mealIds) => {
    const response = await apiClient.post(API_ENDPOINTS.DASHBOARD.MARK_MEALS, {
      meal_ids: mealIds
    });
    return response.data.data;
  },

  /**
   * Get latest post from followed users
   * @returns {Promise} - post data or null
   */
  getLatestPost: async () => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.LATEST_POST);
    return response.data.data;
  }
};
