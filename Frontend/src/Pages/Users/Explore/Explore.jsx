import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import LocationCard from '../../../components/LocationCard';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

const Explore = () => {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (location) {
      fetchRestaurants(location);
    }
  }, [location]);

  const fetchRestaurants = async (location) => {
    const query = `[out:json];node["amenity"="restaurant"](around:10000,${location.lat},${location.lng});out;`;
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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => alert('Could not retrieve location')
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        
        <Button
          onClick={handleFindLocation}
          variant="contained"
          startIcon={<LocationOn />}
          className="ml-4 px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full shadow-md hover:shadow-lg transition"
        >
          Find Nearby Restaurants
        </Button>
      </div>

      {location ? (
        <>
          <MapContainer
            center={location}
            zoom={14}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={location}>
              <Popup>Your Location</Popup>
            </Marker>
            {restaurants.map((place) => (
              <Marker
                key={place.id}
                position={{ lat: place.lat, lng: place.lon }}
              >
                <Popup>{place.tags.name || 'Restaurant'}</Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((place) => (
              <LocationCard
                key={place.id}
                place={place}
                distance={place.distance}
              />
            ))}
          </div>
        </>
      ) : (
        <div>Please enable location to find nearby restaurants.</div>
      )}
    </div>
  );
};

export default Explore;
