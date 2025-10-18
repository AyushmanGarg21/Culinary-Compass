import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../../redux/features/Users/recipeSlice";
import IngredientSelector from "./IngredientSelector";

const RecipeSearch = () => {
  const [ingredients, setIngredients] = useState([]);
  const [dietaryPreference, setDietaryPreference] = useState("None");
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.recipes);
  const dietaryScrollRef = useRef(null);

  const handleSearch = async () => {
    if (ingredients.length === 0) {
      // Add shake animation for empty ingredients
      const searchContainer = document.getElementById('search-container');
      searchContainer.classList.add('animate-shake');
      setTimeout(() => searchContainer.classList.remove('animate-shake'), 500);
      return;
    }
    
    setIsSearching(true);
    dispatch(fetchRecipes({ ingredients, dietaryPreference }));
    setTimeout(() => setIsSearching(false), 1000);
  };

  const dietaryOptions = [
    { value: "None", emoji: "🍽️", label: "All Recipes" },
    { value: "Vegan", emoji: "🌱", label: "Vegan" },
    { value: "Vegetarian", emoji: "🥬", label: "Vegetarian" },
    { value: "Gluten-Free", emoji: "🌾", label: "Gluten-Free" },
    { value: "Keto", emoji: "🥑", label: "Keto" },
    { value: "Paleo", emoji: "🥩", label: "Paleo" }
  ];

  const scrollDietaryLeft = () => {
    if (dietaryScrollRef.current) {
      dietaryScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollDietaryRight = () => {
    if (dietaryScrollRef.current) {
      dietaryScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div 
      id="search-container"
      className="bg-white rounded-2xl shadow-xl p-8 border border-violet-100 hover:shadow-2xl transition-all duration-300"
    >


      <div className="space-y-8">
        <IngredientSelector
          selectedIngredients={ingredients}
          setIngredients={setIngredients}
        />

        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            🥗 Dietary Preferences:
          </label>
          
          {/* Horizontal scrolling container */}
          <div className="relative group">
            {/* Left scroll button */}
            <button
              onClick={scrollDietaryLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right scroll button */}
            <button
              onClick={scrollDietaryRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div 
              ref={dietaryScrollRef}
              className="flex overflow-x-auto scrollbar-hide space-x-3 pb-2" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {dietaryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDietaryPreference(option.value)}
                  className={`flex-shrink-0 p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 w-28 ${
                    dietaryPreference === option.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-lg'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="font-medium text-xs text-center leading-tight">{option.label}</div>
                </button>
              ))}
            </div>
            
            {/* Gradient fade on right */}
            <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <button
            onClick={handleSearch}
            disabled={loading || isSearching}
            className={`group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
              isSearching ? 'animate-pulse' : ''
            }`}
          >
            <span className="flex items-center space-x-2">
              {loading || isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Search Recipes</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </span>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>

        {ingredients.length === 0 && (
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">
              💡 <strong>Tip:</strong> Select at least one ingredient to start your recipe search!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeSearch;
