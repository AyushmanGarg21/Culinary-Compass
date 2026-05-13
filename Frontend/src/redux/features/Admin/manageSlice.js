import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../../services/api/adminService';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchUsers = createAsyncThunk(
  'manage/fetchUsers',
  async ({ search = '', skip = 0, limit = 100 } = {}, { rejectWithValue }) => {
    try {
      return await adminService.getUsers(search, skip, limit);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch users');
    }
  }
);

export const fetchCreators = createAsyncThunk(
  'manage/fetchCreators',
  async ({ search = '', skip = 0, limit = 100 } = {}, { rejectWithValue }) => {
    try {
      return await adminService.getCreators(search, skip, limit);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch creators');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'manage/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await adminService.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete user');
    }
  }
);

export const deactivateUser = createAsyncThunk(
  'manage/deactivateUser',
  async (userId, { rejectWithValue }) => {
    try {
      await adminService.deactivateUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to deactivate user');
    }
  }
);

export const activateUser = createAsyncThunk(
  'manage/activateUser',
  async (userId, { rejectWithValue }) => {
    try {
      await adminService.activateUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to activate user');
    }
  }
);

export const removeFromCreator = createAsyncThunk(
  'manage/removeFromCreator',
  async (userId, { rejectWithValue }) => {
    try {
      await adminService.removeCreatorStatus(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to remove creator status');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const manageSlice = createSlice({
  name: 'manage',
  initialState: {
    usersData: { data: [], total: 0, status: 'idle', error: null },
    creatorsData: { data: [], total: 0, status: 'idle', error: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchUsers
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.usersData.status = 'loading';
        state.usersData.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersData.status = 'succeeded';
        state.usersData.data = action.payload.users ?? action.payload;
        state.usersData.total = action.payload.total ?? action.payload.length;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersData.status = 'failed';
        state.usersData.error = action.payload;
      });

    // fetchCreators
    builder
      .addCase(fetchCreators.pending, (state) => {
        state.creatorsData.status = 'loading';
        state.creatorsData.error = null;
      })
      .addCase(fetchCreators.fulfilled, (state, action) => {
        state.creatorsData.status = 'succeeded';
        state.creatorsData.data = action.payload.creators ?? action.payload;
        state.creatorsData.total = action.payload.total ?? action.payload.length;
      })
      .addCase(fetchCreators.rejected, (state, action) => {
        state.creatorsData.status = 'failed';
        state.creatorsData.error = action.payload;
      });

    // deleteUser — remove from local list immediately
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.usersData.data = state.usersData.data.filter(
        (u) => u.id !== action.payload
      );
    });

    // deactivateUser — flip is_active flag
    builder.addCase(deactivateUser.fulfilled, (state, action) => {
      const user = state.usersData.data.find((u) => u.id === action.payload);
      if (user) user.is_active = false;
    });

    // activateUser — flip is_active flag
    builder.addCase(activateUser.fulfilled, (state, action) => {
      const user = state.usersData.data.find((u) => u.id === action.payload);
      if (user) user.is_active = true;
    });

    // removeFromCreator — remove from creators list
    builder.addCase(removeFromCreator.fulfilled, (state, action) => {
      state.creatorsData.data = state.creatorsData.data.filter(
        (c) => c.id !== action.payload
      );
    });
  },
});

export default manageSlice.reducer;
