import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { 
  IconButton, 
  TextField, 
  InputAdornment, 
  CircularProgress,
  Fade
} from '@mui/material';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import { 
  fetchConversations, 
  setCurrentConversation, 
  clearCurrentConversation 
} from '../../redux/features/Messages/messagesSlice';

const Messages = () => {
  const dispatch = useDispatch();
  const { conversations, currentConversation, loading } = useSelector(state => state.messages);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    dispatch(fetchConversations());
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const filteredConversations = conversations.filter(conversation =>
    conversation.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBackToList = () => {
    dispatch(clearCurrentConversation());
  };

  const showConversationList = !currentConversation || !isMobile;
  const showChatWindow = currentConversation && (!isMobile || currentConversation);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Conversations List */}
      <Fade in={showConversationList} timeout={300}>
        <div className={`
          ${isMobile ? (currentConversation ? 'hidden' : 'w-full') : 'w-1/3 border-r border-gray-200'}
          bg-white/90 backdrop-blur-sm flex flex-col
        `}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Messages</h2>
            <TextField
              fullWidth
              size="small"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              className="bg-gray-50 rounded-lg"
            />
          </div>
          
          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            <ConversationList conversations={filteredConversations} />
          </div>
        </div>
      </Fade>

      {/* Chat Window */}
      <Fade in={showChatWindow} timeout={300}>
        <div className={`
          ${isMobile ? (currentConversation ? 'w-full' : 'hidden') : 'flex-1'}
          flex flex-col
        `}>
          {currentConversation ? (
            <>
              {/* Mobile Back Button */}
              {isMobile && (
                <div className="bg-white/90 backdrop-blur-sm p-3 border-b border-gray-200 flex items-center">
                  <IconButton onClick={handleBackToList} className="mr-2">
                    <ArrowBackIcon />
                  </IconButton>
                  <img
                    src={currentConversation.image}
                    alt={currentConversation.username}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{currentConversation.username}</h3>
                    <p className="text-xs text-gray-500">
                      {currentConversation.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              )}
              <ChatWindow />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white/50">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-sm">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </Fade>
    </div>
  );
};

export default Messages;