
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Fade, Slide } from '@mui/material';
import { setCurrentConversation, markAsRead } from '../../redux/features/Messages/messagesSlice';

const ConversationList = ({ conversations, onConversationSelect }) => {
  const dispatch = useDispatch();
  const { currentConversation } = useSelector(state => state.messages);

  const handleConversationClick = (conversation) => {
    dispatch(setCurrentConversation(conversation));
    if (conversation.unreadCount > 0) {
      dispatch(markAsRead(conversation.id));
    }
    if (onConversationSelect) {
      onConversationSelect();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const truncateMessage = (message, maxLength = 50) => {
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  if (conversations.length === 0) {
    return (
      <Fade in={true} timeout={600}>
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="text-4xl mb-3 animate-bounce">📭</div>
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs mt-1">Start following users to begin messaging</p>
        </div>
      </Fade>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation, index) => (
        <Slide 
          in={true} 
          direction="right" 
          timeout={300 + index * 50} 
          key={conversation.id}
        >
          <div
            onClick={() => handleConversationClick(conversation)}
            className={`
              p-4 cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:shadow-sm flex-shrink-0
              transform hover:scale-[1.02] hover:-translate-y-0.5
              ${currentConversation?.id === conversation.id 
                ? 'bg-blue-50 border-r-4 border-blue-400 shadow-sm' 
                : 'hover:border-r-2 hover:border-gray-200'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={conversation.image}
                  alt={conversation.username}
                  className={`
                    w-12 h-12 rounded-full object-cover border-2 shadow-sm transition-all duration-300
                    ${currentConversation?.id === conversation.id 
                      ? 'border-blue-300 shadow-blue-100' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                />
                {/* Unread indicator dot */}
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse">
                    <div className="w-full h-full bg-blue-400 rounded-full animate-ping"></div>
                  </div>
                )}
              </div>

              {/* Conversation Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`
                    font-semibold truncate transition-colors duration-200
                    ${conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}
                  `}>
                    {conversation.username}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 transition-colors duration-200">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <Badge 
                        badgeContent={conversation.unreadCount} 
                        color="primary"
                        className="ml-2 animate-pulse"
                        sx={{
                          '& .MuiBadge-badge': {
                            animation: 'pulse 2s infinite',
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
                
                <p className={`
                  text-sm truncate transition-all duration-200
                  ${conversation.unreadCount > 0 
                    ? 'text-gray-800 font-medium' 
                    : 'text-gray-600'
                  }
                `}>
                  {truncateMessage(conversation.lastMessage)}
                </p>
              </div>
            </div>
          </div>
        </Slide>
      ))}
    </div>
  );
};

export default ConversationList;