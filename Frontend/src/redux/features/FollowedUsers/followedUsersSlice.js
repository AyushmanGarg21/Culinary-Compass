import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Simulate API call for followed users
export const fetchFollowedUsers = createAsyncThunk('followedUsers/fetchFollowedUsers', async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: 1,
      username: "John Doe",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      foodPreference: "Vegan",
      isOnline: true,
      lastActive: "2024-01-15T10:30:00Z",
      mutualFollowers: 5
    },
    {
      id: 2,
      username: "Jane Smith",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      foodPreference: "Vegetarian",
      isOnline: false,
      lastActive: "2024-01-14T15:45:00Z",
      mutualFollowers: 8
    },
    {
      id: 3,
      username: "Ali Khan",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      foodPreference: "Non-Vegetarian",
      isOnline: true,
      lastActive: "2024-01-15T09:20:00Z",
      mutualFollowers: 3
    },
    {
      id: 4,
      username: "Maria Lopez",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      foodPreference: "Vegan",
      isOnline: false,
      lastActive: "2024-01-13T18:20:00Z",
      mutualFollowers: 12
    },
    {
      id: 5,
      username: "Akira Tanaka",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      foodPreference: "Vegetarian",
      isOnline: true,
      lastActive: "2024-01-15T11:10:00Z",
      mutualFollowers: 7
    },
    {
      id: 6,
      username: "Sarah Lee",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      foodPreference: "Vegan",
      isOnline: false,
      lastActive: "2024-01-14T20:30:00Z",
      mutualFollowers: 15
    }
  ];
});

// Follow/Unfollow user
export const toggleFollow = createAsyncThunk('followedUsers/toggleFollow', async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return userId;
});

const followedUsersSlice = createSlice({
  name: 'followedUsers',
  initialState: {
    followedUsers: [],
    loading: false,
    error: null,
    followingIds: new Set()
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.followedUsers = action.payload;
        // Initialize all as followed
        state.followingIds = new Set(action.payload.map(user => user.id));
      })
      .addCase(fetchFollowedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        const userId = action.payload;
        if (state.followingIds.has(userId)) {
          state.followingIds.delete(userId);
        } else {
          state.followingIds.add(userId);
        }
      });
  }
});

export const { clearError } = followedUsersSlice.actions;
export default followedUsersSlice.reducer;