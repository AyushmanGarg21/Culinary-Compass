import React, { useState } from "react";

const LocationCard = ({ place, distance, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleRedirect = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`;
    window.open(googleMapsUrl, "_blank");
  };

  const getCuisineEmoji = (cuisine) => {
    const emojiMap = {
      italian: '🍝',
      chinese: '🥢',
      indian: '🍛',
      mexican: '🌮',
      japanese: '🍣',
      american: '🍔',
      french: '🥐',
      thai: '🍜',
      pizza: '🍕'
    };

    if (!cuisine) return '🍽️';

    const lowerCuisine = cuisine.toLowerCase();
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lowerCuisine.includes(key)) {
        return emoji;
      }
    }
    return '🍽️';
  };

  const getDistanceColor = (dist) => {
    if (dist < 1) return 'text-green-600';
    if (dist < 3) return 'text-yellow-600';
    return 'text-orange-600';
  };

  if (viewMode === 'list') {
    return (
      <div
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-6"
        onClick={handleRedirect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ transform: isHovered ? 'translateY(-4px)' : 'translateY(0)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{getCuisineEmoji(place.tags.cuisine)}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {place.tags.name || "Restaurant"}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {place.tags.cuisine && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {place.tags.cuisine}
                  </span>
                )}
                <span className={`font-medium ${getDistanceColor(distance)}`}>
                  📍 {distance.toFixed(2)} km
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {place.tags.phone && (
              <div className="text-gray-400">📞</div>
            )}
            <svg
              className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={handleRedirect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)' }}
    >
      {/* Header with emoji and name */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl">{getCuisineEmoji(place.tags.cuisine)}</div>
          <div className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {place.tags.name || "Restaurant"}
        </h3>

        {place.tags.cuisine && (
          <span className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
            {place.tags.cuisine}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="px-6 pb-4">
        <div className="space-y-2 text-sm text-gray-600">
          {place.tags.phone && (
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span>{place.tags.phone}</span>
            </div>
          )}

          {place.tags.address && (
            <div className="flex items-center space-x-2">
              <span>📍</span>
              <span>{place.tags.address}</span>
            </div>
          )}

          {place.tags.opening_hours && (
            <div className="flex items-center space-x-2">
              <span>🕒</span>
              <span>{place.tags.opening_hours}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer with distance */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Open now</span>
          </div>
          <div className={`font-semibold ${getDistanceColor(distance)}`}>
            {distance.toFixed(2)} km away
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;