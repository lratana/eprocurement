# 🗄️ PostgreSQL Setup Guide

This guide will help you set up PostgreSQL database for your EProcurement project.

## 📥 Step 1: Install PostgreSQL

### Windows:
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. **Remember your password** for the `postgres` user!
4. Default port is `5432` (keep this)

### Alternative - Using Docker (easier):
```bash
docker run --name postgres-eprocurement -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres
```

## ⚙️ Step 2: Create Database

1. Open **pgAdmin** (comes with PostgreSQL) or use command line
2. Connect to PostgreSQL server with your password
3. Create a new database called `eprocurement`

### Using Command Line:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE eprocurement;

# Exit
\q
```

## 🔧 Step 3: Update Configuration

Edit `config/database.js` with your settings:

```javascript
const dbConfig = {
  host: 'localhost',        // Your PostgreSQL server
  port: 5432,              // Your PostgreSQL port
  database: 'eprocurement', // Your database name
  user: 'postgres',        // Your username
  password: 'YOUR_PASSWORD_HERE', // Your password
};
```

## 🚀 Step 4: Test Connection

1. Start your Node.js app:
   ```bash
   npm start
   ```

2. Open browser and go to: `http://localhost:3000`

3. Click on "Test Database Connection"

4. If successful, click "Setup Sample Database" to create test tables

## 📊 Step 5: Available Database Endpoints

Once everything is working, you can use these API endpoints:

- **Test Connection**: `GET /api/db/test`
- **Setup Database**: `POST /api/db/setup`
- **Get All Users**: `GET /api/db/users`
- **Create User**: `POST /api/db/users`
- **Get User by ID**: `GET /api/db/users/:id`

## 🛠️ Example API Usage

### Create a new user:
```bash
curl -X POST http://localhost:3000/api/db/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Get all users:
```bash
curl http://localhost:3000/api/db/users
```

## ❌ Troubleshooting

### Connection Failed?
1. ✅ Check if PostgreSQL service is running
2. ✅ Verify your password in `config/database.js`
3. ✅ Make sure database `eprocurement` exists
4. ✅ Check if port 5432 is open

### Port Already in Use?
- Change port in `config/database.js` to match your PostgreSQL port

### Permission Denied?
- Make sure your user has access to the database
- Try using the `postgres` superuser initially

## 🎉 Success!

If everything works, you should see:
- ✅ "Database connected successfully!" in your console
- ✅ Successful responses when testing the API endpoints
- ✅ Data being saved and retrieved from PostgreSQL

Happy coding! 🚀