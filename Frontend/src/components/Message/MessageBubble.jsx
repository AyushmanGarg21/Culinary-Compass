import { useState } from 'react';
import { Tooltip, Grow, Avatar } from '@mui/material';

const MessageBubble = ({ message, isOwn, showAvatar, userImage, userName }) => {
  const [showTime, setShowTime] = useState(false);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
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
    <Grow in={true} timeout={300}>
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {/* Avatar */}
          {!isOwn && showAvatar && (
            userImage ? (
              <img
                src={userImage}
                alt={userName || "User"}
                className="w-6 h-6 rounded-full border border-gray-200 transition-all duration-300 hover:scale-110 hover:shadow-md"
              />
            ) : (
              <Avatar
                className="w-6 h-6 border border-gray-200 transition-all duration-300 hover:scale-110 hover:shadow-md"
                sx={{ bgcolor: '#8B5CF6', fontSize: '0.6rem' }}
              >
                {getInitials(userName)}
              </Avatar>
            )
          )}
          {!isOwn && !showAvatar && <div className="w-6" />}

          {/* Message Bubble */}
          <Tooltip 
            title={`${formatDate(message.createdAt)} at ${formatTime(message.createdAt)}`}
            placement={isOwn ? 'left' : 'right'}
          >
            <div
              className={`
                px-4 py-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105
                ${isOwn 
                  ? 'bg-blue-500 text-white rounded-br-md hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-md hover:bg-gray-200 hover:shadow-md'
                }
              `}
              onClick={() => setShowTime(!showTime)}
            >
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
              
              {/* Message Status */}
              {isOwn && (
                <div className="flex justify-end mt-1">
                  <span className={`
                    text-xs transition-all duration-300
                    ${message.isRead ? 'opacity-70 text-blue-200' : 'opacity-50 text-blue-300'}
                  `}>
                    {message.isRead ? '✓✓' : '✓'}
                  </span>
                </div>
              )}
            </div>
          </Tooltip>
        </div>
      </div>
    </Grow>
  );
};

export default MessageBubble;