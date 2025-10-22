# 🔧 Fixing the 404 Signup Error

## Problem
You're getting a 404 error when trying to access `/api/auth/signup`.

## Solution Steps

### 1. 🗄️ First, Setup Your Database
Before testing signup, you need to create the database tables:

1. **Start your server:**
   ```bash
   npm start
   ```

2. **Open a new terminal/PowerShell window** and run:
   ```bash
   curl -X POST http://localhost:3000/api/db/setup
   ```
   
   Or visit in browser: `http://localhost:3000/api/db/setup`

### 2. 🧪 Test the Signup Endpoint

**Using PowerShell (Windows):**
```powershell
$body = @{
    name = "John Doe"
    username = "johndoe"
    email = "john@example.com"
    password = "password123"
    confirmPassword = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signup" -Method POST -ContentType "application/json" -Body $body
```

**Using curl (if available):**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe", 
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### 3. 🔍 Troubleshooting Steps

1. **Check if server is running:**
   ```bash
   curl http://localhost:3000
   ```
   Should return the homepage HTML.

2. **Check if auth routes are working:**
   ```bash
   curl http://localhost:3000/api/auth/test-simple
   ```

3. **Check server logs** for any error messages.

### 4. 📋 Required Fields for Signup

Make sure your request includes all required fields:
- ✅ `name` (required)
- ✅ `username` (required)  
- ✅ `email` (required)
- ✅ `password` (required)
- ✅ `confirmPassword` (required)
- ⚪ `title` (optional)
- ⚪ `department` (optional)
- ⚪ `role` (optional, defaults to 'user')

### 5. 🎯 Expected Success Response

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-10-22T09:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 6. 🚨 Common Error Solutions

**404 Error**: 
- Server not running → Start with `npm start`
- Wrong URL → Use `http://localhost:3000/api/auth/signup`

**500 Error**:
- Database not set up → Run database setup first
- Missing required fields → Include all required fields

**409 Error**:
- User already exists → Use different email/username

### 7. 🔄 If Still Not Working

1. **Restart the server completely:**
   - Stop: `Ctrl+C`
   - Start: `npm start`

2. **Check the database connection:**
   - Visit: `http://localhost:3000/api/db/test`

3. **Verify PostgreSQL is running** and accessible.

4. **Check your database credentials** in `config/database.js`

## Quick Test Command

```powershell
# Test if everything is working
$testUser = @{
    name = "Test User"
    username = "testuser"
    email = "test@example.com"
    password = "123456"
    confirmPassword = "123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signup" -Method POST -ContentType "application/json" -Body $testUser
```

This should resolve your 404 error! 🎉