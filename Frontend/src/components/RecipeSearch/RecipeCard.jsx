import React, { useState } from "react";

const RecipeCard = ({ recipe }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-violet-100 overflow-hidden">
      {/* Image container */}
      <div className="relative overflow-hidden">
        <div className="aspect-w-16 aspect-h-12 bg-gray-200">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-100 to-purple-100">
              <div className="text-4xl animate-pulse">🍽️</div>
            </div>
          )}
          <img
            src={recipe.image || '/api/placeholder/400/300'}
            alt={recipe.title}
            className={`w-full h-48 object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = '/api/placeholder/400/300';
              setImageLoaded(true);
            }}
          />
        </div>
        
        {/* Overlay with action buttons */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            {isLiked ? '❤️' : '🤍'}
          </button>

        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {recipe.description || "A delicious recipe that you'll love to make and share with family and friends."}
          </p>
        </div>

        {/* Action button */}
        <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group">
          <span className="flex items-center justify-center space-x-2">
            <span>👨‍🍳</span>
            <span>View Recipe</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
