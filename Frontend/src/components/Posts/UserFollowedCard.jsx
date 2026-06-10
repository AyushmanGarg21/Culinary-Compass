import React, { useState } from 'react';
import { Typography, IconButton, Chip, Tooltip, Fade, Avatar } from '@mui/material';
import { 
  PersonRemoveRounded as PersonRemoveRoundedIcon, 
  FiberManualRecord as FiberManualRecordIcon,
  Message as MessageIcon,
  LocalFlorist as LocalFloristIcon,
  Restaurant as RestaurantIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFollow } from '../../redux/features/FollowedUsers/followedUsersSlice';

const UserFollowedCard = ({ user }) => {
  const dispatch = useDispatch();
  const { followingIds } = useSelector((state) => state.followedUsers);
  const [isHovered, setIsHovered] = useState(false);
  
  const isFollowing = followingIds.includes(user.user_id);

  const handleToggleFollow = () => {
    dispatch(toggleFollow(user.user_id));
  };



  const getActiveStatus = (dateString) => {
    if (!dateString) return { text: 'Active', isOnline: false };
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return { text: 'Online', isOnline: true };
    if (diffInHours < 24) return { text: `${diffInHours}h ago`, isOnline: false };
    return { text: `${Math.floor(diffInHours / 24)}d ago`, isOnline: false };
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Fade in={true} timeout={300}>
      <div 
        className={`flex items-center p-2 bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-300 cursor-pointer ${
          isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow-md'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Profile Image */}
        <div className="relative shrink-0">
          {user.profile_pic ? (
            <img
              src={user.profile_pic}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
            />
          ) : (
            <Avatar 
              className="w-10 h-10 border-2 border-white shadow-sm"
              sx={{ bgcolor: '#8B5CF6', fontSize: '1rem' }}
            >
              {getInitials(user.name)}
            </Avatar>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 ml-3 min-w-0 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <Typography 
                variant="subtitle2" 
                className="font-semibold text-gray-800 truncate"
                sx={{ fontSize: '0.875rem' }}
              >
                {user.name}
              </Typography>
              
              {/* Food Preference Icon */}
              {user.food_preference && (() => {
                const pref = user.food_preference.toLowerCase();
                const isNonVeg = pref.includes('non');
                const isVegan = pref === 'vegan';
                
                let iconColor = isNonVeg ? 'border-red-600' : 'border-green-600';
                let dotColor = isNonVeg ? 'bg-red-600' : 'bg-green-600';
                
                if (isVegan) {
                  return (
                    <Tooltip title="Vegan" placement="top">
                      <LocalFloristIcon sx={{ fontSize: 14, color: '#10b981' }} className="shrink-0" />
                    </Tooltip>
                  );
                }

                return (
                  <Tooltip title={user.food_preference} placement="top">
                    <div className={`w-3.5 h-3.5 border flex items-center justify-center rounded-[2px] shrink-0 ${iconColor}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    </div>
                  </Tooltip>
                );
              })()}
            </div>
            
            {/* Activeness status */}
            <div className="flex items-center text-[10px] shrink-0 ml-2">
              {(() => {
                const status = getActiveStatus(user.last_active);
                return status.isOnline ? (
                  <span className="flex items-center text-green-500 font-medium">
                    <FiberManualRecordIcon sx={{ fontSize: 8 }} className="mr-1 animate-pulse" />
                    Online
                  </span>
                ) : (
                  <span className="flex items-center text-gray-400">
                    <AccessTimeIcon sx={{ fontSize: 10 }} className="mr-0.5" />
                    {status.text}
                  </span>
                );
              })()}
            </div>
          </div>
          
          <div className="flex items-center text-[11px] text-gray-500 truncate mt-0.5">
             {(user.city || user.country) && (
               <span className="shrink-0 flex items-center text-gray-400 mr-1.5">
                  <LocationOnIcon sx={{ fontSize: 12 }} className="mr-0.5"/>
                  {user.city || user.country}
                  <span className="mx-1.5">•</span>
               </span>
             )}
            <span className="truncate">{user.about_me || 'Food enthusiast'}</span>
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
