import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './features/auth/authSlice';
// import { studentsApi } from './services/students/studentsApi';
import actionSliceReducer from './features/utils/actionSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
        action: actionSliceReducer,
        // [studentsApi.reducerPath]: studentsApi.reducer,
    },
    // middleware: getDefaultMiddleware =>
    //     getDefaultMiddleware()
    //         .concat(studentsApi.middleware)
});

setupListeners(store.dispatch);

export default store;
