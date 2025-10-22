# 🚨 SignUp Error Solutions

## Common SignUp Errors and Fixes

### 1. 📋 **"Table 'users' doesn't exist"**
**Solution**: Setup the database first
```bash
# Visit in browser: http://localhost:3000/api/db/setup
# Or use PowerShell:
Invoke-RestMethod -Uri "http://localhost:3000/api/db/setup" -Method POST
```

### 2. 🔑 **"Required fields: name, username, email, password, confirmPassword"**
**Solution**: Make sure all required fields are provided
```json
{
  "name": "John Doe",
  "username": "johndoe", 
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### 3. 🔐 **"Passwords do not match"**
**Solution**: Ensure password and confirmPassword are identical

### 4. 📏 **"Password must be at least 6 characters long"**
**Solution**: Use a password with 6+ characters

### 5. 👥 **"User with this email or username already exists"**
**Solution**: Use a different email or username

### 6. 🗄️ **Database Connection Error**
**Solution**: 
- Check PostgreSQL is running
- Verify database credentials in `config/database.js`
- Ensure database 'EProcurement' exists

### 7. 🌐 **"Cannot POST /api/auth/signup" (404 Error)**
**Solution**:
- Restart the server: `npm start`
- Check server is running: visit `http://localhost:3000`

## 🧪 **Easy Testing Options**

### Option 1: Use the Test Form
Visit: `http://localhost:3000/test-signup.html`
- Fill out the form
- Click "Create Account"
- See exact error message

### Option 2: PowerShell Test
```powershell
$body = @{
    name = "Test User"
    username = "testuser"
    email = "test@example.com"
    password = "123456"
    confirmPassword = "123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signup" -Method POST -ContentType "application/json" -Body $body
```

### Option 3: Simple curl Test
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","username":"test","email":"test@test.com","password":"123456","confirmPassword":"123456"}'
```

## 🔄 **If Still Having Issues**

1. **Check Server Status**:
   - Visit: `http://localhost:3000`
   - Should show homepage

2. **Check Database Setup**:
   - Visit: `http://localhost:3000/api/db/test`
   - Should show success message

3. **Setup Database**:
   - Visit: `http://localhost:3000/api/db/setup`
   - Should create user tables

4. **Test Simple Auth Route**:
   - Visit: `http://localhost:3000/api/auth/test-simple`
   - Should show auth routes working

## 🎯 **Expected Success Response**

When signup works correctly, you should get:
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Test User",
      "username": "testuser",
      "email": "test@example.com",
      "role": "user",
      "createdAt": "2025-10-22T13:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

Try the test form first - it will give you the exact error message! 🎉