import apiClient from '../../utils/apiClient';

const MASTER = '/api/v1/master';

export const masterService = {
  getCountries: async (skip = 0, limit = 300) => {
    const response = await apiClient.get(`${MASTER}/countries`, {
      params: { skip, limit }
    });
    return response.data.data;
  },

  getCities: async (skip = 0, limit = 1000) => {
    const response = await apiClient.get(`${MASTER}/cities`, {
      params: { skip, limit }
    });
    return response.data.data;
  },

  getCitiesByCountry: async (countryId) => {
    const response = await apiClient.get(`${MASTER}/countries/${countryId}/cities`);
    return response.data.data;
  },

  getMeals: async (skip = 0, limit = 500) => {
    const response = await apiClient.get(`${MASTER}/meals`, {
      params: { skip, limit }
    });
    return response.data.data;
  },

  getIngredients: async (skip = 0, limit = 500) => {
    const response = await apiClient.get(`${MASTER}/ingredients`, {
      params: { skip, limit }
    });
    return response.data.data;
  }
};
