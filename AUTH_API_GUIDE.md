# 🔐 Authentication API Documentation

This guide shows you how to use the authentication system in your EProcurement application.

## 📋 Quick Overview

- **SignUp**: Create a new user account
- **SignIn**: Login with existing credentials
- **Profile**: Get and update user profile (protected)
- **JWT Tokens**: Used for authentication

## 🚀 Getting Started

1. **Start your server**: `npm start`
2. **Setup database**: Visit `http://localhost:3000/api/db/setup`
3. **Test endpoints** using Postman, curl, or any HTTP client

## 📊 API Endpoints

### 1. 📝 User Registration (SignUp)

**Endpoint**: `POST /api/auth/signup`

**Request Body**:
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "title": "Senior Manager",
  "department": "Procurement",
  "email": "john@example.com",
  "role": "admin",
  "password": "mypassword123",
  "confirmPassword": "mypassword123"
}
```

**Required Fields**: `name`, `username`, `email`, `password`, `confirmPassword`
**Optional Fields**: `title`, `department`, `role` (defaults to 'user')

**Success Response** (201):
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "title": "Senior Manager",
      "department": "Procurement",
      "email": "john@example.com",
      "role": "admin",
      "createdAt": "2025-10-22T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (400):
```json
{
  "status": "error",
  "message": "Required fields: name, username, email, password, confirmPassword"
}
```

### 2. 🔑 User Login (SignIn)

**Endpoint**: `POST /api/auth/signin`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Note**: You can use either `email` or `username` to login.

**Success Response** (200):
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "title": "Senior Manager",
      "department": "Procurement",
      "email": "john@example.com",
      "role": "admin",
      "createdAt": "2025-10-22T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401):
```json
{
  "status": "error",
  "message": "Invalid email/username or password"
}
```

### 3. 👤 Get User Profile (Protected)

**Endpoint**: `GET /api/auth/profile`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "title": "Senior Manager",
      "department": "Procurement",
      "email": "john@example.com",
      "role": "admin",
      "createdAt": "2025-10-22T10:30:00.000Z",
      "lastLogin": "2025-10-22T11:15:00.000Z"
    }
  }
}
```

### 4. ✏️ Update User Profile (Protected)

**Endpoint**: `PUT /api/auth/profile`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body** (all fields optional except name):
```json
{
  "name": "John Smith",
  "title": "Senior Director",
  "department": "Operations",
  "role": "manager"
}
```

**Success Response** (200):
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Smith",
      "username": "johndoe",
      "title": "Senior Director",
      "department": "Operations",
      "email": "john@example.com",
      "role": "manager",
      "createdAt": "2025-10-22T10:30:00.000Z"
    }
  }
}
```

## 🛠️ Testing with curl

### Register a new user:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "title": "Test Manager",
    "department": "Testing",
    "email": "test@example.com",
    "role": "user",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login (with email or username):
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Update profile:
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "title": "Senior Manager",
    "department": "Advanced Testing"
  }'
```

## 🔒 Security Features

- ✅ **Password Hashing**: Uses bcrypt with 12 salt rounds
- ✅ **JWT Tokens**: 24-hour expiration
- ✅ **Input Validation**: Required fields and password strength
- ✅ **Duplicate Prevention**: Email uniqueness check
- ✅ **Protected Routes**: Token verification middleware

## ❌ Common Errors

### 401 Unauthorized
- Missing or invalid token
- Expired token
- Wrong email/password

### 400 Bad Request
- Missing required fields
- Passwords don't match
- Password too short

### 409 Conflict
- Email already exists

## 💡 Tips

1. **Save the token** from login response for protected routes
2. **Include "Bearer "** prefix in Authorization header
3. **Tokens expire in 24 hours** - users need to login again
4. **Passwords must be at least 6 characters**
5. **Email addresses are case-insensitive**

## 🔧 Environment Setup

For production, create a `.env` file:
```
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=24h
DATABASE_URL=postgresql://username:password@localhost:5432/eprocurement
```

Happy coding! 🚀