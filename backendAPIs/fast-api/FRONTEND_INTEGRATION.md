# Frontend Integration Guide

## Redux Store Configuration

### 1. API Configuration (`src/config/api.js`)

```javascript
export const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    ADMIN_SIGNIN: '/auth/admin/signin',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  
  // User Profile
  USER: {
    PROFILE: '/api/v1/users/profile',
    UPDATE_PROFILE: '/api/v1/users/profile'
  },
  
  // Dashboard
  DASHBOARD: {
    MEALS: '/api/v1/users/dashboard/meals',
    CALORIES: '/api/v1/users/dashboard/calories-intake',
    MARK_MEALS: '/api/v1/users/dashboard/mark-meals-done',
    LATEST_POST: '/api/v1/users/dashboard/latest-post'
  },
  
  // Social Features
  SOCIAL: {
    FEED: '/api/v1/users/posts/feed',
    FOLLOWING: '/api/v1/users/posts/following',
    FOLLOW: '/api/v1/users/posts/follow',
    UNFOLLOW: '/api/v1/users/posts/unfollow',
    SEARCH_CREATORS: '/api/v1/users/posts/creators/search',
    CREATOR_DETAILS: '/api/v1/users/posts/creators'
  },
  
  // Messaging
  MESSAGES: {
    CONVERSATIONS: '/api/v1/users/messages/conversations',
    CONVERSATION: '/api/v1/users/messages/conversation',
    SEND: '/api/v1/users/messages/send',
    MARK_READ: '/api/v1/users/messages/mark-read',
    ADMIN_MESSAGES: '/api/v1/users/messages/admin',
    ADMIN_SEND: '/api/v1/users/messages/admin/send',
    ADMIN_UNREAD: '/api/v1/users/messages/admin/unread-count'
  },
  
  // Creator Requests
  REQUESTS: {
    CREATOR_REQUEST: '/api/v1/users/requests/creator-request',
    CREATOR_POST: '/api/v1/users/requests/creator-post'
  },
  
  // Admin
  ADMIN: {
    CREATOR_REQUESTS: '/api/v1/admin/creator-requests',
    POST_REQUESTS: '/api/v1/admin/post-requests',
    USERS: '/api/v1/admin/manage/users',
    CREATORS: '/api/v1/admin/manage/creators',
    ADMIN_MESSAGES: '/api/v1/admin/messages/conversations'
  }
};
```

### 2. API Client (`src/utils/apiClient.js`)

```javascript
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken
          });

          const { access_token } = response.data.data;
          localStorage.setItem('access_token', access_token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### 3. Auth Slice (`src/redux/features/auth/authSlice.js`)

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';

// Async thunks
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Sign up failed');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGNIN, credentials);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Sign in failed');
    }
  }
);

export const adminSignIn = createAsyncThunk(
  'auth/adminSignIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.ADMIN_SIGNIN, credentials);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Admin sign in failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      return {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Logout failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to get user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    admin: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.admin = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('access_token', action.payload.access_token);
        localStorage.setItem('refresh_token', action.payload.refresh_token);
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('access_token', action.payload.access_token);
        localStorage.setItem('refresh_token', action.payload.refresh_token);
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin Sign In
      .addCase(adminSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.isAuthenticated = true;
        state.isAdmin = true;
        localStorage.setItem('access_token', action.payload.access_token);
        localStorage.setItem('refresh_token', action.payload.refresh_token);
      })
      .addCase(adminSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.admin = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      })
      // Get Current User
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
```

### 4. Dashboard Slice (`src/redux/features/dashboard/dashboardSlice.js`)

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';

export const fetchTodaysMeals = createAsyncThunk(
  'dashboard/fetchTodaysMeals',
  async (date, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.DASHBOARD.MEALS, { date });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch meals');
    }
  }
);

export const fetchCaloriesIntake = createAsyncThunk(
  'dashboard/fetchCaloriesIntake',
  async (date, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.DASHBOARD.CALORIES, { date });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch calories');
    }
  }
);

