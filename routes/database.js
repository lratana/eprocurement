// Database Routes
// This file contains routes for testing database operations

const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// Test database connection
router.get('/test', async (req, res) => {
    try {
        const isConnected = await db.testConnection();

        if (isConnected) {
            res.json({
                status: 'success',
                message: 'Database connection is working!',
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Database connection failed'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get all users (sample table)
router.get('/users', async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, username, title, department, email, role, created_at, last_login FROM users ORDER BY id');

        res.json({
            status: 'success',
            data: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching users: ' + error.message,
            hint: 'Make sure the users table exists in your database'
        });
    }
});

// Create a new user (sample)
router.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'Name and email are required'
            });
        }

        const result = await db.query(
            'INSERT INTO users (name, email, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [name, email]
        );

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating user: ' + error.message
        });
    }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching user: ' + error.message
        });
    }
});

// Create sample table (for testing)
router.post('/setup', async (req, res) => {
    try {
        // Create users table with all required fields
        await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(100),
        department VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

        // Insert sample data with new fields
        await db.query(`
      INSERT INTO users (name, username, title, department, email, role) VALUES 
      ('John Doe', 'johndoe', 'Senior Manager', 'Procurement', 'john@example.com', 'admin'),
      ('Jane Smith', 'janesmith', 'Procurement Officer', 'Procurement', 'jane@example.com', 'user'),
      ('Mike Johnson', 'mikejohnson', 'Finance Director', 'Finance', 'mike@example.com', 'manager')
      ON CONFLICT (email) DO NOTHING
    `);

        res.json({
            status: 'success',
            message: 'Database setup completed! Users table created with all fields (id, username, title, department, email, role).'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Setup failed: ' + error.message
        });
    }
});

// Clean/Reset database
router.post('/clean', async (req, res) => {
    try {
        // Drop existing table if it exists
        await db.query('DROP TABLE IF EXISTS users CASCADE');

        // Recreate clean table
        await db.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(100),
        department VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

        res.json({
            status: 'success',
            message: 'Database cleaned successfully! Fresh users table created with no data.'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Clean failed: ' + error.message
        });
    }
});

module.exports = router;