import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { masterService } from '../../../services/api/masterService';
import apiClient from '../../../utils/apiClient';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Get the Monday of the week that contains today, offset by weekOffset weeks. */
const getWeekStart = (weekOffset = 0) => {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const daysFromMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday + weekOffset * 7);
  return monday.toISOString().split('T')[0];
};

/** Build a week_id string like "2025-W20". */
const buildWeekId = (weekStart) => {
  const d = new Date(weekStart);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchMealTypes = createAsyncThunk(
  'mealPlanner/fetchMealTypes',
  async () => {
    // Meal types are static UI config — no backend endpoint needed
    return [
      { key: 'breakfast',    label: 'Breakfast',      color: 'bg-yellow-50 border-yellow-200', enabled: true  },
      { key: 'brunch',       label: 'Brunch',         color: 'bg-orange-50 border-orange-200', enabled: false },
      { key: 'elevenses',    label: 'Elevenses',      color: 'bg-pink-50 border-pink-200',     enabled: false },
      { key: 'lunch',        label: 'Lunch',          color: 'bg-blue-50 border-blue-200',     enabled: true  },
      { key: 'afternoonTea', label: 'Afternoon Tea',  color: 'bg-amber-50 border-amber-200',   enabled: false },
      { key: 'highTea',      label: 'High Tea',       color: 'bg-indigo-50 border-indigo-200', enabled: true  },
      { key: 'dinner',       label: 'Dinner',         color: 'bg-red-50 border-red-200',       enabled: true  },
      { key: 'supper',       label: 'Supper',         color: 'bg-purple-50 border-purple-200', enabled: false },
      { key: 'midnightSnack',label: 'Midnight Snack', color: 'bg-gray-50 border-gray-200',     enabled: false },
    ];
  }
);

export const fetchMealOptions = createAsyncThunk(
  'mealPlanner/fetchMealOptions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await masterService.getMeals();
      const mealList = data?.meals ?? data ?? [];
      const mealsByType = {};
      mealList.forEach((meal) => {
        const rawType = meal.meal_type || meal.mealType || 'other';
        const mealType = rawType
          .trim()
          .split(/\s+/)
          .map((word, i) =>
            i === 0
              ? word.toLowerCase()
              : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join('');
        if (!mealsByType[mealType]) mealsByType[mealType] = [];
        mealsByType[mealType].push({
          id: meal.id,
          name: meal.meal_name || meal.name,
          calories: meal.calories ?? 0,
          image: meal.icon || meal.image || meal.image_url || null,
        });
      });
      return mealsByType;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch meal options');
    }
  }
);

export const fetchWeeklyPlan = createAsyncThunk(
  'mealPlanner/fetchWeeklyPlan',
  async (weekOffset = 0, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const mealTypes = state.mealPlanner.mealTypes;
      const weekStart = getWeekStart(weekOffset);

      // Build empty skeleton for 7 days
      const weekPlan = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        const dateKey = d.toISOString().split('T')[0];
        weekPlan[dateKey] = {};
        mealTypes.forEach((mt) => { weekPlan[dateKey][mt.key] = null; });
      }

      // Overlay saved entries from backend
      const response = await apiClient.get('/api/v1/users/meal-plan', {
        params: { week_start: weekStart },
      });

      const savedPlan = response.data.data?.plan ?? {};
      const receivedMealTypes = new Set();
      for (const [dateKey, dayPlan] of Object.entries(savedPlan)) {
        if (!weekPlan[dateKey]) weekPlan[dateKey] = {};
        for (const [mealType, mealInfo] of Object.entries(dayPlan)) {
          receivedMealTypes.add(mealType);
          weekPlan[dateKey][mealType] = {
            id: mealInfo.meal_id,
            name: mealInfo.meal_name,
            calories: mealInfo.calories,
            isCustom: mealInfo.is_custom_meal,
            planId: mealInfo.id,
            is_marked_done: mealInfo.is_marked_done,
          };
        }
      }

      return { weekPlan, weekOffset, receivedMealTypes: Array.from(receivedMealTypes) };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch meal plan');
    }
  }
);

