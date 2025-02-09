import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async ({ ingredients, dietaryPreference }) => {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(
        ","
      )}&diet=${dietaryPreference}&apiKey=c25e68c7db884ef0b1318aafc8ef8b0f`
    );
    return response.json();
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState: { recipes: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default recipeSlice.reducer;
