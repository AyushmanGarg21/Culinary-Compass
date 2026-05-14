import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIngredients } from "../../redux/features/utils/masterSlice";

// Colour + emoji config per ingredient_type (fallback for unknown types)
const TYPE_CONFIG = {
  vegetables: { label: "Vegetables", emoji: "🥬", border: "border-green-200 hover:border-green-400", search: "border-green-300 focus:ring-green-500 focus:border-green-500" },
  protein:    { label: "Protein",    emoji: "🥩", border: "border-red-200 hover:border-red-400",   search: "border-red-300 focus:ring-red-500 focus:border-red-500" },
  dairy:      { label: "Dairy",      emoji: "🧀", border: "border-blue-200 hover:border-blue-400",  search: "border-blue-300 focus:ring-blue-500 focus:border-blue-500" },
  grains:     { label: "Grains",     emoji: "🌾", border: "border-yellow-200 hover:border-yellow-400", search: "border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500" },
};

const DEFAULT_CONFIG = { label: "", emoji: "🍴", border: "border-gray-200 hover:border-gray-400", search: "border-gray-300 focus:ring-gray-500 focus:border-gray-500" };

const getConfig = (type) => TYPE_CONFIG[type?.toLowerCase()] || { ...DEFAULT_CONFIG, label: type || "Other" };

const IngredientSelector = ({ selectedIngredients, setIngredients }) => {
  const dispatch = useDispatch();
  const { ingredients, loadingIngredients } = useSelector((state) => state.master);

  const [searchTerms, setSearchTerms] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRefs = useRef({});

  // Fetch once on mount
  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  // Group ingredients by ingredient_type
  const grouped = useMemo(() => {
    return ingredients.reduce((acc, item) => {
      const type = item.ingredient_type || item.type || "other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
  }, [ingredients]);

  const addIngredient = (name) => {
    if (!selectedIngredients.includes(name)) {
      setIngredients([...selectedIngredients, name]);
    }
  };

  const removeIngredient = (name) => {
    setIngredients(selectedIngredients.filter((i) => i !== name));
  };

  const getFiltered = (type) => {
    const term = (searchTerms[type] || "").toLowerCase();
    return (grouped[type] || []).filter((i) =>
      (i.name || "").toLowerCase().includes(term)
    );
  };

  const scrollLeft = (type) => scrollRefs.current[type]?.scrollBy({ left: -200, behavior: "smooth" });
  const scrollRight = (type) => scrollRefs.current[type]?.scrollBy({ left: 200, behavior: "smooth" });

  const categoryTypes = Object.keys(grouped);

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
            <span>{isExpanded ? "Collapse" : "Expand"}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className={`transition-all duration-500 ease-in-out ${isExpanded ? "max-h-none opacity-100" : "max-h-32 opacity-60"}`}>

          {/* ── Collapsed preview ── */}
          {!isExpanded && (
            <div className="relative">
              <div
                className="flex items-center justify-center space-x-6 py-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300 cursor-pointer"
                onClick={() => setIsExpanded(true)}
              >
                {loadingIngredients ? (
                  <div className="flex items-center space-x-3 text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                    <span className="text-sm">Loading ingredients…</span>
                  </div>
                ) : (
                  categoryTypes.slice(0, 4).map((type, i) => {
                    const cfg = getConfig(type);
                    return (
                      <div key={type} className="text-center animate-bounce" style={{ animationDelay: `${i * 200}ms` }}>
                        <div className="text-3xl mb-1">{cfg.emoji}</div>
                        <div className="text-xs text-gray-600">{cfg.label}</div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="absolute inset-0 rounded-xl border-2 border-orange-300 opacity-0 animate-pulse pointer-events-none"></div>
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                Click to expand
              </div>
            </div>
          )}

          {/* ── Expanded view ── */}
          {isExpanded && (
            <>
              {loadingIngredients ? (
                <div className="flex items-center justify-center py-12 space-x-3 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span>Loading ingredients…</span>
                </div>
              ) : (
                categoryTypes.map((type) => {
                  const cfg = getConfig(type);
                  const filtered = getFiltered(type);
                  const total = (grouped[type] || []).length;
                  const isSearching = (searchTerms[type] || "").length > 0;

                  return (
                    <div key={type} className="mb-6 animate-fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md font-medium text-gray-600 flex items-center">
                          <span className="text-lg mr-2">{cfg.emoji}</span>
                          {cfg.label}
                          <span className="ml-2 text-sm text-gray-400">({total})</span>
                        </h3>

                        {/* Per-category search */}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder={`Search ${cfg.label.toLowerCase()}…`}
                            value={searchTerms[type] || ""}
                            onChange={(e) => setSearchTerms((prev) => ({ ...prev, [type]: e.target.value }))}
                            className={`px-3 py-1 text-sm border rounded-lg focus:ring-2 outline-none w-48 ${cfg.search}`}
                          />
                          {searchTerms[type] && (
                            <button
                              onClick={() => setSearchTerms((prev) => ({ ...prev, [type]: "" }))}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Horizontal scroll row */}
                      <div className="relative group">
                        <button
                          onClick={() => scrollLeft(type)}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => scrollRight(type)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        <div
                          ref={(el) => (scrollRefs.current[type] = el)}
                          className="flex overflow-x-auto scrollbar-hide space-x-3 pb-2"
                          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                          {filtered.map((ingredient) => {
                            const selected = selectedIngredients.includes(ingredient.name);
                            return (
                              <button
                                key={ingredient.id ?? ingredient.name}
                                onClick={() => addIngredient(ingredient.name)}
                                disabled={selected}
                                className={`flex-shrink-0 p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 w-24 ${
                                  selected
                                    ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : `${cfg.border} bg-white text-gray-700 hover:shadow-md`
                                }`}
                              >
                                <div className="text-2xl mb-1">{ingredient.emoji || cfg.emoji}</div>
                                <div className="text-xs font-medium text-center leading-tight">{ingredient.name}</div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                      </div>

                      {isSearching && (
                        <div className="mt-2 text-sm text-gray-500">
                          {filtered.length === 0
                            ? `No ${cfg.label.toLowerCase()} found matching "${searchTerms[type]}"`
                            : `Found ${filtered.length} ${cfg.label.toLowerCase()}`}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>

      {/* Selected ingredients */}
      {selectedIngredients.length > 0 && (
        <div className="p-6 rounded-xl border border-amber-100" style={{ backgroundColor: "#FFFCF5" }}>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="mr-2">🛒</span>
            Selected Ingredients ({selectedIngredients.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((name, index) => (
              <div
                key={index}
                className="group flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
              >
                <span className="font-medium text-gray-700">{name}</span>
                <button
                  onClick={() => removeIngredient(name)}
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
