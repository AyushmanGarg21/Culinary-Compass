import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../../services/api/authService';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      return await authService.updateProfile(profileData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update profile');
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  'profile/uploadProfilePicture',
  async (file, { rejectWithValue }) => {
    try {
      return await authService.uploadProfilePicture(file);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to upload profile picture');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  data: null,
  loading: false,
  saving: false,
  uploadingPicture: false,
  error: null,
  saveError: null,
  successMessage: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.saveError = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProfile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateProfile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.saving = true;
        state.saveError = null;
        state.successMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.data = action.payload;
        state.successMessage = 'Profile updated successfully!';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
      });

    // uploadProfilePicture
    builder
      .addCase(uploadProfilePicture.pending, (state) => {
        state.uploadingPicture = true;
        state.saveError = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.uploadingPicture = false;
        state.data = action.payload;
        state.successMessage = 'Profile picture updated successfully!';
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.uploadingPicture = false;
        state.saveError = action.payload;
      });
  },
});

export const { clearMessages } = profileSlice.actions;
export default profileSlice.reducer;
