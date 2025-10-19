import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './MealPlanner.css';
import {
  fetchMealTypes,
  fetchMealOptions,
  fetchWeeklyPlan,
  copyPreviousWeek,
  setEditingMeal,
  saveWeeklyPlan
} from '../../../redux/features/Users/mealPlannerSlice';
import WeeklyCalendar from '../../../components/MealPlanner/WeeklyCalendar';
import MealEditModal from '../../../components/MealPlanner/MealEditModal';
import LoadingSpinner from '../../../components/common/LoadingSpinner'

const MealPlanner = () => {
  const dispatch = useDispatch();
  const {
    currentWeekPlan,
    currentWeekOffset,
    loading,
    saving,
    error,
    editingMeal,
    lastSaved
  } = useSelector(state => state.mealPlanner);

  useEffect(() => {
    dispatch(fetchMealTypes());
    dispatch(fetchMealOptions());
    dispatch(fetchWeeklyPlan(0));
  }, [dispatch]);

  const handlePreviousWeek = () => {
    dispatch(fetchWeeklyPlan(currentWeekOffset - 1));
  };

  const handleNextWeek = () => {
    dispatch(fetchWeeklyPlan(currentWeekOffset + 1));
  };

  const handleCopyPreviousWeek = () => {
    dispatch(copyPreviousWeek());
    // In a real implementation, this would copy actual data
    alert('Previous week plan copied! (Feature simulated)');
  };

  const handleSaveWeeklyPlan = () => {
    dispatch(saveWeeklyPlan());
  };

  const handleMealClick = (date, mealType, currentMeal) => {
    dispatch(setEditingMeal({ date, mealType, currentMeal }));
  };

  if (loading && Object.keys(currentWeekPlan).length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 mb-4 sm:mb-6 animate-in slide-in-from-top duration-500">
          {/* Mobile Layout */}
          <div className="sm:hidden">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                🍽️ Meal Planner
              </h1>
              {lastSaved && (
                <p className="text-xs text-gray-500 mt-1">
                  Last saved: {new Date(lastSaved).toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousWeek}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyPreviousWeek}
                  title="Copy Previous Week"
                  className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>

                <button
                  onClick={handleSaveWeeklyPlan}
                  disabled={saving}
                  title="Save Weekly Plan"
                  className="p-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:transform-none"
                >
                  {saving ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                onClick={handleNextWeek}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg text-sm font-medium"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <button
              onClick={handlePreviousWeek}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-xl font-medium group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Week
            </button>

            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
                🍽️ Meal Planner
              </h1>
              {lastSaved && (
                <p className="text-sm text-gray-500 mt-2 bg-gray-100 px-3 py-1 rounded-full inline-block">
                  💾 Last saved: {new Date(lastSaved).toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyPreviousWeek}
                title="Copy Previous Week"
                className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl transition-all transform hover:scale-105 shadow-lg group"
              >
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>

              <button
                onClick={handleSaveWeeklyPlan}
                disabled={saving}
                title="Save Weekly Plan"
                className="p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl transition-all transform hover:scale-105 shadow-lg group disabled:transform-none"
              >
                {saving ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleNextWeek}
                className="flex items-center px-6 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-xl font-medium group"
              >
                Next Week
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-xl">⚠️</span>
              <p className="text-red-800 font-medium">Error: {error}</p>
            </div>
          </div>
        )}

        {/* Enhanced Weekly Calendar */}
        <div className="animate-in slide-in-from-bottom duration-700">
          <WeeklyCalendar
            weekPlan={currentWeekPlan}
            onMealClick={handleMealClick}
            loading={loading}
          />
        </div>

        {/* Edit Modal */}
        {editingMeal && (
          <MealEditModal />
        )}
      </div>
    </div>
  );
};

export default MealPlanner;