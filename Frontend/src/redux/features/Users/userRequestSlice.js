import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../../utils/apiClient';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const submitCreatorRequest = createAsyncThunk(
  'userRequests/submitCreatorRequest',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        '/api/v1/users/requests/creator-request',
        formData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to submit creator request'
      );
    }
  }
);

export const submitCreatorPost = createAsyncThunk(
  'userRequests/submitCreatorPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        '/api/v1/users/requests/creator-post',
        postData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to submit post'
      );
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const userRequestSlice = createSlice({
  name: 'userRequests',
  initialState: {
    submitting: false,
    error: null,
    lastSubmitted: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastSubmitted: (state) => {
      state.lastSubmitted = null;
    },
  },
  extraReducers: (builder) => {
    // submitCreatorRequest
    builder
      .addCase(submitCreatorRequest.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitCreatorRequest.fulfilled, (state, action) => {
        state.submitting = false;
        state.lastSubmitted = 'creatorRequest';
      })
      .addCase(submitCreatorRequest.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });

    // submitCreatorPost
    builder
      .addCase(submitCreatorPost.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitCreatorPost.fulfilled, (state, action) => {
        state.submitting = false;
        state.lastSubmitted = 'creatorPost';
      })
      .addCase(submitCreatorPost.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLastSubmitted } = userRequestSlice.actions;
export default userRequestSlice.reducer;
