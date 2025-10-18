import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fake API calls
export const fetchUserProfile = createAsyncThunk(
  'dashboard/fetchUserProfile',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: null,
      joinedDate: '2024-01-15'
    };
  }
);

export const fetchTodaysMeals = createAsyncThunk(
  'dashboard/fetchTodaysMeals',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Simulate backend API call to get saved meal plan and completion status
    // This would be the last saved state from the meal planner
    const savedMealPlan = {
      [today]: {
        breakfast: { id: 1, name: 'Oatmeal with Berries', calories: 250 },
        lunch: { id: 10, name: 'Grilled Chicken Salad', calories: 350 },
        dinner: { id: 23, name: 'Grilled Salmon with Rice', calories: 520 }
      }
    };
    
    // Simulate saved completion status from backend
    const savedCompletions = {
      [`${today}-breakfast`]: true,
      [`${today}-lunch`]: false,
      [`${today}-dinner`]: false
    };
    
    // Transform to dashboard format with saved completion status
    const todaysPlan = savedMealPlan[today] || {};
    const mealsWithStatus = Object.entries(todaysPlan).map(([mealType, meal]) => ({
      mealType,
      meal,
      completed: savedCompletions[`${today}-${mealType}`] || false,
      id: `${today}-${mealType}`
    })).filter(item => item.meal !== null);
    
    console.log('Fetched today\'s meals from backend:', mealsWithStatus);
    return mealsWithStatus;
  }
);

export const fetchTopPosts = createAsyncThunk(
  'dashboard/fetchTopPosts',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 1,
        author: 'Sarah Johnson',
        avatar: null,
        title: 'Amazing Quinoa Buddha Bowl Recipe',
        content: 'Just tried this incredible quinoa bowl with roasted vegetables and tahini dressing. Perfect for meal prep!',
        image: null,
        likes: 24,
        comments: 8,
        timeAgo: '2 hours ago',
        tags: ['healthy', 'vegetarian', 'meal-prep']
      },
      {
        id: 2,
        author: 'Mike Chen',
        avatar: null,
        title: 'Weekly Meal Prep Success!',
        content: 'Completed my Sunday meal prep for the week. Feeling organized and ready to eat healthy all week long!',
        image: null,
        likes: 18,
        comments: 5,
        timeAgo: '4 hours ago',
        tags: ['meal-prep', 'organization', 'healthy']
      },
      {
        id: 3,
        author: 'Emma Wilson',
        avatar: null,
        title: 'Homemade Sourdough Bread',
        content: 'Finally mastered sourdough after months of practice. The crust is perfect and the crumb is so airy!',
        image: null,
        likes: 32,
        comments: 12,
        timeAgo: '6 hours ago',
        tags: ['baking', 'sourdough', 'homemade']
      }
    ];
  }
);

export const toggleMealCompletion = createAsyncThunk(
  'dashboard/toggleMealCompletion',
  async ({ mealId, completed }) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { mealId, completed };
  }
);

export const saveMealCompletions = createAsyncThunk(
  'dashboard/saveMealCompletions',
  async (_, { getState }) => {
    const state = getState();
    const today = new Date().toISOString().split('T')[0];
    
    // Prepare comprehensive data to send to backend
    const saveData = {
      date: today,
      userId: state.dashboard.user?.id || 1,
      meals: state.dashboard.todaysMeals.map(meal => ({
        mealId: meal.id,
        mealType: meal.mealType,
        mealData: meal.meal,
        completed: meal.completed,
        completedAt: meal.completed ? new Date().toISOString() : null,
        calories: meal.meal.calories
      })),
      totalCalories: state.dashboard.consumedCalories,
      calorieTarget: state.dashboard.calorieTarget,
      savedAt: new Date().toISOString()
    };
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log('Saving meal progress to backend:', saveData);
    
    // Simulate backend response
    return {
      success: true,
      savedData: saveData,
      message: 'Meal progress saved successfully'
    };
  }
);

export const updateCalorieTarget = createAsyncThunk(
  'dashboard/updateCalorieTarget',
  async (target) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('Updating calorie target:', target);
    return target;
  }
);

export const syncWithMealPlanner = createAsyncThunk(
  'dashboard/syncWithMealPlanner',
  async (_, { getState }) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // This would be called when meal planner is saved
    // It fetches the latest saved meal plan from backend
    const today = new Date().toISOString().split('T')[0];
    
    // Simulate fetching updated meal plan from backend after meal planner save
    const state = getState();
    const mealPlannerData = state.mealPlanner?.currentWeekPlan?.[today] || {};
    
    // Only include meals that are actually saved (not just local changes)
    const savedMeals = Object.entries(mealPlannerData)
      .filter(([_, meal]) => meal !== null)
      .map(([mealType, meal]) => ({
        mealType,
        meal,
        completed: false, // Reset completion status for new meals
        id: `${today}-${mealType}`
      }));
    
    console.log('Syncing with meal planner:', savedMeals);
    return savedMeals;
  }
);

