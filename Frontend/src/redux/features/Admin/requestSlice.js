import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../../services/api/adminService';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchUserRequests = createAsyncThunk(
  'requests/fetchUserRequests',
  async ({ statusFilter = 'PENDING', skip = 0, limit = 100 } = {}, { rejectWithValue }) => {
    try {
      return await adminService.getCreatorRequests(statusFilter, skip, limit);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch creator requests');
    }
  }
);

export const acceptUserRequest = createAsyncThunk(
  'requests/acceptUserRequest',
  async ({ id, comments = '' }, { rejectWithValue }) => {
    try {
      await adminService.approveCreatorRequest(id, comments);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to approve request');
    }
  }
);

export const declineUserRequest = createAsyncThunk(
  'requests/declineUserRequest',
  async ({ id, comments = '' }, { rejectWithValue }) => {
    try {
      await adminService.rejectCreatorRequest(id, comments);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to reject request');
    }
  }
);

export const fetchPostRequests = createAsyncThunk(
  'requests/fetchPostRequests',
  async ({ statusFilter = 'PENDING', skip = 0, limit = 100 } = {}, { rejectWithValue }) => {
    try {
      return await adminService.getPostRequests(statusFilter, skip, limit);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch post requests');
    }
  }
);

export const approvePostRequest = createAsyncThunk(
  'requests/approvePostRequest',
  async ({ id, comments = '' }, { rejectWithValue }) => {
    try {
      await adminService.approvePostRequest(id, comments);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to approve post');
    }
  }
);

export const rejectPostRequest = createAsyncThunk(
  'requests/rejectPostRequest',
  async ({ id, comments = '' }, { rejectWithValue }) => {
    try {
      await adminService.rejectPostRequest(id, comments);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to reject post');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    userRequests: [],
    postRequests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchUserRequests
    builder
      .addCase(fetchUserRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.userRequests = action.payload.requests ?? action.payload;
      })
      .addCase(fetchUserRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // acceptUserRequest
    builder.addCase(acceptUserRequest.fulfilled, (state, action) => {
      state.userRequests = state.userRequests.filter((r) => r.id !== action.payload);
    });

    // declineUserRequest
    builder.addCase(declineUserRequest.fulfilled, (state, action) => {
      state.userRequests = state.userRequests.filter((r) => r.id !== action.payload);
    });

    // fetchPostRequests
    builder
      .addCase(fetchPostRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.postRequests = action.payload.posts ?? action.payload;
      })
      .addCase(fetchPostRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // approvePostRequest
    builder.addCase(approvePostRequest.fulfilled, (state, action) => {
      state.postRequests = state.postRequests.filter((r) => r.id !== action.payload);
    });

    // rejectPostRequest
    builder.addCase(rejectPostRequest.fulfilled, (state, action) => {
      state.postRequests = state.postRequests.filter((r) => r.id !== action.payload);
    });
  },
});

export default requestSlice.reducer;
