// Step 1: Import Express framework and database
const express = require('express');
const db = require('./database/connection');
const databaseRoutes = require('./routes/database');
const authRoutes = require('./routes/auth');

// Step 2: Create an Express application
const app = express();

// Step 3: Set the port number (3000 is default)
const port = 3000;

// Step 4: Tell Express to understand JSON data
app.use(express.json());

// Serve static files (for test pages)
app.use(express.static('.'));

// Step 5: Add routes
app.use('/api/db', databaseRoutes);
app.use('/api/auth', authRoutes);

// Step 6: Create a simple homepage route
app.get('/', (req, res) => {
    res.send(`
    <h1>🚀 Welcome to EProcurement!</h1>
    <p>Your procurement system is running successfully.</p>
    
    <h2>📋 Available Pages:</h2>
    <ul>
      <li><a href="/about">📖 About this system</a></li>
      <li><a href="/api/hello">🔗 Simple API</a></li>
    </ul>
    
    <h2>🔐 Authentication API:</h2>
    <ul>
      <li><strong>POST</strong> /api/auth/signup - 📝 User Registration</li>
      <li><strong>POST</strong> /api/auth/signin - 🔑 User Login</li>
      <li><strong>GET</strong> /api/auth/profile - 👤 Get Profile (Protected)</li>
      <li><strong>PUT</strong> /api/auth/profile - ✏️ Update Profile (Protected)</li>
      <li><a href="/test-signup.html">🧪 Test Signup Form</a></li>
    </ul>
    
    <h2>🗄️ Database Management:</h2>
    <ul>
      <li><a href="/api/db/test">🔍 Test Database Connection</a></li>
      <li><a href="/api/db/clean" onclick="return confirm('⚠️ This will delete all user data! Continue?')">🧹 Clean Database (DELETE ALL DATA)</a></li>
      <li><a href="/api/db/setup">⚙️ Setup Sample Database</a></li>
      <li><a href="/api/db/users">👥 View All Users</a></li>
    </ul>
    
    <p><strong>💡 Tip:</strong> Use Postman or curl to test the authentication endpoints!</p>
  `);
});

// Step 7: Create an about page
app.get('/about', (req, res) => {
    res.send(`
    <h1>📋 About EProcurement</h1>
    <p>This is a simple procurement management system with PostgreSQL database integration.</p>
    
    <h2>🛠️ Features:</h2>
    <ul>
      <li>✅ Express.js web server</li>
      <li>✅ PostgreSQL database connection</li>
      <li>✅ User authentication (JWT)</li>
      <li>✅ Password hashing (bcrypt)</li>
      <li>✅ Sample user management</li>
      <li>✅ RESTful API endpoints</li>
    </ul>
    
    <p><a href="/">🏠 Go back to homepage</a></p>
  `);
});

// Step 7: Create a simple API endpoint
app.get('/api/hello', (req, res) => {
    res.json({
        message: 'Hello from EProcurement API!',
        time: new Date().toLocaleString()
    });
});

// Step 8: Start the server and listen for requests
app.listen(port, async () => {
    console.log('🚀 Server is running!');
    console.log(`📱 Open your browser and visit: http://localhost:${port}`);
    console.log('⏹️  Press Ctrl+C to stop the server');
    console.log('');

    // Test database connection on startup
    console.log('🗄️  Testing database connection...');
    await db.testConnection();
});