import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import LocationCard from '../../../components/LocationCard';
import './Explore.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

const Explore = () => {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchRadius, setSearchRadius] = useState(10); // Default 10km radius

  useEffect(() => {
    if (location) {
      fetchRestaurants(location);
    }
  }, [location, searchRadius]);

  const fetchRestaurants = async (location) => {
    setLoading(true);
    try {
      const radiusInMeters = searchRadius * 1000; // Convert km to meters
      const query = `[out:json];node["amenity"="restaurant"](around:${radiusInMeters},${location.lat},${location.lng});out;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

      const response = await axios.get(url);
      const fetchedRestaurants = response.data.elements;

      // Map restaurants with calculated distances
      const restaurantsWithDistances = fetchedRestaurants.map((place) => {
        const distance = getDistanceFromLatLon(
          location.lat,
          location.lng,
          place.lat,
          place.lon
        );
        return { ...place, distance };
      });

      // Sort restaurants by distance
      const sortedRestaurants = restaurantsWithDistances.sort(
        (a, b) => a.distance - b.distance
      );

      setRestaurants(sortedRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDistanceFromLatLon = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // Distance in km
  };

  const handleFindLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert('Could not retrieve location');
        setLoading(false);
      }
    );
  };

  const cuisineTypes = ['all', 'italian', 'chinese', 'indian', 'mexican', 'japanese', 'american'];

  const filteredRestaurants = restaurants.filter(place => {
    const matchesSearch = !searchTerm ||
      (place.tags.name && place.tags.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (place.tags.cuisine && place.tags.cuisine.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = selectedFilter === 'all' ||
      (place.tags.cuisine && place.tags.cuisine.toLowerCase().includes(selectedFilter.toLowerCase()));

    return matchesSearch && matchesFilter;
  });

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
          <div className="skeleton h-4 w-3/4 mb-3"></div>
          <div className="skeleton h-3 w-1/2 mb-2"></div>
          <div className="skeleton h-3 w-2/3 mb-2"></div>
          <div className="skeleton h-3 w-1/3"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fadeInUp">
          <h1 className="text-4xl sm:text-6xl font-bold gradient-text mb-4">
            Explore Nearby 🍽️
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover amazing restaurants and cuisines around you
          </p>

          <button
            onClick={handleFindLocation}
            disabled={loading}
            className="btn-interactive bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Finding Location...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Find Nearby Restaurants</span>
              </div>
            )}
          </button>
        </div>

        {!location && !loading && (
          <div className="text-center py-16 animate-fadeInUp stagger-2">
            <div className="text-8xl mb-6 animate-bounce-custom">📍</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Ready to explore?
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Enable location access to discover amazing restaurants, cafes, and eateries near you with detailed information and directions.
            </p>
          </div>
        )}

        {location && (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-slideInLeft">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search restaurants, cuisines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Distance Slider */}
                <div className="flex flex-col items-center min-w-[200px]">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Search Radius: {searchRadius} km
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(searchRadius - 1) / 49 * 100}%, #e5e7eb ${(searchRadius - 1) / 49 * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between w-full text-xs text-gray-500 mt-1">
                    <span>1km</span>
                    <span>50km</span>
                  </div>
                </div>

                {/* Cuisine Filters */}
                <div className="flex flex-wrap gap-2">
                  {cuisineTypes.map((cuisine) => (
                    <button
                      key={cuisine}
                      onClick={() => setSelectedFilter(cuisine)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 filter-slide ${selectedFilter === cuisine
                          ? 'active'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                    </button>
                  ))}
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="mb-8 animate-slideInRight">
              <div className="map-container">
                <MapContainer
                  center={location}
                  zoom={14}
                  style={{ height: '450px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <Marker position={location}>
                    <Popup>
                      <div className="text-center">
                        <div className="text-lg font-semibold">📍 Your Location</div>
                        <p className="text-sm text-gray-600">You are here!</p>
                      </div>
                    </Popup>
                  </Marker>
                  {filteredRestaurants.map((place) => (
                    <Marker
                      key={place.id}
                      position={{ lat: place.lat, lng: place.lon }}
                    >
                      <Popup>
                        <div className="text-center">
                          <div className="font-semibold">{place.tags.name || 'Restaurant'}</div>
                          {place.tags.cuisine && (
                            <p className="text-sm text-gray-600">{place.tags.cuisine}</p>
                          )}
                          <p className="text-sm text-blue-600 font-medium">
                            {place.distance.toFixed(2)} km away
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Results Section */}
            <div className="animate-fadeInUp stagger-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Found {filteredRestaurants.length} restaurants
                </h2>
                <div className="text-sm text-gray-500">
                  Sorted by distance
                </div>
              </div>

              {loading ? (
                <LoadingSkeleton />
              ) : filteredRestaurants.length > 0 ? (
                <div className={`${viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                  }`}>
                  {filteredRestaurants.map((place, index) => (
                    <div
                      key={place.id}
                      className={`animate-fadeInUp stagger-${Math.min(index + 1, 6)}`}
                    >
                      <LocationCard
                        place={place}
                        distance={place.distance}
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No restaurants found within {searchRadius}km
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try increasing the search radius or adjusting your filter criteria
                  </p>
                  {searchRadius < 50 && (
                    <button
                      onClick={() => setSearchRadius(Math.min(searchRadius + 10, 50))}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Expand Search to {Math.min(searchRadius + 10, 50)}km
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
