import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearEditingMeal,
  saveMealPlan,
  addCustomMeal
} from '../../redux/features/Users/mealPlannerSlice';

const MealEditModal = () => {
  const dispatch = useDispatch();
  const { editingMeal, mealOptions } = useSelector(state => state.mealPlanner);
  const [selectedMeal, setSelectedMeal] = useState(editingMeal?.currentMeal || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customMealName, setCustomMealName] = useState('');
  const [customMealCalories, setCustomMealCalories] = useState('');

  if (!editingMeal) return null;

  const { date, mealType } = editingMeal;
  const availableMeals = mealOptions[mealType] || [];

  const filteredMeals = availableMeals.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (selectedMeal) {
      dispatch(saveMealPlan({
        date,
        mealType,
        meal: selectedMeal
      }));
    }
    dispatch(clearEditingMeal());
  };

  const handleAddCustomMeal = async () => {
    if (customMealName.trim() && customMealCalories) {
      const result = await dispatch(addCustomMeal({
        mealType,
        name: customMealName.trim(),
        calories: customMealCalories
      }));

      if (result.payload) {
        setSelectedMeal(result.payload.meal);
        setShowCustomForm(false);
        setCustomMealName('');
        setCustomMealCalories('');
      }
    }
  };

  const handleCancelCustom = () => {
    setShowCustomForm(false);
    setCustomMealName('');
    setCustomMealCalories('');
  };

  const handleRemove = () => {
    dispatch(saveMealPlan({
      date,
      mealType,
      meal: null
    }));
    dispatch(clearEditingMeal());
  };

  const handleClose = () => {
    dispatch(clearEditingMeal());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMealTypeLabel = (type) => {
    const labels = {
      breakfast: 'Breakfast',
      brunch: 'Brunch',
      lunch: 'Lunch',
      morningSnack: 'Morning Snack',
      eveningSnack: 'Evening Snack',
      dinner: 'Dinner'
    };
    return labels[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Edit {getMealTypeLabel(mealType)}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {formatDate(date)}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search and Add Custom */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
            <input
              type="text"
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap text-sm sm:text-base"
            >
              Add Custom
            </button>
          </div>

          {/* Custom Meal Form */}
          {showCustomForm && (
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">Add Custom Meal</h4>
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Meal name"
                  value={customMealName}
                  onChange={(e) => setCustomMealName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
                <input
                  type="number"
                  placeholder="Calories"
                  value={customMealCalories}
                  onChange={(e) => setCustomMealCalories(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={handleAddCustomMeal}
                  disabled={!customMealName.trim() || !customMealCalories}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add Meal
                </button>
                <button
                  onClick={handleCancelCustom}
                  className="px-3 py-2 text-gray-600 text-sm rounded hover:text-gray-800 transition-colors border border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Meal Options */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
          <div className="space-y-2 sm:space-y-3">
            {filteredMeals.map((meal) => (
              <div
                key={meal.id}
                className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${selectedMeal?.id === meal.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                onClick={() => setSelectedMeal(meal)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-3">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      {meal.name}
                      {meal.isCustom && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Custom
                        </span>
                      )}
                    </h3>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                      <span>{meal.calories} calories</span>
                    </div>
                  </div>
                  {selectedMeal?.id === meal.id && (
                    <div className="text-blue-600 flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredMeals.length === 0 && (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No meals found matching "{searchTerm}"
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 flex-shrink-0">
          {/* Mobile Layout */}
          <div className="sm:hidden space-y-3">
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors border border-gray-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedMeal}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Save
              </button>
            </div>
            {editingMeal.currentMeal && (
              <button
                onClick={handleRemove}
                className="w-full px-4 py-2 text-red-600 hover:text-red-700 transition-colors border border-red-300 rounded-lg text-sm"
              >
                Remove Meal
              </button>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex justify-between">
            <div>
              {editingMeal.currentMeal && (
                <button
                  onClick={handleRemove}
                  className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  Remove Meal
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedMeal}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealEditModal;