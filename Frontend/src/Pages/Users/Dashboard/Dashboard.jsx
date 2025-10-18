import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import {
  fetchUserProfile,
  fetchTodaysMeals,
  fetchTopPosts,
  updateTimeOfDay
} from '../../../redux/features/Users/dashboardSlice';
import WelcomeSection from '../../../components/dashboard/WelcomeSection';
import TodaysMeals from '../../../components/dashboard/TodaysMeals';
import CalorieTracker from '../../../components/dashboard/CalorieTracker';
import FeedSection from '../../../components/dashboard/FeedSection';
import LoadingSpinner from '../../../components/common/LoadingSpinner'

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchTodaysMeals());
    dispatch(fetchTopPosts());

    // Update time of day every minute
    const interval = setInterval(() => {
      dispatch(updateTimeOfDay());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleEditMeals = () => {
    navigate('/mealplanner');
  };

  const handleViewPosts = () => {
    navigate('/postsbycreators');
  };

  if (loading && !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <WelcomeSection />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Meals - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <TodaysMeals onEditMeals={handleEditMeals} />
          </div>

          {/* Right Sidebar - Takes 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Calorie Tracker */}
            <CalorieTracker />

            {/* Feed Section */}
            <FeedSection onViewPosts={handleViewPosts} />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-pulse">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;