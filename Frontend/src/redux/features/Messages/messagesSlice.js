import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { messagesService } from '../../../services/api/messagesService';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const data = await messagesService.getConversations();
      return data.conversations ?? data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ creatorId, skip = 0, limit = 50 }, { rejectWithValue }) => {
    try {
      const data = await messagesService.getMessages(creatorId, skip, limit);
      return { creatorId, messages: data.messages ?? data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ receiverId, content }, { rejectWithValue }) => {
    try {
      const message = await messagesService.sendMessage(receiverId, content);
      return { receiverId, message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to send message');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (creatorId, { rejectWithValue }) => {
    try {
      await messagesService.markAsRead(creatorId);
      return creatorId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to mark as read');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    currentConversation: null,
    messages: {},
    loading: false,
    messagesLoading: false,
    error: null,
    sendingMessage: false,
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
    },
  },
  extraReducers: (builder) => {
    // fetchConversations
    builder
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
        state.error = action.payload;
      });

    // fetchMessages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.messages[action.payload.creatorId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
      });

    // sendMessage
    builder
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        const { receiverId, message } = action.payload;

        if (!state.messages[receiverId]) {
          state.messages[receiverId] = [];
        }
        state.messages[receiverId].push(message);

        // Update last message preview in conversations list
        const conversation = state.conversations.find(
          (c) => c.userId === receiverId || c.id === receiverId
        );
        if (conversation) {
          conversation.lastMessage = message.content;
          conversation.lastMessageTime = message.created_at ?? message.createdAt;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload;
      });

    // markAsRead
    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const creatorId = action.payload;
      const conversation = state.conversations.find(
        (c) => c.userId === creatorId || c.id === creatorId
      );
      if (conversation) {
        conversation.unreadCount = 0;
      }
      if (state.messages[creatorId]) {
        state.messages[creatorId].forEach((msg) => {
          msg.is_read = true;
        });
      }
    });
  },
});

export const { setCurrentConversation, clearCurrentConversation, clearError } =
  messagesSlice.actions;
export default messagesSlice.reducer;
