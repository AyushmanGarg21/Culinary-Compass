import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Fake API calls for messages
export const fetchConversations = createAsyncThunk('messages/fetchConversations', async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: 1,
      userId: 1,
      username: "John Doe",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Hey! I loved your recent recipe post. Could you share the ingredients?",
      lastMessageTime: "2024-01-15T10:30:00Z",
      unreadCount: 2,
      isOnline: true
    },
    {
      id: 2,
      userId: 2,
      username: "Jane Smith",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Thanks for the cooking tips!",
      lastMessageTime: "2024-01-14T15:45:00Z",
      unreadCount: 0,
      isOnline: false
    },
    {
      id: 3,
      userId: 3,
      username: "Ali Khan",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      lastMessage: "What's your favorite spice combination?",
      lastMessageTime: "2024-01-15T09:20:00Z",
      unreadCount: 1,
      isOnline: true
    }
  ];
});

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async (conversationId) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock messages for different conversations
  const mockMessages = {
    1: [
      {
        id: 1,
        senderId: 1,
        receiverId: 'current_user',
        content: "Hey! I loved your recent recipe post. Could you share the ingredients?",
        isRead: true,
        createdAt: "2024-01-15T09:30:00Z"
      },
      {
        id: 2,
        senderId: 'current_user',
        receiverId: 1,
        content: "Thank you! I'll share the full recipe with you.",
        isRead: true,
        createdAt: "2024-01-15T09:35:00Z"
      },
      {
        id: 3,
        senderId: 1,
        receiverId: 'current_user',
        content: "That would be amazing! I'm trying to cook more healthy meals.",
        isRead: false,
        createdAt: "2024-01-15T10:30:00Z"
      }
    ],
    2: [
      {
        id: 4,
        senderId: 2,
        receiverId: 'current_user',
        content: "Thanks for the cooking tips!",
        isRead: true,
        createdAt: "2024-01-14T15:45:00Z"
      },
      {
        id: 5,
        senderId: 'current_user',
        receiverId: 2,
        content: "You're welcome! Let me know if you need more help.",
        isRead: true,
        createdAt: "2024-01-14T15:50:00Z"
      }
    ],
    3: [
      {
        id: 6,
        senderId: 3,
        receiverId: 'current_user',
        content: "What's your favorite spice combination?",
        isRead: false,
        createdAt: "2024-01-15T09:20:00Z"
      }
    ]
  };
  
  return mockMessages[conversationId] || [];
});

export const sendMessage = createAsyncThunk('messages/sendMessage', async ({ conversationId, content }) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newMessage = {
    id: Date.now(),
    senderId: 'current_user',
    receiverId: conversationId,
    content,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  
  return { conversationId, message: newMessage };
});

export const markAsRead = createAsyncThunk('messages/markAsRead', async (conversationId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return conversationId;
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    currentConversation: null,
    messages: {},
    loading: false,
    messagesLoading: false,
    error: null,
    sendingMessage: false
  },
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        if (state.currentConversation) {
          state.messages[state.currentConversation.id] = action.payload;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.error.message;
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        const { conversationId, message } = action.payload;
        
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(message);
        
        // Update last message in conversation
        const conversation = state.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.lastMessage = message.content;
          conversation.lastMessageTime = message.createdAt;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.error.message;
      })
      
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const conversationId = action.payload;
        const conversation = state.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.unreadCount = 0;
        }
        
        // Mark messages as read
        if (state.messages[conversationId]) {
          state.messages[conversationId].forEach(message => {
            if (message.senderId !== 'current_user') {
              message.isRead = true;
            }
          });
        }
      });
  }
});

export const { setCurrentConversation, clearCurrentConversation, clearError } = messagesSlice.actions;
export default messagesSlice.reducer;