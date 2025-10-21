import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, IconButton, Chip, Tooltip, Fade, Grow } from '@mui/material';
import { 
  PersonRemoveRounded as PersonRemoveRoundedIcon, 
  Message as MessageIcon
} from '@mui/icons-material';
import { toggleFollow } from '../../redux/features/FollowedUsers/followedUsersSlice';
import { setCurrentConversation } from '../../redux/features/Messages/messagesSlice';

const MessageUserCard = ({ user, onMessageClick }) => {
  const dispatch = useDispatch();
  const { followingIds } = useSelector((state) => state.followedUsers);
  const { conversations } = useSelector((state) => state.messages);
  const [isHovered, setIsHovered] = useState(false);
  
  const isFollowing = followingIds.includes(user.id);

  // Check if there's an existing conversation with this user
  const existingConversation = conversations.find(conv => conv.userId === user.id);
  const hasUnreadMessages = existingConversation?.unreadCount > 0;

  const handleToggleFollow = () => {
    dispatch(toggleFollow(user.id));
  };

  const handleMessageClick = () => {
    // Create or find conversation
    let conversation = existingConversation;
    
    if (!conversation) {
      // Create a new conversation object
      conversation = {
        id: user.id,
        userId: user.id,
        username: user.username,
        image: user.image,
        lastMessage: "",
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        isOnline: user.isOnline || false
      };
    }
    
    dispatch(setCurrentConversation(conversation));
    if (onMessageClick) {
      onMessageClick();
    }
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
    <Grow in={true} timeout={300}>
      <div 
        className={`flex items-center p-3 bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
          isHovered ? 'shadow-lg -translate-y-1' : 'shadow-md'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Profile Image */}
        <div className="relative">
          <img
            src={user.image}
            alt={user.username}
            className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-md object-cover transition-all duration-300 hover:shadow-lg hover:scale-110"
          />
          {/* Unread message indicator */}
          {hasUnreadMessages && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse">
              <div className="w-full h-full bg-blue-400 rounded-full animate-ping"></div>
            </div>
          )}
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
              onClick={handleMessageClick}
              size="small"
              className="text-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:scale-110 hover:shadow-md"
            >
              <MessageIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={isFollowing ? "Unfollow" : "Follow"}>
            <IconButton 
              onClick={handleToggleFollow}
              size="small"
              className={`transition-all duration-300 transform hover:scale-110 ${
                isFollowing 
                  ? 'text-red-500 hover:bg-red-50 hover:shadow-md' 
                  : 'text-blue-500 hover:bg-blue-50 hover:shadow-md'
              }`}
            >
              <PersonRemoveRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Grow>
  );
};

export default MessageUserCard;