import { useState } from "react";
import { useSelector } from "react-redux";
import { 
  PersonAddAlt1Rounded as PersonAddAlt1RoundedIcon, 
  PersonRemoveRounded as PersonRemoveRoundedIcon,
  LocationOn as LocationOnIcon, 
  Restaurant as RestaurantIcon, 
  Person as PersonIcon, 
  Language as LanguageIcon 
} from '@mui/icons-material';
import { Chip, IconButton, Tooltip, Fade } from '@mui/material';

const UserCard = ({ id }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Fetch user data from Redux store
  const user = useSelector((state) =>
    state.users.users.find((user) => user.id === id)
  );

  if (!user) {
    return (
      <div className="w-full max-w-xs bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 text-center border border-red-200">
        <div className="text-red-500 mb-2">⚠️</div>
        <div className="text-gray-600">User not found</div>
      </div>
    );
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const getFoodPreferenceColor = (preference) => {
    switch (preference?.toLowerCase()) {
      case 'veg':
      case 'vegetarian':
        return 'bg-green-100 text-green-800';
      case 'vegan':
        return 'bg-emerald-100 text-emerald-800';
      case 'non-veg':
      case 'non-vegetarian':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Profile Image with Gradient Overlay */}
        <div className="relative h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
          <img
            src={user.profileImage || "https://via.placeholder.com/100"}
            alt={`${user.name}'s profile`}
            className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
          />
        </div>

        {/* User Details */}
        <div className="pt-10 pb-4 px-4">
          {/* Name and Follow Button */}
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-base font-bold text-gray-800 flex-1">{user.name}</h2>
            <Tooltip title={isFollowing ? "Unfollow" : "Follow"}>
              <IconButton
                onClick={handleFollow}
                className={`ml-2 transition-all duration-300 ${
                  isFollowing 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
                size="small"
              >
                {isFollowing ? (
                  <PersonRemoveRoundedIcon fontSize="small" />
                ) : (
                  <PersonAddAlt1RoundedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </div>

          {/* About Me */}
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {user.aboutMe || "No information available."}
          </p>

          {/* User Info Grid */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <LocationOnIcon className="text-blue-500 text-sm" />
              <span className="text-gray-700 text-xs">
                {user.city ? `${user.city}, ${user.country}` : user.country || "N/A"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <RestaurantIcon className="text-orange-500 text-sm" />
              <Chip 
                label={user.foodPreference || "N/A"}
                size="small"
                className={`text-xs ${getFoodPreferenceColor(user.foodPreference)}`}
              />
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <PersonIcon className="text-purple-500 text-sm" />
              <span className="text-gray-700 text-xs">{user.gender || "N/A"}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <LanguageIcon className="text-green-500 text-sm" />
              <span className="text-gray-700 text-xs">{user.language || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default UserCard;
