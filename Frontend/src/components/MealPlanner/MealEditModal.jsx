import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearEditingMeal,
  saveMealPlan,
  addCustomMeal,
  fetchMealOptions,
} from '../../redux/features/Users/mealPlannerSlice';

const MealEditModal = () => {
  const dispatch = useDispatch();
  const { editingMeal, mealOptions, loadingMealOptions } = useSelector(
    (state) => state.mealPlanner
  );

  const [selectedMeal, setSelectedMeal] = useState(editingMeal?.currentMeal || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customMealName, setCustomMealName] = useState('');
  const [customMealCalories, setCustomMealCalories] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Animate in + fetch meals if not yet loaded
  useEffect(() => {
    if (editingMeal) {
      setIsVisible(true);
      if (Object.keys(mealOptions).length === 0 && !loadingMealOptions) {
        dispatch(fetchMealOptions());
      }
    }
  }, [editingMeal, dispatch, mealOptions, loadingMealOptions]);

  if (!editingMeal) return null;

  const { date, mealType } = editingMeal;

  // Show only meals matching this slot's type
  const pooledMeals = mealOptions[mealType] || [];

  const filteredMeals = pooledMeals.filter((meal) =>
    (meal.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (selectedMeal) {
      dispatch(saveMealPlan({ date, mealType, meal: selectedMeal }));
    }
    dispatch(clearEditingMeal());
  };

  const handleAddCustomMeal = async () => {
    if (customMealName.trim() && customMealCalories) {
      const result = await dispatch(
        addCustomMeal({ mealType, name: customMealName.trim(), calories: customMealCalories })
      );
      if (result.payload) {
        setSelectedMeal(result.payload.meal);
        setShowCustomForm(false);
        setCustomMealName('');
        setCustomMealCalories('');
      }
    }
  };

  const handleRemove = () => {
    dispatch(saveMealPlan({ date, mealType, meal: null }));
    dispatch(clearEditingMeal());
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => dispatch(clearEditingMeal()), 200);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMealTypeLabel = (type) => {
    const labels = {
      breakfast: 'Breakfast',
      brunch: 'Brunch',
      lunch: 'Lunch',
      morningSnack: 'Morning Snack',
      eveningSnack: 'Evening Snack',
      dinner: 'Dinner',
      highTea: 'High Tea',
      supper: 'Supper',
      elevenses: 'Elevenses',
      afternoonTea: 'Afternoon Tea',
      midnightSnack: 'Midnight Snack',
    };
    return labels[type] || type;
  };

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-200 z-50 flex items-center justify-center p-4 ${
        isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col transform transition-all duration-200 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🍽️</span>
                {getMealTypeLabel(mealType)}
              </h2>
              <p className="text-xs text-gray-500 mt-1">{formatDate(date)}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search + custom meal */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-3"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-sm font-medium"
          >
            ➕ Add Custom Meal
          </button>

          {showCustomForm && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg space-y-2">
              <input
                type="text"
                placeholder="Meal name"
                value={customMealName}
                onChange={(e) => setCustomMealName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <input
                type="number"
                placeholder="Calories"
                value={customMealCalories}
                onChange={(e) => setCustomMealCalories(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddCustomMeal}
                  disabled={!customMealName.trim() || !customMealCalories}
                  className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => { setShowCustomForm(false); setCustomMealName(''); setCustomMealCalories(''); }}
                  className="px-3 py-2 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Meal list */}
        <div className="flex-1 overflow-y-auto">
          {loadingMealOptions ? (
            /* ── Loading state ── */
            <div className="flex flex-col items-center justify-center py-16 space-y-3 text-gray-500">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                <span className="absolute inset-0 flex items-center justify-center text-lg">🍽️</span>
              </div>
              <p className="text-sm">Loading meals…</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredMeals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-sm">No meals found</p>
                  {searchTerm && (
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
                  )}
                </div>
              ) : (
                filteredMeals.map((meal, index) => (
                  <div
                    key={meal.id ?? index}
                    className={`p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedMeal?.id === meal.id
                        ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedMeal(meal)}
                    style={{ animationDelay: `${index * 50}ms`, animation: 'fadeInUp 0.3s ease-out forwards' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Meal image or emoji fallback */}
                        {meal.image ? (
                          <img
                            src={meal.image}
                            alt={meal.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'inline';
                            }}
                          />
                        ) : null}
                        <span
                          className="text-2xl flex-shrink-0"
                          style={{ display: meal.image ? 'none' : 'inline' }}
                        >
                          🍽️
                        </span>

                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm truncate">{meal.name}</h3>
                          <p className="text-xs text-blue-600 font-medium">{meal.calories} cal</p>
                        </div>

                        {meal.isCustom && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-auto flex-shrink-0">
                            Custom
                          </span>
                        )}
                      </div>

                      {selectedMeal?.id === meal.id && (
                        <div className="text-blue-600 ml-2 flex-shrink-0">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex gap-2">
            {editingMeal.currentMeal && (
              <button
                onClick={handleRemove}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg text-sm font-medium"
              >
                🗑️ Remove
              </button>
            )}
            <div className="flex-1" />
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 transition-colors rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedMeal}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              💾 Save
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MealEditModal;
