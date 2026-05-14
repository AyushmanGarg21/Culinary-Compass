import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/api';

export const masterService = {
  /**
   * Get all countries
   * @returns {Promise} - Array of { id, name, ... }
   */
  getCountries: async () => {
    const response = await apiClient.get(API_ENDPOINTS.MASTER.COUNTRIES);
    return response.data.data;
  },

  /**
   * Get cities for a specific country
   * @param {number|string} countryId
   * @returns {Promise} - Array of { id, name, ... }
   */
  getCitiesByCountry: async (countryId) => {
    const response = await apiClient.get(API_ENDPOINTS.MASTER.CITIES_BY_COUNTRY(countryId));
    return response.data.data;
  },

  /**
   * Get all ingredients
   * @returns {Promise} - Array of { id, name, emoji, ingredient_type, ... }
   */
  getIngredients: async () => {
    const response = await apiClient.get(API_ENDPOINTS.MASTER.INGREDIENTS);
    return response.data.data;
  },

  /**
   * Get ingredients filtered by type
   * @param {string} type - ingredient type/category
   * @returns {Promise} - Array of { id, name, emoji, ingredient_type, ... }
   */
  getIngredientsByType: async (type) => {
    const response = await apiClient.get(API_ENDPOINTS.MASTER.INGREDIENTS_BY_TYPE(type));
    return response.data.data;
  },

  /**
   * Get all master meals
   * @returns {Promise} - Array of meal objects
   */
  getMeals: async () => {
    const response = await apiClient.get(API_ENDPOINTS.MASTER.MEALS);
    return response.data.data;
  },

  /**
   * Get a single master meal by ID
   * @param {number|string} mealId
   * @returns {Promise} - meal object
   */
  getMealById: async (mealId) => {
    const response = await apiClient.get(API_ENDPOINTS.MASTER.MEAL_BY_ID(mealId));
    return response.data.data;
  },
};
