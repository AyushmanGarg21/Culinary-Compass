import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { masterService } from '../../../services/api/masterService';

export const fetchCountries = createAsyncThunk(
  'master/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      return await masterService.getCountries();
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch countries');
    }
  }
);

export const fetchCitiesByCountry = createAsyncThunk(
  'master/fetchCitiesByCountry',
  async (countryId, { rejectWithValue }) => {
    try {
      const cities = await masterService.getCitiesByCountry(countryId);
      return { countryId, cities };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch cities');
    }
  }
);

export const fetchIngredients = createAsyncThunk(
  'master/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      return await masterService.getIngredients();
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch ingredients');
    }
  }
);

const masterSlice = createSlice({
  name: 'master',
  initialState: {
    countries: [],
    // cities keyed by countryId for caching
    citiesByCountry: {},
    ingredients: [],
    loadingCountries: false,
    loadingCities: false,
    loadingIngredients: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loadingCountries = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loadingCountries = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loadingCountries = false;
        state.error = action.payload;
      })
      .addCase(fetchCitiesByCountry.pending, (state) => {
        state.loadingCities = true;
        state.error = null;
      })
      .addCase(fetchCitiesByCountry.fulfilled, (state, action) => {
        state.loadingCities = false;
        state.citiesByCountry[action.payload.countryId] = action.payload.cities;
      })
      .addCase(fetchCitiesByCountry.rejected, (state, action) => {
        state.loadingCities = false;
        state.error = action.payload;
      })
      .addCase(fetchIngredients.pending, (state) => {
        state.loadingIngredients = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loadingIngredients = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loadingIngredients = false;
        state.error = action.payload;
      });
  },
});

export default masterSlice.reducer;
