import React, { useState, useRef } from "react";
import ingredientsData from "../../data/ingredients.json";

const IngredientSelector = ({ selectedIngredients, setIngredients }) => {
  const [searchTerms, setSearchTerms] = useState({
    vegetables: "",
    protein: "",
    dairy: "",
    grains: ""
  });
  const [isExpanded, setIsExpanded] = useState(true);

  const scrollRefs = useRef({});


  const categories = {
    vegetables: { name: "Vegetables", color: "green", emoji: "🥬" },
    protein: { name: "Protein", color: "red", emoji: "🥩" },
    dairy: { name: "Dairy", color: "blue", emoji: "🧀" },
    grains: { name: "Grains", color: "yellow", emoji: "🌾" }
  };

  const addIngredient = (ingredient) => {
    if (!selectedIngredients.includes(ingredient)) {
      setIngredients([...selectedIngredients, ingredient]);
    }
  };

  const removeIngredient = (ingredient) => {
    setIngredients(selectedIngredients.filter(item => item !== ingredient));
  };

  const getCategoryBorder = (category) => {
    const colors = {
      vegetables: "border-green-200 hover:border-green-400",
      protein: "border-red-200 hover:border-red-400",
      dairy: "border-blue-200 hover:border-blue-400",
      grains: "border-yellow-200 hover:border-yellow-400"
    };
    return colors[category] || "border-gray-200 hover:border-gray-400";
  };

  const getSearchInputColors = (category) => {
    const colors = {
      vegetables: "border-green-300 focus:ring-green-500 focus:border-green-500",
      protein: "border-red-300 focus:ring-red-500 focus:border-red-500",
      dairy: "border-blue-300 focus:ring-blue-500 focus:border-blue-500",
      grains: "border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500"
    };
    return colors[category] || "border-gray-300 focus:ring-gray-500 focus:border-gray-500";
  };

  const getFilteredIngredients = (categoryKey) => {
    const searchTerm = searchTerms[categoryKey].toLowerCase();
    const ingredients = ingredientsData[categoryKey] || [];
    
    return ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchTerm)
    );
  };

  const handleSearchChange = (categoryKey, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [categoryKey]: value
    }));
  };

  const scrollLeft = (categoryKey) => {
    if (scrollRefs.current[categoryKey]) {
      scrollRefs.current[categoryKey].scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = (categoryKey) => {
    if (scrollRefs.current[categoryKey]) {
      scrollRefs.current[categoryKey].scrollBy({ left: 200, behavior: 'smooth' });
    }
  };



  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-lg font-semibold text-gray-700">
            🥘 Available Ingredients:
          </label>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <div 
          className={`transition-all duration-500 ease-in-out ${
            isExpanded ? 'max-h-none opacity-100' : 'max-h-32 opacity-60'
          }`}
        >
          {/* Collapsed preview */}
          {!isExpanded && (
            <div className="relative">
              {/* Preview of category emojis */}
              <div className="flex items-center justify-center space-x-6 py-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300 cursor-pointer"
                   onClick={() => setIsExpanded(true)}>
                <div className="text-center animate-bounce" style={{ animationDelay: '0ms' }}>
                  <div className="text-3xl mb-1">🥬</div>
                  <div className="text-xs text-gray-600">Vegetables</div>
                </div>
                <div className="text-center animate-bounce" style={{ animationDelay: '200ms' }}>
                  <div className="text-3xl mb-1">🥩</div>
                  <div className="text-xs text-gray-600">Protein</div>
                </div>
                <div className="text-center animate-bounce" style={{ animationDelay: '400ms' }}>
                  <div className="text-3xl mb-1">🧀</div>
                  <div className="text-xs text-gray-600">Dairy</div>
                </div>
                <div className="text-center animate-bounce" style={{ animationDelay: '600ms' }}>
                  <div className="text-3xl mb-1">🌾</div>
                  <div className="text-xs text-gray-600">Grains</div>
                </div>
              </div>
              
              {/* Pulsing border animation */}
              <div className="absolute inset-0 rounded-xl border-2 border-orange-300 opacity-0 animate-pulse pointer-events-none"></div>
              
              {/* Click to expand hint */}
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                Click to expand
              </div>
            </div>
          )}

          {/* Full expanded view */}
          {isExpanded && Object.entries(categories).map(([categoryKey, categoryInfo]) => {
            const filteredIngredients = getFilteredIngredients(categoryKey);
            const totalIngredients = ingredientsData[categoryKey]?.length || 0;
            const isSearching = searchTerms[categoryKey].length > 0;
            
            return (
              <div key={categoryKey} className="mb-6 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-medium text-gray-600 flex items-center">
                    <span className="text-lg mr-2">{categoryInfo.emoji}</span>
                    {categoryInfo.name}
                    <span className="ml-2 text-sm text-gray-400">({totalIngredients})</span>
                  </h3>
                  
                  {/* Search input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={`Search ${categoryInfo.name.toLowerCase()}...`}
                      value={searchTerms[categoryKey]}
                      onChange={(e) => handleSearchChange(categoryKey, e.target.value)}
                      className={`px-3 py-1 text-sm border rounded-lg focus:ring-2 outline-none w-48 ${getSearchInputColors(categoryKey)}`}
                    />
                    {searchTerms[categoryKey] && (
                      <button
                        onClick={() => handleSearchChange(categoryKey, "")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Horizontal scrolling container */}
                <div className="relative group">
                  {/* Left scroll button */}
                  <button
                    onClick={() => scrollLeft(categoryKey)}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Right scroll button */}
                  <button
                    onClick={() => scrollRight(categoryKey)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <div 
                    ref={el => scrollRefs.current[categoryKey] = el}
                    className="flex overflow-x-auto scrollbar-hide space-x-3 pb-2" 
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {filteredIngredients.map((ingredient, index) => (
                      <button
                        key={index}
                        onClick={() => addIngredient(ingredient.name)}
                        disabled={selectedIngredients.includes(ingredient.name)}
                        className={`flex-shrink-0 p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 w-24 ${
                          selectedIngredients.includes(ingredient.name)
                            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : `${getCategoryBorder(categoryKey)} bg-white text-gray-700 hover:shadow-md`
                        }`}
                      >
                        <div className="text-2xl mb-1">{ingredient.emoji}</div>
                        <div className="text-xs font-medium text-center leading-tight">{ingredient.name}</div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Gradient fade on right */}
                  <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                </div>

                {/* Search results info */}
                {isSearching && (
                  <div className="mt-2 text-sm text-gray-500">
                    {filteredIngredients.length === 0 
                      ? `No ${categoryInfo.name.toLowerCase()} found matching "${searchTerms[categoryKey]}"` 
                      : `Found ${filteredIngredients.length} ${categoryInfo.name.toLowerCase()}`
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected ingredients */}
      {selectedIngredients.length > 0 && (
        <div className="p-6 rounded-xl border border-amber-100" style={{ backgroundColor: '#FFFCF5' }}>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="mr-2">🛒</span>
            Selected Ingredients ({selectedIngredients.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((ingredient, index) => (
              <div
                key={index}
                className="group flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
              >
                <span className="font-medium text-gray-700">{ingredient}</span>
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full p-1 transition-all duration-200"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setIngredients([])}
            className="mt-4 text-sm text-gray-500 hover:text-green-600 transition-colors"
          >
            Clear all ingredients
          </button>
        </div>
      )}
    </div>
  );
};

export default IngredientSelector;