export const saveWeeklyPlan = createAsyncThunk(
  'mealPlanner/saveWeeklyPlan',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { currentWeekPlan, currentWeekOffset } = state.mealPlanner;

      const weekStart = getWeekStart(currentWeekOffset);
      const weekId = buildWeekId(weekStart);

      const entries = [];
      for (const [dateKey, dayPlan] of Object.entries(currentWeekPlan)) {
        for (const [mealType, meal] of Object.entries(dayPlan)) {
          entries.push({
            date: dateKey,
            meal_type: mealType,
            meal_id: meal?.isCustom ? null : (meal?.id ?? null),
            meal_name: meal?.isCustom ? meal.name : null,
            calories: meal?.isCustom ? meal.calories : null,
          });
        }
      }

      const response = await apiClient.post('/api/v1/users/meal-plan/save', {
        week_id: weekId,
        entries,
      });

      return { savedAt: new Date().toISOString(), ...response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to save meal plan');
    }
  }
);

export const saveMealPlan = createAsyncThunk(
  'mealPlanner/saveMealPlan',
  async ({ date, mealType, meal, weekOffset = 0 }, { rejectWithValue }) => {
    try {
      const weekStart = getWeekStart(weekOffset);
      const weekId = buildWeekId(weekStart);

      await apiClient.post('/api/v1/users/meal-plan/save', {
        week_id: weekId,
        entries: [{
          date,
          meal_type: mealType,
          meal_id: meal?.isCustom ? null : (meal?.id ?? null),
          meal_name: meal?.isCustom ? meal.name : null,
          calories: meal?.isCustom ? meal.calories : null,
        }],
      });

      return { date, mealType, meal };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to save meal slot');
    }
  }
);

export const copyPreviousWeekPlan = createAsyncThunk(
  'mealPlanner/copyPreviousWeekPlan',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { currentWeekOffset, currentWeekPlan } = state.mealPlanner;

      // Previous week starts from Monday
      const prevWeekStart = getWeekStart(currentWeekOffset - 1);

      const response = await apiClient.get('/api/v1/users/meal-plan', {
        params: { week_start: prevWeekStart },
      });

      const savedPlan = response.data.data?.plan ?? {};

      // Helper: get weekday index (Monday = 0, Sunday = 6)
      const getWeekdayIndex = (dateString) => {
        const day = new Date(dateString).getDay();

        // JS: Sunday = 0
        // Convert => Monday = 0
        return day === 0 ? 6 : day - 1;
      };

      // Store previous week meals by weekday
      const mealsByWeekday = {};

      Object.entries(savedPlan).forEach(([date, dayPlan]) => {
        const weekdayIndex = getWeekdayIndex(date);

        mealsByWeekday[weekdayIndex] = dayPlan;
      });

      const copiedPlan = {};

      Object.keys(currentWeekPlan)
        .sort()
        .forEach((dateKey) => {
          const weekdayIndex = getWeekdayIndex(dateKey);

          copiedPlan[dateKey] = {
            ...(currentWeekPlan[dateKey] ?? {}),
          };

          const prevDayMeals = mealsByWeekday[weekdayIndex];

          if (prevDayMeals) {
            Object.entries(prevDayMeals).forEach(
              ([mealType, mealInfo]) => {
                copiedPlan[dateKey][mealType] = {
                  id: mealInfo.meal_id,
                  name: mealInfo.meal_name,
                  calories: mealInfo.calories,
                  isCustom: mealInfo.is_custom_meal,
                };
              }
            );
          }
        });

      console.log('copiedPlan ==> ', copiedPlan);

      return copiedPlan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
          'Failed to copy previous week'
      );
    }
  }
);

export const addCustomMeal = createAsyncThunk(
  'mealPlanner/addCustomMeal',
  async ({ mealType, name, calories }) => {
    const newMeal = {
      id: Date.now(),
      name,
      calories: parseInt(calories),
      isCustom: true,
    };
    return { mealType, meal: newMeal };
  }
);

