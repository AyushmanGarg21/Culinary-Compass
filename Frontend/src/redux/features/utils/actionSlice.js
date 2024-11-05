
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


const initialState = {
    DrawerOpen: false,
    loading: false,
    error: [],
};


const actionSlice = createSlice({
    name: 'action',
    initialState,
    reducers: {
        setDrawerOpen: (state, action) => {
            state.DrawerOpen = action.payload.DrawerOpen;
        },
    },
});

export const { setDrawerOpen } = actionSlice.actions;

export default actionSlice.reducer;