export const fetchCaloriesForDate = createAsyncThunk(
  'dashboard/fetchCaloriesForDate',
  async (date) => {
    const today = new Date().toISOString().split('T')[0];
    
    // NEVER fetch calories for today - they are ALWAYS calculated from meals
    if (date === today) {
      console.warn('Attempted to fetch calories for today - this should never happen!');
      throw new Error('Today\'s calories should be calculated from meals, not fetched from API');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const selectedDate = new Date(date);
    const todayDate = new Date(today);
    
    // Generate realistic calorie data for past dates only
    let calories = 0;
    if (selectedDate < todayDate) {
      // Past dates have saved data from backend
      const daysSinceEpoch = Math.floor(selectedDate.getTime() / (1000 * 60 * 60 * 24));
      const seed = daysSinceEpoch % 7; // Create variation based on day
      
      const baseCalories = [1200, 1800, 2100, 1650, 2300, 1900, 1400];
      calories = baseCalories[seed] + Math.floor(Math.random() * 200);
    }
    
    console.log(`Fetching calories for past date ${date}:`, calories);
    return { date, calories, isToday: false };
  }
);

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

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
  lastSaved: null
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
      const meal = state.todaysMeals.find(m => m.id === mealId);
      if (meal) {
        const wasCompleted = meal.completed;
        meal.completed = !meal.completed;
        
        // Update consumed calories
        if (meal.completed && !wasCompleted) {
          state.consumedCalories += meal.meal.calories;
        } else if (!meal.completed && wasCompleted) {
          state.consumedCalories -= meal.meal.calories;
        }
      }
    },
    setCalorieTarget: (state, action) => {
      state.calorieTarget = action.payload;
    },
    calculateConsumedCalories: (state) => {
      const today = new Date().toISOString().split('T')[0];
      
      // Only recalculate if we're viewing today
      if (state.selectedDate === today) {
        state.consumedCalories = state.todaysMeals
          .filter(meal => meal.completed)
          .reduce((total, meal) => total + meal.meal.calories, 0);
      }
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    navigateDate: (state, action) => {
      const currentDate = new Date(state.selectedDate);
      const direction = action.payload; // 'prev' or 'next'
      const today = new Date().toISOString().split('T')[0];
      
      if (direction === 'prev') {
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (direction === 'next') {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        
        // Don't allow future dates
        if (nextDate.toISOString().split('T')[0] <= today) {
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      
      const newSelectedDate = currentDate.toISOString().split('T')[0];
      state.selectedDate = newSelectedDate;
      
      // If navigating back to today, recalculate calories from meals
      if (newSelectedDate === today) {
        state.consumedCalories = state.todaysMeals
          .filter(meal => meal.completed)
          .reduce((total, meal) => total + meal.meal.calories, 0);
      } else {
        // For other dates, use cached calories if available
        if (state.calorieHistory[newSelectedDate]) {
          state.consumedCalories = state.calorieHistory[newSelectedDate];
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTodaysMeals.fulfilled, (state, action) => {
        state.todaysMeals = action.payload;
        // Calculate consumed calories when meals are loaded
        state.consumedCalories = action.payload
          .filter(meal => meal.completed)
          .reduce((total, meal) => total + meal.meal.calories, 0);
      })
      .addCase(fetchTopPosts.fulfilled, (state, action) => {
        state.topPosts = action.payload;
      })
      .addCase(toggleMealCompletion.fulfilled, (state, action) => {
        const { mealId, completed } = action.payload;
        const meal = state.todaysMeals.find(m => m.id === mealId);
        if (meal) {
          meal.completed = completed;
        }
      })
      .addCase(saveMealCompletions.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveMealCompletions.fulfilled, (state) => {
        state.saving = false;
        state.lastSaved = new Date().toISOString();
      })
      .addCase(saveMealCompletions.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })
      .addCase(updateCalorieTarget.fulfilled, (state, action) => {
        state.calorieTarget = action.payload;
      })
      .addCase(fetchCaloriesForDate.fulfilled, (state, action) => {
        const { date, calories } = action.payload;
        const today = new Date().toISOString().split('T')[0];
        
        // This should never be called for today, but double-check
        if (date === today) {
          console.error('fetchCaloriesForDate was called for today - this is incorrect!');
          return;
        }
        
        // Store calories for past dates only
        state.calorieHistory[date] = calories;
        
        // Update consumed calories if it's the selected date (and not today)
        if (date === state.selectedDate && date !== today) {
          state.consumedCalories = calories;
        }
      })
      .addCase(syncWithMealPlanner.fulfilled, (state, action) => {
        // Update today's meals when meal planner is saved
        const today = new Date().toISOString().split('T')[0];
        state.todaysMeals = action.payload;
        
        // Recalculate consumed calories for today
        state.consumedCalories = action.payload
          .filter(meal => meal.completed)
          .reduce((total, meal) => total + meal.meal.calories, 0);
      });
  }
});

export const { 
  updateTimeOfDay, 
  toggleMealCompletionLocal, 
  setCalorieTarget, 
  calculateConsumedCalories,
  setSelectedDate,
  navigateDate
} = dashboardSlice.actions;
export default dashboardSlice.reducer;