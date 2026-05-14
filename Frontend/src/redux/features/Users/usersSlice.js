import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { socialService } from '../../../services/api/socialService';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async ({ search = '', skip = 0, limit = 50 } = {}, { rejectWithValue }) => {
  try {
    const data = await socialService.searchCreators(search, skip, limit);
    return data.creators ?? data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to fetch creators');
  }
});
        

const usersSlice = createSlice({
    name: 'users',
    initialState : {
        users: [],
        loading: false,
        error: [],
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
    
});

export default usersSlice.reducer;