export const updateMealTypeSettings = createAsyncThunk(
  'mealPlanner/updateMealTypeSettings',
  async (mealTypeSettings) => mealTypeSettings
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  mealTypes: [],
  mealOptions: {},
  allMeals: [],
  currentWeekPlan: {},
  currentWeekOffset: 0,
  loading: false,
  loadingMealOptions: false,
  saving: false,
  error: null,
  editingMeal: null,
  showMealTypeSettings: false,
  lastSaved: null,
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
    // Update a single meal slot in local state only — no API call.
    // The backend is only updated when the user clicks the Save button.
    setMealInPlan: (state, action) => {
      const { date, mealType, meal } = action.payload;
      if (state.currentWeekPlan[date] !== undefined) {
        state.currentWeekPlan[date][mealType] = meal;
      }
    },
    toggleMealTypeSettings: (state) => {
      state.showMealTypeSettings = !state.showMealTypeSettings;
    },
    updateMealTypeEnabled: (state, action) => {
      const { mealTypeKey, enabled } = action.payload;
      const mealType = state.mealTypes.find((mt) => mt.key === mealTypeKey);
      if (mealType) mealType.enabled = enabled;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMealTypes
      .addCase(fetchMealTypes.pending,    (state) => { state.loading = true; })
      .addCase(fetchMealTypes.fulfilled,  (state, action) => { state.loading = false; state.mealTypes = action.payload; })
      .addCase(fetchMealTypes.rejected,   (state, action) => { state.loading = false; state.error = action.error.message; })

      // fetchMealOptions
      .addCase(fetchMealOptions.pending,   (state) => { state.loadingMealOptions = true; })
      .addCase(fetchMealOptions.fulfilled, (state, action) => {
        state.loadingMealOptions = false;
        state.mealOptions = action.payload;
        state.allMeals = Object.values(action.payload).flat();
      })
      .addCase(fetchMealOptions.rejected,  (state, action) => { state.loadingMealOptions = false; state.error = action.payload; })

      // fetchWeeklyPlan
      .addCase(fetchWeeklyPlan.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchWeeklyPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeekPlan = action.payload.weekPlan;
        state.currentWeekOffset = action.payload.weekOffset;
        
        const receivedMealTypes = action.payload.receivedMealTypes || [];
        if (receivedMealTypes.length > 0) {
          state.mealTypes = state.mealTypes.map(mt => ({
            ...mt,
            enabled: receivedMealTypes.includes(mt.key)
          }));
        } else {
          const defaultEnabled = ['breakfast', 'lunch', 'highTea', 'dinner'];
          state.mealTypes = state.mealTypes.map(mt => ({
            ...mt,
            enabled: defaultEnabled.includes(mt.key)
          }));
        }
      })
      .addCase(fetchWeeklyPlan.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // saveWeeklyPlan
      .addCase(saveWeeklyPlan.pending,   (state) => { state.saving = true; state.error = null; })
      .addCase(saveWeeklyPlan.fulfilled, (state, action) => { state.saving = false; state.lastSaved = action.payload.savedAt; })
      .addCase(saveWeeklyPlan.rejected,  (state, action) => { state.saving = false; state.error = action.payload; })

      // saveMealPlan cases removed — individual slot saves no longer call the API.
      // All persistence goes through saveWeeklyPlan (the Save button).

      // copyPreviousWeekPlan
      .addCase(copyPreviousWeekPlan.fulfilled, (state, action) => { state.currentWeekPlan = action.payload; })
      .addCase(copyPreviousWeekPlan.rejected,  (state, action) => { state.error = action.payload; })

      // addCustomMeal
      .addCase(addCustomMeal.fulfilled, (state, action) => {
        const { mealType, meal } = action.payload;
        if (state.mealOptions[mealType]) {
          state.mealOptions[mealType].push(meal);
        }
      })

      // updateMealTypeSettings
      .addCase(updateMealTypeSettings.fulfilled, (state, action) => { state.mealTypes = action.payload; });
  },
});

export const {
  setEditingMeal,
  clearEditingMeal,
  setMealInPlan,
  toggleMealTypeSettings,
  updateMealTypeEnabled,
} = mealPlannerSlice.actions;

export default mealPlannerSlice.reducer;
