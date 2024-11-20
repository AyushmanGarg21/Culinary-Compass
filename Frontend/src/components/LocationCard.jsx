import React from "react";
import { LocationOn } from "@mui/icons-material";

const LocationCard = ({ place, distance }) => {
  const handleRedirect = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div
      className="p-4 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform cursor-pointer"
      onClick={handleRedirect}
    >
      <div className="flex items-center space-x-4">
        <LocationOn className="text-red-500" />
        <h3 className="text-lg font-bold">{place.tags.name || "Restaurant"}</h3>
      </div>
      
      <div className="text-sm text-gray-600 mt-2">
        <p>{place.tags.cuisine ? `Cuisine: ${place.tags.cuisine}` : "Cuisine: N/A"}</p>
        {place.tags.phone && <p>Phone: {place.tags.phone}</p>}
        {place.tags.address && <p>Address: {place.tags.address}</p>}
        <p className="text-blue-600 font-medium mt-1">Distance: {distance.toFixed(2)} km</p>
      </div>
    </div>
  );
};

export default LocationCard;
