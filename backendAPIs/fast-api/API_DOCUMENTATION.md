# Foodie App Backend API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication APIs (`/auth`)

### 1. User Sign Up
- **POST** `/auth/signup`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone_no": "+1234567890"
}
```

### 2. User Sign In
- **POST** `/auth/signin`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Admin Sign In
- **POST** `/auth/admin/signin`
- **Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 4. Refresh Token
- **POST** `/auth/refresh`
- **Body:**
```json
{
  "refresh_token": "your_refresh_token"
}
```

### 5. Logout
- **POST** `/auth/logout`
- **Headers:** `Authorization: Bearer <token>`

### 6. Get Current User
- **GET** `/auth/me`
- **Headers:** `Authorization: Bearer <token>`

---

## 👤 User APIs (`/api/v1/users`)

### Profile Management

#### Get User Profile
- **GET** `/api/v1/users/profile`
- **Headers:** `Authorization: Bearer <token>`

#### Update User Profile
- **PUT** `/api/v1/users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Updated Name",
  "phone_no": "+1234567890",
  "country_id": 1,
  "city_id": 1,
  "gender": "Male",
  "age": 25,
  "height": 175,
  "weight": 70,
  "calories_target": 2000,
  "about_me": "Food enthusiast"
}
```

### Dashboard APIs

#### Get Today's Meals
- **POST** `/api/v1/users/dashboard/meals`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15"
}
```

#### Get Calories Intake
- **POST** `/api/v1/users/dashboard/calories-intake`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15"
}
```

#### Mark Meals as Done
- **POST** `/api/v1/users/dashboard/mark-meals-done`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "meal_ids": [1, 2, 3]
}
```

#### Get Latest Post from Followed Users
- **GET** `/api/v1/users/dashboard/latest-post`
- **Headers:** `Authorization: Bearer <token>`

### Social Features

#### Get User Feed
- **GET** `/api/v1/users/posts/feed?skip=0&limit=10`
- **Headers:** `Authorization: Bearer <token>`

#### Get Following List
- **GET** `/api/v1/users/posts/following?skip=0&limit=10`
- **Headers:** `Authorization: Bearer <token>`

#### Follow User
- **POST** `/api/v1/users/posts/follow`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "target_user_id": "user_id_to_follow"
}
```

#### Unfollow User
- **POST** `/api/v1/users/posts/unfollow`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "target_user_id": "user_id_to_unfollow"
}
```

#### Search Creators
- **GET** `/api/v1/users/posts/creators/search?search=maria&skip=0&limit=10`

#### Get Creator Details
- **GET** `/api/v1/users/posts/creators/{creator_id}`

### Messaging

#### Get Conversations
- **GET** `/api/v1/users/messages/conversations`
- **Headers:** `Authorization: Bearer <token>`

#### Get Messages with Creator
- **GET** `/api/v1/users/messages/conversation/{creator_id}?skip=0&limit=50`
- **Headers:** `Authorization: Bearer <token>`

#### Send Message
- **POST** `/api/v1/users/messages/send`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "receiver_id": "creator_id",
  "content": "Hello, I love your recipes!"
}
```

#### Mark Conversation as Read
- **POST** `/api/v1/users/messages/mark-read/{creator_id}`
- **Headers:** `Authorization: Bearer <token>`

#### Get Admin Messages
- **GET** `/api/v1/users/messages/admin?skip=0&limit=50`
- **Headers:** `Authorization: Bearer <token>`

#### Send Message to Admin
- **POST** `/api/v1/users/messages/admin/send`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "content": "I need help with my account"
}
```

#### Get Unread Admin Messages Count
- **GET** `/api/v1/users/messages/admin/unread-count`
- **Headers:** `Authorization: Bearer <token>`

### Creator Requests

