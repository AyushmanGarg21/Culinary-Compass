import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Tabs, 
  Tab, 
  Box, 
  Typography, 
  CircularProgress,
  Fade,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  People as PeopleIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import MessageUserCard from './MessageUserCard';
import Messages from './Messages';
import { fetchFollowedUsers } from '../../redux/features/FollowedUsers/followedUsersSlice';
import { fetchConversations } from '../../redux/features/Messages/messagesSlice';

const MessageSection = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [showMessages, setShowMessages] = useState(false);
  
  const { followedUsers, loading: usersLoading } = useSelector(state => state.followedUsers);
  const { conversations, loading: messagesLoading } = useSelector(state => state.messages);

  useEffect(() => {
    dispatch(fetchFollowedUsers());
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setShowMessages(false);
  };

  const handleMessageClick = () => {
    if (isMobile) {
      setShowMessages(true);
    } else {
      setActiveTab(1);
    }
  };

  const handleBackToUsers = () => {
    setShowMessages(false);
  };

  // Mobile view - show either user list or messages
  if (isMobile && showMessages) {
    return <Messages onBack={handleBackToUsers} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Connect & Chat
          </Typography>
          
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            className="min-h-0"
            TabIndicatorProps={{
              style: { backgroundColor: '#3b82f6' }
            }}
          >
            <Tab 
              icon={<PeopleIcon />} 
              label="Following" 
              className="min-h-0 text-gray-600"
            />
            <Tab 
              icon={<ChatIcon />} 
              label="Messages" 
              className="min-h-0 text-gray-600"
            />
          </Tabs>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 0 && (
            <Fade in={true} timeout={300}>
              <div className="h-full overflow-y-auto p-4">
                <div className="mb-4">
                  <Typography variant="h6" className="text-gray-700 mb-2">
                    People You Follow
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Click the message icon to start a conversation
                  </Typography>
                </div>

                {usersLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <CircularProgress />
                  </div>
                ) : followedUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <div className="text-6xl mb-4">👥</div>
                    <Typography variant="h6" className="mb-2">No followed users</Typography>
                    <Typography variant="body2" className="text-center">
                      Start following creators to see them here and begin conversations
                    </Typography>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {followedUsers.map((user) => (
                      <MessageUserCard 
                        key={user.id} 
                        user={user} 
                        onMessageClick={handleMessageClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Fade>
          )}

          {activeTab === 1 && (
            <Fade in={true} timeout={300}>
              <div className="h-full">
                <Messages />
              </div>
            </Fade>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageSection;