import React, { useState } from 'react';
import { Typography, IconButton, Chip, Tooltip, Fade } from '@mui/material';
import { 
  PersonRemoveRounded as PersonRemoveRoundedIcon, 
  FiberManualRecord as FiberManualRecordIcon,
  Group as GroupIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFollow } from '../../redux/features/FollowedUsers/followedUsersSlice';

const UserFollowedCard = ({ user }) => {
  const dispatch = useDispatch();
  const { followingIds } = useSelector((state) => state.followedUsers);
  const [isHovered, setIsHovered] = useState(false);
  
  const isFollowing = followingIds.includes(user.id);

  const handleToggleFollow = () => {
    dispatch(toggleFollow(user.id));
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

  const formatLastActive = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Fade in={true} timeout={300}>
      <div 
        className={`flex items-center p-3 bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-300 cursor-pointer ${
          isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow-md'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Profile Image */}
        <div className="relative">
          <img
            src={user.image}
            alt={user.username}
            className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 ml-3 min-w-0">
          <Typography 
            variant="subtitle2" 
            className="font-semibold text-gray-800 truncate"
          >
            {user.username}
          </Typography>
          
          <div className="flex items-center space-x-2 mt-1">
            <Chip 
              label={user.foodPreference}
              size="small"
              className={`text-xs ${getFoodPreferenceColor(user.foodPreference)}`}
            />
          </div>

          <div className="text-xs text-gray-500 mt-1">
            <span>{formatLastActive(user.lastActive)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 ml-2">
          <Tooltip title="Send Message">
            <IconButton 
              size="small"
              className="text-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              <MessageIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={isFollowing ? "Unfollow" : "Follow"}>
            <IconButton 
              onClick={handleToggleFollow}
              size="small"
              className={`transition-all duration-200 ${
                isFollowing 
                  ? 'text-red-500 hover:bg-red-50' 
                  : 'text-green-500 hover:bg-green-50'
              }`}
            >
              <PersonRemoveRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Fade>
  );
};

export default UserFollowedCard;
