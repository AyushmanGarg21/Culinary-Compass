import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../../../services/api/authService';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const signup = createAsyncThunk(
  'auth/signup',
  async (data, { rejectWithValue }) => {
    try {
      const result = await authService.signup(data);
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('refresh_token', result.refresh_token);
      localStorage.setItem('user', JSON.stringify(result.user));
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Sign up failed'
      );
    }
  }
);

export const signin = createAsyncThunk(
  'auth/signin',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await authService.signin(credentials);
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('refresh_token', result.refresh_token);
      localStorage.setItem('user', JSON.stringify(result.user));
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Sign in failed'
      );
    }
  }
);

export const adminSignin = createAsyncThunk(
  'auth/adminSignin',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await authService.adminSignin(credentials);
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('refresh_token', result.refresh_token);
      localStorage.setItem('user', JSON.stringify(result.admin));
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Admin sign in failed'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch {
      // Even if the API call fails, clear local state
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch user'
      );
    }
  }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const loadUserFromStorage = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  userData: loadUserFromStorage(),
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Call this on app boot if token already exists in localStorage
    hydrateAuth: (state) => {
      state.userData = loadUserFromStorage();
      state.isAuthenticated = !!localStorage.getItem('access_token');
    }
  },
  extraReducers: (builder) => {
    // signup
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // signin
    builder
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // adminSignin
    builder
      .addCase(adminSignin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminSignin.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.admin;
        state.isAuthenticated = true;
      })
      .addCase(adminSignin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.userData = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // fetchCurrentUser
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
