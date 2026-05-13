export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
export const API_TIMEOUT = process.env.REACT_APP_API_TIMEOUT || 10000;

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    ADMIN_SIGNIN: '/auth/admin/signin',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  
  // User Profile
  USER: {
    PROFILE: '/api/v1/users/profile',
    UPDATE_PROFILE: '/api/v1/users/profile'
  },
  
  // Dashboard
  DASHBOARD: {
    MEALS: '/api/v1/users/dashboard/meals',
    CALORIES: '/api/v1/users/dashboard/calories-intake',
    MARK_MEALS: '/api/v1/users/dashboard/mark-meals-done',
    LATEST_POST: '/api/v1/users/dashboard/latest-post'
  },
  
  // Social Features
  SOCIAL: {
    FEED: '/api/v1/users/posts/feed',
    FOLLOWING: '/api/v1/users/posts/following',
    FOLLOW: '/api/v1/users/posts/follow',
    UNFOLLOW: '/api/v1/users/posts/unfollow',
    SEARCH_CREATORS: '/api/v1/users/posts/creators/search',
    CREATOR_DETAILS: '/api/v1/users/posts/creators'
  },
  
  // Messaging
  MESSAGES: {
    CONVERSATIONS: '/api/v1/users/messages/conversations',
    CONVERSATION: '/api/v1/users/messages/conversation',
    SEND: '/api/v1/users/messages/send',
    MARK_READ: '/api/v1/users/messages/mark-read',
    ADMIN_MESSAGES: '/api/v1/users/messages/admin',
    ADMIN_SEND: '/api/v1/users/messages/admin/send',
    ADMIN_UNREAD: '/api/v1/users/messages/admin/unread-count'
  },
  
  // Creator Requests
  REQUESTS: {
    CREATOR_REQUEST: '/api/v1/users/requests/creator-request',
    CREATOR_POST: '/api/v1/users/requests/creator-post'
  },
  
  // Admin
  ADMIN: {
    CREATOR_REQUESTS: '/api/v1/admin/creator-requests',
    POST_REQUESTS: '/api/v1/admin/post-requests',
    USERS: '/api/v1/admin/manage/users',
    CREATORS: '/api/v1/admin/manage/creators',
    ADMIN_MESSAGES: '/api/v1/admin/messages/conversations',
    APPROVE_CREATOR: '/api/v1/admin/creator-requests',
    REJECT_CREATOR: '/api/v1/admin/creator-requests',
    APPROVE_POST: '/api/v1/admin/post-requests',
    REJECT_POST: '/api/v1/admin/post-requests',
    DEACTIVATE_USER: '/api/v1/admin/manage/users',
    ACTIVATE_USER: '/api/v1/admin/manage/users',
    DELETE_USER: '/api/v1/admin/manage/users',
    REMOVE_CREATOR_STATUS: '/api/v1/admin/manage/creators',
    ADMIN_SEND_MESSAGE: '/api/v1/admin/messages/send',
    ADMIN_MARK_READ: '/api/v1/admin/messages/mark-read',
    ADMIN_UNREAD_COUNT: '/api/v1/admin/messages/unread-count'
  }
};