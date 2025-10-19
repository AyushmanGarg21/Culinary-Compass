import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mealsData from '../../../data/meals.json';

// Fake API calls
export const fetchMealTypes = createAsyncThunk(
  'mealPlanner/fetchMealTypes',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 300));

    return [
      { key: 'breakfast', label: 'Breakfast', color: 'bg-yellow-50 border-yellow-200', enabled: true },
      { key: 'brunch', label: 'Brunch', color: 'bg-orange-50 border-orange-200', enabled: true },
      { key: 'elevenses', label: 'Elevenses', color: 'bg-pink-50 border-pink-200', enabled: false },
      { key: 'lunch', label: 'Lunch', color: 'bg-blue-50 border-blue-200', enabled: true },
      { key: 'afternoonTea', label: 'Afternoon Tea', color: 'bg-amber-50 border-amber-200', enabled: false },
      { key: 'highTea', label: 'High Tea', color: 'bg-indigo-50 border-indigo-200', enabled: false },
      { key: 'dinner', label: 'Dinner', color: 'bg-red-50 border-red-200', enabled: true },
      { key: 'supper', label: 'Supper', color: 'bg-purple-50 border-purple-200', enabled: false },
      { key: 'midnightSnack', label: 'Midnight Snack', color: 'bg-gray-50 border-gray-200', enabled: false }
    ];
  }
);

export const fetchMealOptions = createAsyncThunk(
  'mealPlanner/fetchMealOptions',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Group meals by meal type from meals.json
    const mealsByType = {};

    mealsData.forEach(meal => {
      const mealType = meal.meal_type;
      if (!mealsByType[mealType]) {
        mealsByType[mealType] = [];
      }

      mealsByType[mealType].push({
        id: meal.id,
        name: meal.meal_name,
        calories: meal.calories,
        image: meal.image
      });
    });

    return mealsByType;
  }
);

export const addCustomMeal = createAsyncThunk(
  'mealPlanner/addCustomMeal',
  async ({ mealType, name, calories }) => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const newMeal = {
      id: Date.now(), // Simple ID generation for demo
      name,
      calories: parseInt(calories),
      isCustom: true
    };

    return { mealType, meal: newMeal };
  }
);

export const updateMealTypeSettings = createAsyncThunk(
  'mealPlanner/updateMealTypeSettings',
  async (mealTypeSettings) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mealTypeSettings;
  }
);

export const saveWeeklyPlan = createAsyncThunk(
  'mealPlanner/saveWeeklyPlan',
  async (_, { getState }) => {
    const state = getState();
    const { currentWeekPlan, currentWeekOffset } = state.mealPlanner;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Prepare the data to send to backend
    const weekPlanData = {
      weekOffset: currentWeekOffset,
      planData: currentWeekPlan,
      savedAt: new Date().toISOString(),
      totalMeals: Object.values(currentWeekPlan).reduce((total, day) => {
        return total + Object.values(day).filter(meal => meal !== null).length;
      }, 0)
    };

    // In a real app, this would be sent to the backend
    console.log('Saving weekly plan to backend:', weekPlanData);

    return weekPlanData;
  }
);

export const fetchWeeklyPlan = createAsyncThunk(
  'mealPlanner/fetchWeeklyPlan',
  async (weekOffset = 0, { getState }) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const state = getState();
    const mealTypes = state.mealPlanner.mealTypes;

    // Get the start of the current week (Monday)
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // If Sunday, go back 6 days to Monday

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysFromMonday + (weekOffset * 7));

    const weekPlan = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];

      const dayPlan = {};
      mealTypes.forEach(mealType => {
        dayPlan[mealType.key] = null;
      });

      weekPlan[dateKey] = dayPlan;
    }

    return { weekPlan, weekOffset };
  }
);

export const saveMealPlan = createAsyncThunk(
  'mealPlanner/saveMealPlan',
  async ({ date, mealType, meal }) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { date, mealType, meal };
  }
);

const initialState = {
  mealTypes: [],
  mealOptions: {},
  currentWeekPlan: {},
  currentWeekOffset: 0,
  loading: false,
  saving: false,
  error: null,
  editingMeal: null,
  showMealTypeSettings: false,
  lastSaved: null
};

const mealPlannerSlice = createSlice({
  name: 'mealPlanner',
  initialState,
  reducers: {
    setEditingMeal: (state, action) => {
      state.editingMeal = action.payload;
    },
    clearEditingMeal: (state) => {
      state.editingMeal = null;
    },
    copyPreviousWeek: (state) => {
      // This would copy the previous week's plan to current week
      const previousWeekOffset = state.currentWeekOffset - 1;
      // In a real app, this would fetch the previous week's data
      // For now, we'll just clear the error
      state.error = null;
    },
    toggleMealTypeSettings: (state) => {
      state.showMealTypeSettings = !state.showMealTypeSettings;
    },
    updateMealTypeEnabled: (state, action) => {
      const { mealTypeKey, enabled } = action.payload;
      const mealType = state.mealTypes.find(mt => mt.key === mealTypeKey);
      if (mealType) {
        mealType.enabled = enabled;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMealTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMealTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.mealTypes = action.payload;
      })
      .addCase(fetchMealTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMealOptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMealOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.mealOptions = action.payload;
      })
      .addCase(fetchMealOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchWeeklyPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWeeklyPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeekPlan = action.payload.weekPlan;
        state.currentWeekOffset = action.payload.weekOffset;
      })
      .addCase(fetchWeeklyPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveMealPlan.fulfilled, (state, action) => {
        const { date, mealType, meal } = action.payload;
        if (state.currentWeekPlan[date]) {
          state.currentWeekPlan[date][mealType] = meal;
        }
      })
      .addCase(addCustomMeal.fulfilled, (state, action) => {
        const { mealType, meal } = action.payload;
        if (state.mealOptions[mealType]) {
          state.mealOptions[mealType].push(meal);
        }
      })
      .addCase(updateMealTypeSettings.fulfilled, (state, action) => {
        state.mealTypes = action.payload;
      })
      .addCase(saveWeeklyPlan.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveWeeklyPlan.fulfilled, (state, action) => {
        state.saving = false;
        state.lastSaved = action.payload.savedAt;
      })
      .addCase(saveWeeklyPlan.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      });
  }
});

export const {
  setEditingMeal,
  clearEditingMeal,
  copyPreviousWeek,
  toggleMealTypeSettings,
  updateMealTypeEnabled
} = mealPlannerSlice.actions;
export default mealPlannerSlice.reducer;