import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './features/auth/authSlice';
// import { studentsApi } from './services/students/studentsApi';
import actionSliceReducer from './features/utils/actionSlice';
import manageSliceReducer from './features/Admin/manageSlice';
import requestSliceReducer from './features/Admin/requestSlice';
import usersSliceReducer from './features/Users/usersSlice';
import recipeSliceReducer from './features/Users/recipeSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
        action: actionSliceReducer,
        manage: manageSliceReducer,
        requests: requestSliceReducer,
        users: usersSliceReducer,
        recipes: recipeSliceReducer,

        // [studentsApi.reducerPath]: studentsApi.reducer,
    },
    // middleware: getDefaultMiddleware =>
    //     getDefaultMiddleware()
    //         .concat(studentsApi.middleware)
});

setupListeners(store.dispatch);

export default store;
