import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { socialService } from '../../../services/api/socialService';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchFollowedUsers = createAsyncThunk(
  'followedUsers/fetchFollowedUsers',
  async ({ skip = 0, limit = 50 } = {}, { rejectWithValue }) => {
    try {
      return await socialService.getFollowing(skip, limit);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch following list');
    }
  }
);

export const followUser = createAsyncThunk(
  'followedUsers/followUser',
  async (targetUserId, { rejectWithValue }) => {
    try {
      await socialService.followUser(targetUserId);
      return targetUserId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to follow user');
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'followedUsers/unfollowUser',
  async (targetUserId, { rejectWithValue }) => {
    try {
      await socialService.unfollowUser(targetUserId);
      return targetUserId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to unfollow user');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const followedUsersSlice = createSlice({
  name: 'followedUsers',
  initialState: {
    followedUsers: [],
    total: 0,
    loading: false,
    error: null,
    followingIds: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchFollowedUsers
    builder
      .addCase(fetchFollowedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.followedUsers = action.payload.following ?? action.payload;
        state.total = action.payload.total ?? state.followedUsers.length;
        state.followingIds = state.followedUsers.map((u) => u.id);
      })
      .addCase(fetchFollowedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // followUser
    builder.addCase(followUser.fulfilled, (state, action) => {
      if (!state.followingIds.includes(action.payload)) {
        state.followingIds.push(action.payload);
      }
    });

    // unfollowUser
    builder.addCase(unfollowUser.fulfilled, (state, action) => {
      state.followingIds = state.followingIds.filter((id) => id !== action.payload);
      state.followedUsers = state.followedUsers.filter((u) => u.id !== action.payload);
    });
  },
});

export const { clearError } = followedUsersSlice.actions;
export default followedUsersSlice.reducer;

// Backward-compat alias — dispatches follow or unfollow based on current state
export const toggleFollow = (targetUserId) => (dispatch, getState) => {
  const { followingIds } = getState().followedUsers;
  if (followingIds.includes(targetUserId)) {
    return dispatch(unfollowUser(targetUserId));
  }
  return dispatch(followUser(targetUserId));
};
