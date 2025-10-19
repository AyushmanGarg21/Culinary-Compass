import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './features/auth/authSlice';
// import { studentsApi } from './services/students/studentsApi';
import actionSliceReducer from './features/utils/actionSlice';
import manageSliceReducer from './features/Admin/manageSlice';
import requestSliceReducer from './features/Admin/requestSlice';
import usersSliceReducer from './features/Users/usersSlice';
import recipeSliceReducer from './features/Users/recipeSlice';
import mealPlannerReducer from './features/Users/mealPlannerSlice';
import dashboardReducer from './features/Users/dashboardSlice';
import postsReducer from './features/Posts/postsSlice';
import followedUsersReducer from './features/FollowedUsers/followedUsersSlice';
import metaReducer from './features/utils/metaSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
        action: actionSliceReducer,
        manage: manageSliceReducer,
        requests: requestSliceReducer,
        users: usersSliceReducer,
        recipes: recipeSliceReducer,
        mealPlanner: mealPlannerReducer,
        dashboard: dashboardReducer,
        posts: postsReducer,
        followedUsers: followedUsersReducer,
    meta: metaReducer,

        // [studentsApi.reducerPath]: studentsApi.reducer,
    },
    // middleware: getDefaultMiddleware =>
    //     getDefaultMiddleware()
    //         .concat(studentsApi.middleware)
});

setupListeners(store.dispatch);

export default store;
