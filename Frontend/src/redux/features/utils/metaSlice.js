import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Use local JSON files as simulation/fallback for metadata
import countriesData from '../../../../src/data/countries.json';
import citiesData from '../../../../src/data/cities.json';
import mealsData from '../../../../src/data/meals.json';
import ingredientsData from '../../../../src/data/ingredients.json';

// Helper to simulate network delay
const simulateFetch = (data, delay = 300) => new Promise((resolve) => setTimeout(() => resolve(data), delay));

export const fetchCountries = createAsyncThunk('meta/fetchCountries', async () => {
  return await simulateFetch(countriesData, 200);
});

export const fetchCities = createAsyncThunk('meta/fetchCities', async () => {
  return await simulateFetch(citiesData, 200);
});

export const fetchMeals = createAsyncThunk('meta/fetchMeals', async () => {
  return await simulateFetch(mealsData, 200);
});

export const fetchIngredients = createAsyncThunk('meta/fetchIngredients', async () => {
  return await simulateFetch(ingredientsData, 200);
});

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
      .addCase(fetchCountries.pending, (state) => { state.loading = true; })
      .addCase(fetchCountries.fulfilled, (state, action) => { state.loading = false; state.countries = action.payload; })
      .addCase(fetchCountries.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(fetchCities.pending, (state) => { state.loading = true; })
      .addCase(fetchCities.fulfilled, (state, action) => { state.loading = false; state.cities = action.payload; })
      .addCase(fetchCities.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(fetchMeals.pending, (state) => { state.loading = true; })
      .addCase(fetchMeals.fulfilled, (state, action) => { state.loading = false; state.meals = action.payload; })
      .addCase(fetchMeals.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(fetchIngredients.pending, (state) => { state.loading = true; })
      .addCase(fetchIngredients.fulfilled, (state, action) => { state.loading = false; state.ingredients = action.payload; })
      .addCase(fetchIngredients.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  }
});

export default metaSlice.reducer;
