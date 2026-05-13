import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { masterService } from '../../../services/api/masterService';

export const fetchCountries = createAsyncThunk(
  'meta/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      const data = await masterService.getCountries();
      return data.countries ?? data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch countries');
    }
  }
);

export const fetchCities = createAsyncThunk(
  'meta/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const data = await masterService.getCities();
      return data.cities ?? data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch cities');
    }
  }
);

export const fetchMeals = createAsyncThunk(
  'meta/fetchMeals',
  async (_, { rejectWithValue }) => {
    try {
      const data = await masterService.getMeals();
      return data.meals ?? data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch meals');
    }
  }
);

export const fetchIngredients = createAsyncThunk(
  'meta/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await masterService.getIngredients();
      return data.ingredients ?? data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch ingredients');
    }
  }
);

const metaSlice = createSlice({
  name: 'meta',
  initialState: {
    countries: [],
    cities: [],
    meals: [],
    ingredients: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCountries.fulfilled, (state, action) => { state.loading = false; state.countries = action.payload; })
      .addCase(fetchCountries.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchCities.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCities.fulfilled, (state, action) => { state.loading = false; state.cities = action.payload; })
      .addCase(fetchCities.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchMeals.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMeals.fulfilled, (state, action) => { state.loading = false; state.meals = action.payload; })
      .addCase(fetchMeals.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchIngredients.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchIngredients.fulfilled, (state, action) => { state.loading = false; state.ingredients = action.payload; })
      .addCase(fetchIngredients.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default metaSlice.reducer;