#### Create Creator Request
- **POST** `/api/v1/users/requests/creator-request`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "about_self": "I'm a passionate chef...",
  "experience": "5 years of cooking experience...",
  "links": ["https://instagram.com/mychef", "https://youtube.com/mychannel"]
}
```

#### Create Creator Post
- **POST** `/api/v1/users/requests/creator-post`
- **Headers:** `Authorization: Bearer <token>` (Creator only)
- **Body:**
```json
{
  "title": "Delicious Pasta Recipe",
  "overview": "A simple and tasty pasta dish",
  "cooking_time": 30,
  "cuisine_type": "Italian",
  "servings": 4,
  "image": "https://example.com/pasta.jpg",
  "ingredients": ["pasta", "tomatoes", "garlic", "olive oil"],
  "instructions": "1. Boil pasta... 2. Make sauce..."
}
```

---

## 🔧 Admin APIs (`/api/v1/admin`)

### Creator Request Management

#### Get Creator Requests
- **GET** `/api/v1/admin/creator-requests?status=PENDING&skip=0&limit=100`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Approve Creator Request
- **POST** `/api/v1/admin/creator-requests/{request_id}/approve`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
```json
{
  "comments": "Approved based on experience"
}
```

#### Reject Creator Request
- **POST** `/api/v1/admin/creator-requests/{request_id}/reject`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
```json
{
  "comments": "Need more experience"
}
```

### Post Request Management

#### Get Post Requests
- **GET** `/api/v1/admin/post-requests?status=PENDING&skip=0&limit=100`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Approve Post Request
- **POST** `/api/v1/admin/post-requests/{post_id}/approve`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
```json
{
  "comments": "Great recipe!"
}
```

#### Reject Post Request
- **POST** `/api/v1/admin/post-requests/{post_id}/reject`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
```json
{
  "comments": "Missing ingredients list"
}
```

### User Management

#### Get Users
- **GET** `/api/v1/admin/manage/users?search=john&skip=0&limit=100`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Get Creators
- **GET** `/api/v1/admin/manage/creators?search=maria&skip=0&limit=100`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Deactivate User
- **POST** `/api/v1/admin/manage/users/{user_id}/deactivate`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Activate User
- **POST** `/api/v1/admin/manage/users/{user_id}/activate`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Remove Creator Status
- **POST** `/api/v1/admin/manage/creators/{user_id}/remove-creator-status`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Delete User
- **DELETE** `/api/v1/admin/manage/users/{user_id}`
- **Headers:** `Authorization: Bearer <admin_token>`

### Admin Messaging

#### Get Admin Conversations
- **GET** `/api/v1/admin/messages/conversations`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Get Messages with User
- **GET** `/api/v1/admin/messages/conversation/{user_id}?skip=0&limit=50`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Send Message to User
- **POST** `/api/v1/admin/messages/send/{user_id}`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
```json
{
  "content": "Thank you for contacting us..."
}
```

#### Get Unread Messages Count
- **GET** `/api/v1/admin/messages/unread-count`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Mark Conversation as Read
- **POST** `/api/v1/admin/messages/mark-read/{user_id}`
- **Headers:** `Authorization: Bearer <admin_token>`

---

## 📊 Master Data APIs (`/api/v1/master`)

These endpoints provide reference data like countries, cities, meals, etc.

---

## 🚀 Getting Started

1. **Install Dependencies:**
```bash
pip install -r requirements.txt
```

2. **Set Environment Variables:**
```bash
SECRET_KEY=your_secret_key
DATABASE_URL=postgresql://user:password@localhost/foodie_db
ALLOWED_ORIGINS=http://localhost:3000
```

3. **Run Database Migrations:**
```bash
alembic upgrade head
```

4. **Populate Dummy Data:**
```bash
python scripts/populate_dummy_data.py
```

5. **Start Server:**
```bash
python server.py
```

---

## 📝 Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "detail": "Detailed error information",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔒 Authentication Flow

1. **Sign Up/Sign In** → Get `access_token` and `refresh_token`
2. **Use access_token** in Authorization header for protected endpoints
3. **Refresh token** when access_token expires
4. **Logout** to invalidate tokens

---

## 📱 Frontend Integration

Use these base configurations in your Redux store:

```javascript
const API_BASE_URL = 'http://localhost:8000';

// Auth endpoints
const AUTH_ENDPOINTS = {
  SIGNUP: '/auth/signup',
  SIGNIN: '/auth/signin',
  ADMIN_SIGNIN: '/auth/admin/signin',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me'
};

// User endpoints
const USER_ENDPOINTS = {
  PROFILE: '/api/v1/users/profile',
  DASHBOARD_MEALS: '/api/v1/users/dashboard/meals',
  DASHBOARD_CALORIES: '/api/v1/users/dashboard/calories-intake',
  FEED: '/api/v1/users/posts/feed',
  MESSAGES: '/api/v1/users/messages/conversations'
};

// Admin endpoints
const ADMIN_ENDPOINTS = {
  CREATOR_REQUESTS: '/api/v1/admin/creator-requests',
  POST_REQUESTS: '/api/v1/admin/post-requests',
  MANAGE_USERS: '/api/v1/admin/manage/users',
  ADMIN_MESSAGES: '/api/v1/admin/messages/conversations'
};
```