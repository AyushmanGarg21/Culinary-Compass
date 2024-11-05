import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axiosInstance from '../../services/httpService';

// login api
// export const login = createAsyncThunk(
//     'login',
//     async (data, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.post(`${baseUrl}/login`, data);
//             return response.data;
//         } catch (error) {
//             if (error) {
//                 if (error.response && error.response.data) {
//                     return rejectWithValue(error.response.data.message);
//                 } else {
//                     return rejectWithValue('An Error Occurred While Login');
//                 }
//             }
//         }
//     }
// );

// // Logout api
// export const logout = createAsyncThunk('logout', async rejectWithValue => {
//     try {
//         const response = await axiosInstance.post(`${baseUrl}/logout`);
//         return response.data;
//     } catch (error) {
//         if (error) {
//             if (error.response && error.response.data) {
//                 return rejectWithValue(error.response.data.message);
//             } else {
//                 return rejectWithValue('An Error Occurred While Login');
//             }
//         }
//     }
// });


const initialState = {
    userData: {},
    // role: 'User',
    // isLogin: false,
    // accessToken: null,
    loading: false,
    error: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // setLoginData: (state, action) => {
        //     state.isLogin = action.payload.isLogin;
        //     state.role = action.payload.role;
        //     state.accessToken = action.payload.accessToken;
        // },
    },
    extraReducers: builder => {

    },
});

// export const { setLoginData } = authSlice.actions;

export default authSlice.reducer;
