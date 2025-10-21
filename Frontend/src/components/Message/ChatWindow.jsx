import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Send as SendIcon
} from '@mui/icons-material';
import { 
  IconButton, 
  TextField, 
  CircularProgress,
  Fade,
  Tooltip
} from '@mui/material';
import MessageBubble from './MessageBubble';
import { 
  fetchMessages, 
  sendMessage 
} from '../../redux/features/Messages/messagesSlice';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const { 
    currentConversation, 
    messages, 
    messagesLoading, 
    sendingMessage 
  } = useSelector(state => state.messages);
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentMessages = currentConversation ? messages[currentConversation.id] || [] : [];

  useEffect(() => {
    if (currentConversation && !messages[currentConversation.id]) {
      dispatch(fetchMessages(currentConversation.id));
    }
  }, [currentConversation, dispatch, messages]);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage || !currentConversation) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    
    try {
      await dispatch(sendMessage({
        conversationId: currentConversation.id,
        content: messageContent
      })).unwrap();
      
      // Focus back on input
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore message on error
      setNewMessage(messageContent);
    }
  };



  if (!currentConversation) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-white/90 backdrop-blur-sm">
      {/* Chat Header - Desktop Only - Fixed */}
      <Fade in={true} timeout={400}>
        <div className="hidden md:flex flex-shrink-0 items-center p-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
          <img
            src={currentConversation.image}
            alt={currentConversation.username}
            className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 transition-colors duration-200">
              {currentConversation.username}
            </h3>
            <p className="text-sm text-gray-500">
              Chat with {currentConversation.username}
            </p>
          </div>
        </div>
      </Fade>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messagesLoading ? (
          <div className="flex justify-center items-center h-32">
            <CircularProgress size={24} />
          </div>
        ) : currentMessages.length === 0 ? (
          <Fade in={true} timeout={600}>
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-4xl mb-3 animate-bounce">👋</div>
              <p className="text-sm text-center">
                Start a conversation with {currentConversation.username}
              </p>
              <p className="text-xs text-center mt-1 text-gray-400">
                Ask them about their recipes or cooking tips!
              </p>
            </div>
          </Fade>
        ) : (
          <>
            {currentMessages.map((message, index) => (
              <Fade in={true} timeout={300} key={message.id}>
                <div>
                  <MessageBubble 
                    message={message} 
                    isOwn={message.senderId === 'current_user'}
                    showAvatar={
                      index === 0 || 
                      currentMessages[index - 1].senderId !== message.senderId
                    }
                    userImage={currentConversation.image}
                  />
                </div>
              </Fade>
            ))}
            {sendingMessage && (
              <Fade in={true} timeout={200}>
                <div className="flex justify-end">
                  <div className="bg-blue-400 text-white px-4 py-2 rounded-2xl rounded-br-md max-w-xs opacity-80 animate-pulse">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Sending...</span>
                      <CircularProgress size={12} color="inherit" />
                    </div>
                  </div>
                </div>
              </Fade>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white/95">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1">
            <TextField
              ref={inputRef}
              fullWidth
              multiline
              maxRows={4}
              placeholder={`Message ${currentConversation.username}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={sendingMessage}
              variant="outlined"
              size="small"
              className="bg-gray-50"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                  },
                  '&:hover fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                  },
                },
              }}
            />
          </div>
          
          <Tooltip title="Send message">
            <IconButton
              type="submit"
              disabled={!newMessage.trim() || sendingMessage}
              className={`
                transition-all duration-300 transform
                ${newMessage.trim() && !sendingMessage 
                  ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-110 shadow-lg hover:shadow-blue-200' 
                  : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                }
              `}
              size="large"
            >
              {sendingMessage ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon className="transition-transform duration-200 hover:rotate-12" />
              )}
            </IconButton>
          </Tooltip>
        </form>
        
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;