export const markMealsAsDone = createAsyncThunk(
  'dashboard/markMealsAsDone',
  async (mealIds, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.DASHBOARD.MARK_MEALS, {
        meal_ids: mealIds
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to mark meals');
    }
  }
);

export const fetchLatestPost = createAsyncThunk(
  'dashboard/fetchLatestPost',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.LATEST_POST);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch latest post');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    meals: [],
    calories: null,
    latestPost: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodaysMeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodaysMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = action.payload.meals;
      })
      .addCase(fetchTodaysMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCaloriesIntake.fulfilled, (state, action) => {
        state.calories = action.payload;
      })
      .addCase(fetchLatestPost.fulfilled, (state, action) => {
        state.latestPost = action.payload;
      })
      .addCase(markMealsAsDone.fulfilled, (state, action) => {
        // Update meals status locally
        state.meals = state.meals.map(meal => 
          action.meta.arg.includes(meal.id) 
            ? { ...meal, is_marked_done: true }
            : meal
        );
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
```

### 5. Messages Slice (`src/redux/features/messages/messagesSlice.js`)

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.MESSAGES.CONVERSATIONS);
      return response.data.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (creatorId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.MESSAGES.CONVERSATION}/${creatorId}`);
      return { creatorId, data: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ receiverId, content }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.MESSAGES.SEND, {
        receiver_id: receiverId,
        content
      });
      return { receiverId, message: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to send message');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (creatorId, { rejectWithValue }) => {
    try {
      await apiClient.post(`${API_ENDPOINTS.MESSAGES.MARK_READ}/${creatorId}`);
      return creatorId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to mark as read');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    messages: {},
    currentConversation: null,
    loading: false,
    sendingMessage: false,
    error: null,
  },
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { creatorId, data } = action.payload;
        state.messages[creatorId] = data.messages;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        const { receiverId, message } = action.payload;
        if (state.messages[receiverId]) {
          state.messages[receiverId].push(message);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const creatorId = action.payload;
        // Update conversation unread count
        const conversation = state.conversations.find(c => c.id === creatorId);
        if (conversation) {
          conversation.unreadCount = 0;
        }
      });
  },
});

export const { setCurrentConversation, clearCurrentConversation, clearError } = messagesSlice.actions;
export default messagesSlice.reducer;
```

### 6. Store Configuration (`src/redux/store.js`)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import dashboardReducer from './features/dashboard/dashboardSlice';
import messagesReducer from './features/messages/messagesSlice';
import socialReducer from './features/social/socialSlice';
import adminReducer from './features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    messages: messagesReducer,
    social: socialReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Usage Examples

### 1. Authentication Component

```javascript
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from '../redux/features/auth/authSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signIn(credentials)).unwrap();
      // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};
```

### 2. Dashboard Component

```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodaysMeals, fetchCaloriesIntake } from '../redux/features/dashboard/dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { meals, calories, loading } = useSelector(state => state.dashboard);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    dispatch(fetchTodaysMeals(today));
    dispatch(fetchCaloriesIntake(today));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Today's Meals</h2>
      {meals.map(meal => (
        <div key={meal.id}>
          <h3>{meal.meal_name}</h3>
          <p>Calories: {meal.calories}</p>
          <p>Status: {meal.is_marked_done ? 'Done' : 'Pending'}</p>
        </div>
      ))}
      
      {calories && (
        <div>
          <h2>Calories Summary</h2>
          <p>Total: {calories.total_calories}</p>
          <p>Target: {calories.target_calories}</p>
        </div>
      )}
    </div>
  );
};
```

## Running the Integration

1. **Start Backend:**
```bash
cd backendAPIs/fast-api
python server.py
```

2. **Populate Dummy Data:**
```bash
python scripts/populate_dummy_data.py
```

3. **Start Frontend:**
```bash
cd Frontend
npm start
```

4. **Test with Credentials:**
   - User: `john.doe@example.com` / `password123`
   - Admin: `admin@foodieapp.com` / `admin123`

The backend APIs are now fully integrated and ready for frontend consumption!