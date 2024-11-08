// manageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fake API calls for users and creators
export const fetchUsers = createAsyncThunk('manage/fetchUsers', async () => {
  return [
    { id: 1, name: 'Alice Smith', phone: '123-456-7890', email: 'alice@example.com' },
    { id: 2, name: 'Bob Johnson', phone: '987-654-3210', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', phone: '111-222-3333', email: 'chaine@example.com' },
    { id: 4, name: 'Dana White', phone: '444-555-6666', email: 'Doe@example.com' },
    { id: 5, name: 'Eve Williams', phone: '555-555-5555', email: ' Eve@example.com' },
  ];
});

export const fetchCreators = createAsyncThunk('manage/fetchCreators', async () => {
  return [
    { id: 1, name: 'Charlie Brown', phone: '111-222-3333', email: 'charlie@example.com' },
    { id: 2, name: 'Dana White', phone: '444-555-6666', email: 'dana@example.com' },
    { id: 3, name: 'Charlie Brown', phone: '111-222-3333', email: 'chaine@example.com' },
    { id: 4, name: 'Dana White', phone: '444-555-6666', email: 'Doe@example.com' },
    { id: 5, name: 'Eve Williams', phone: '555-555-5555', email: ' Eve@example.com' },
  ];
});

export const deleteUser = createAsyncThunk('manage/deleteUser', async (id, { rejectWithValue }) => {
  console.log(`API Call: Deleting user with id ${id}`);
  return id;
});

export const deactivateUser = createAsyncThunk('manage/deactivateUser', async (id, { rejectWithValue }) => {
  console.log(`API Call: Deactivating user with id ${id}`);
  return id;
});

export const removeFromCreator = createAsyncThunk('manage/removeFromCreator', async (id, { rejectWithValue }) => {
  console.log(`API Call: Removing creator with id ${id}`);
  return id;
});

const manageSlice = createSlice({
  name: 'manage',
  initialState: {
    usersData: { data: [], status: 'idle' },
    creatorsData: { data: [], status: 'idle' },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.usersData.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersData.status = 'succeeded';
        state.usersData.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.usersData.status = 'failed';
      })
      .addCase(fetchCreators.pending, (state) => {
        state.creatorsData.status = 'loading';
      })
      .addCase(fetchCreators.fulfilled, (state, action) => {
        state.creatorsData.status = 'succeeded';
        state.creatorsData.data = action.payload;
      })
      .addCase(fetchCreators.rejected, (state) => {
        state.creatorsData.status = 'failed';
      });
  },
});

export default manageSlice.reducer;
