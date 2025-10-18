// App.jsx
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Layout from './Layout';
import Login from './Pages/Login/Login';
import Register from './Pages/Login/Register';
import PrivateRoute from './privateRoute';
import NotFound from './notFound';
import Profile from './Pages/Users/Profile/Profile';
import CreatePost from './Pages/Users/Posts/CreatePost';
import PostPage from './Pages/Users/Posts/PostPage';
import ManageCreators from './Pages/Admin/ManageCreators';
import ManageUsers from './Pages/Admin/ManageUsers';
import UserRequest from './Pages/Admin/UserRequest';
import CreatorRequest from './Pages/Admin/CreatorRequest';
import Explore from './Pages/Users/Explore/Explore';
import RecipeSearchPage from './Pages/Users/recipe/RecipeSearchPage';
import MealPlanner from './Pages/Users/Planner/MealPlanner';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialRender = useRef(true); // Track if it's the initial render

  useEffect(() => {
    if (initialRender.current) { // Only run on the initial load
      // Only auto-redirect when user lands on root "/"
      if (location.pathname === '/') {
        const isLogin = localStorage.getItem('isLogin') === 'true';
        if (isLogin) {
          navigate('/'); // Stay on app root (protected routes handle content)
        } else {
          navigate('/login'); // Redirect to login if not logged in
        }
      }
      initialRender.current = false; // Set flag to false after first run
    }
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Role-Based Private Routes */}
        <Route
          path="manageusers"
          element={
            <PrivateRoute roles={['Admin']}>
              <ManageUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="managecreators"
          element={
            <PrivateRoute roles={['Admin']}>
              <ManageCreators />
            </PrivateRoute>
          }
        />
        <Route
          path="usersrequests"
          element={
            <PrivateRoute roles={['Admin']}>
              <UserRequest />
            </PrivateRoute>
          }
        />
        <Route
          path="creatorrequests"
          element={
            <PrivateRoute roles={['Admin']}>
              <CreatorRequest />
            </PrivateRoute>
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute roles={['User', 'Creator']}>
              <Profile/>
            </PrivateRoute>
          }
        />

        <Route
          path="recipesearch"
          element={
            <PrivateRoute roles={['User', 'Creator']}>
              <RecipeSearchPage/>
            </PrivateRoute>
          }
        />

        <Route
          path="mealplanner"
          element={
            <PrivateRoute roles={['User', 'Creator']}>
              <MealPlanner/>
            </PrivateRoute>
          }
        />

        <Route
          path="dashboard"
          element={
            <PrivateRoute roles={['User', 'Creator']}>
              <div>Dashboard</div>
            </PrivateRoute>
          }
        />

        <Route
          path="postsbycreators"
          element={
            <PrivateRoute roles={['User', 'Creator']}>
              <PostPage />
            </PrivateRoute>
          }
        />

        <Route
          path="explorenearby"
          element={
            <PrivateRoute roles={['User', 'Creator']}>
              <Explore />
            </PrivateRoute>
          }
        />

        <Route
          path="messages"
          element={
            <PrivateRoute roles={['User', 'Creator', 'Admin']}>
              <div>Messages</div>
            </PrivateRoute>
          }
        />

        <Route
          path="makeapost"
          element={
            <PrivateRoute roles={['Creator']}>
              <CreatePost />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/notfound" element={<NotFound />} />
    </Routes>
  );
}

export default App;
