import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from '../../../services/api/dashboardService';
import { authService } from '../../../services/api/authService';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchUserProfile = createAsyncThunk(
  'dashboard/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch profile');
    }
  }
);

export const fetchTodaysMeals = createAsyncThunk(
  'dashboard/fetchTodaysMeals',
  async (date, { rejectWithValue }) => {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      return await dashboardService.getMeals(targetDate);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch meals');
    }
  }
);

export const fetchTopPosts = createAsyncThunk(
  'dashboard/fetchTopPosts',
  async (_, { rejectWithValue }) => {
    try {
      const post = await dashboardService.getLatestPost();
      // Backend returns a single latest post; wrap in array for UI compatibility
      return post ? [post] : [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch posts');
    }
  }
);

export const saveMealCompletions = createAsyncThunk(
  'dashboard/saveMealCompletions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const completedIds = state.dashboard.todaysMeals
        .filter((m) => m.completed)
        .map((m) => m.id);

      return await dashboardService.markMealsDone(completedIds);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to save meal completions');
    }
  }
);

export const toggleMealCompletion = createAsyncThunk(
  'dashboard/toggleMealCompletion',
  async ({ mealId, completed }) => {
    // Optimistic update — actual persistence happens via saveMealCompletions
    return { mealId, completed };
  }
);

export const fetchCaloriesForDate = createAsyncThunk(
  'dashboard/fetchCaloriesForDate',
  async (date, { rejectWithValue }) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      if (date === today) {
        throw new Error("Today's calories are calculated from meals, not fetched");
      }
      const data = await dashboardService.getCaloriesIntake(date);
      return { date, calories: data.total_calories ?? 0 };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

export const updateCalorieTarget = createAsyncThunk(
  'dashboard/updateCalorieTarget',
  async (target) => target
);

export const syncWithMealPlanner = createAsyncThunk(
  'dashboard/syncWithMealPlanner',
  async (_, { rejectWithValue }) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      return await dashboardService.getMeals(today);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to sync meal planner');
    }
  }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  user: null,
  todaysMeals: [],
  topPosts: [],
  timeOfDay: getTimeOfDay(),
  calorieTarget: 2000,
  consumedCalories: 0,
  selectedDate: new Date().toISOString().split('T')[0],
  calorieHistory: {},
  loading: false,
  saving: false,
  error: null,
  lastSaved: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateTimeOfDay: (state) => {
      state.timeOfDay = getTimeOfDay();
    },
    toggleMealCompletionLocal: (state, action) => {
      const { mealId } = action.payload;
      const meal = state.todaysMeals.find((m) => m.id === mealId);
      if (meal) {
        const wasCompleted = meal.completed;
        meal.completed = !meal.completed;
        if (meal.completed && !wasCompleted) {
          state.consumedCalories += meal.meal?.calories ?? 0;
        } else if (!meal.completed && wasCompleted) {
          state.consumedCalories -= meal.meal?.calories ?? 0;
        }
      }
    },
    setCalorieTarget: (state, action) => {
      state.calorieTarget = action.payload;
    },
    calculateConsumedCalories: (state) => {
      const today = new Date().toISOString().split('T')[0];
      if (state.selectedDate === today) {
        state.consumedCalories = state.todaysMeals
          .filter((m) => m.completed)
          .reduce((total, m) => total + (m.meal?.calories ?? 0), 0);
      }
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    navigateDate: (state, action) => {
      const currentDate = new Date(state.selectedDate);
      const today = new Date().toISOString().split('T')[0];
      const direction = action.payload;

      if (direction === 'prev') {
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (direction === 'next') {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        if (nextDate.toISOString().split('T')[0] <= today) {
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      const newDate = currentDate.toISOString().split('T')[0];
      state.selectedDate = newDate;

      if (newDate === today) {
        state.consumedCalories = state.todaysMeals
          .filter((m) => m.completed)
          .reduce((total, m) => total + (m.meal?.calories ?? 0), 0);
      } else if (state.calorieHistory[newDate] !== undefined) {
        state.consumedCalories = state.calorieHistory[newDate];
      }
    },
  },
  extraReducers: (builder) => {
    // fetchUserProfile
    builder
      .addCase(fetchUserProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        if (action.payload.calories_target) {
          state.calorieTarget = action.payload.calories_target;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchTodaysMeals
    builder
      .addCase(fetchTodaysMeals.fulfilled, (state, action) => {
        state.todaysMeals = action.payload.meals ?? action.payload;
        state.consumedCalories = state.todaysMeals
          .filter((m) => m.completed || m.is_done)
          .reduce((total, m) => total + (m.meal?.calories ?? m.calories ?? 0), 0);
      })
      .addCase(fetchTodaysMeals.rejected, (state, action) => {
        state.error = action.payload;
      });

    // fetchTopPosts
    builder.addCase(fetchTopPosts.fulfilled, (state, action) => {
      state.topPosts = action.payload;
    });

    // toggleMealCompletion
    builder.addCase(toggleMealCompletion.fulfilled, (state, action) => {
      const { mealId, completed } = action.payload;
      const meal = state.todaysMeals.find((m) => m.id === mealId);
      if (meal) meal.completed = completed;
    });

    // saveMealCompletions
    builder
      .addCase(saveMealCompletions.pending, (state) => { state.saving = true; })
      .addCase(saveMealCompletions.fulfilled, (state) => {
        state.saving = false;
        state.lastSaved = new Date().toISOString();
      })
      .addCase(saveMealCompletions.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });

    // updateCalorieTarget
    builder.addCase(updateCalorieTarget.fulfilled, (state, action) => {
      state.calorieTarget = action.payload;
    });

    // fetchCaloriesForDate
    builder.addCase(fetchCaloriesForDate.fulfilled, (state, action) => {
      const { date, calories } = action.payload;
      state.calorieHistory[date] = calories;
      if (date === state.selectedDate) {
        state.consumedCalories = calories;
      }
    });

    // syncWithMealPlanner
    builder.addCase(syncWithMealPlanner.fulfilled, (state, action) => {
      state.todaysMeals = action.payload.meals ?? action.payload;
      state.consumedCalories = state.todaysMeals
        .filter((m) => m.completed || m.is_done)
        .reduce((total, m) => total + (m.meal?.calories ?? m.calories ?? 0), 0);
    });
  },
});

export const {
  updateTimeOfDay,
  toggleMealCompletionLocal,
  setCalorieTarget,
  calculateConsumedCalories,
  setSelectedDate,
  navigateDate,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
