import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { socialService } from '../../../services/api/socialService';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ skip = 0, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      return await socialService.getFeed(skip, limit);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch posts');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    total: 0,
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
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts ?? action.payload;
        state.total = action.payload.total ?? state.posts.length;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;
