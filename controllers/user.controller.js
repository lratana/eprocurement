// User Authentication Controller
// This file handles user signup, signin, and authentication logic

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/connection');

// JWT Secret (in production, use environment variables)
const JWT_SECRET = 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = '24h';

// 🔐 User SignUp
const signUp = async (req, res) => {
    try {
        const { name, username, title, department, email, role, password, confirmPassword } = req.body;

        // Validation
        if (!name || !username || !email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Required fields: name, username, email, password, confirmPassword'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists (email or username)
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email.toLowerCase(), username.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                status: 'error',
                message: 'User with this email or username already exists'
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user with all fields
        const result = await db.query(
            `INSERT INTO users (name, username, title, department, email, role, password, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING id, name, username, title, department, email, role, created_at`,
            [
                name,
                username.toLowerCase(),
                title || null,
                department || null,
                email.toLowerCase(),
                role || 'user',
                hashedPassword
            ]
        );

        const newUser = result.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: newUser.id,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    username: newUser.username,
                    title: newUser.title,
                    department: newUser.department,
                    email: newUser.email,
                    role: newUser.role,
                    createdAt: newUser.created_at
                },
                token: token
            }
        });

    } catch (error) {
        console.error('SignUp Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Registration failed: ' + error.message
        });
    }
};

// 🔑 User SignIn
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        // Find user by email or username
        const result = await db.query(
            'SELECT id, name, username, title, department, email, role, password, created_at FROM users WHERE email = $1 OR username = $1',
            [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email/username or password'
            });
        }

        const user = result.rows[0];

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email/username or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Update last login (optional)
        await db.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [user.id]
        );

        res.json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    title: user.title,
                    department: user.department,
                    email: user.email,
                    role: user.role,
                    createdAt: user.created_at
                },
                token: token
            }
        });

    } catch (error) {
        console.error('SignIn Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Login failed: ' + error.message
        });
    }
};

// 👤 Get User Profile (protected route)
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // Set by auth middleware

        const result = await db.query(
            'SELECT id, name, username, title, department, email, role, created_at, last_login FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        res.json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    title: user.title,
                    department: user.department,
                    email: user.email,
                    role: user.role,
                    createdAt: user.created_at,
                    lastLogin: user.last_login
                }
            }
        });

    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get profile: ' + error.message
        });
    }
};

// 🔄 Update User Profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, title, department, role } = req.body;

        if (!name) {
            return res.status(400).json({
                status: 'error',
                message: 'Name is required'
            });
        }

        // Build dynamic query for updating only provided fields
        let updateFields = ['name = $1'];
        let queryParams = [name];
        let paramIndex = 2;

        if (title !== undefined) {
            updateFields.push(`title = $${paramIndex}`);
            queryParams.push(title);
            paramIndex++;
        }

        if (department !== undefined) {
            updateFields.push(`department = $${paramIndex}`);
            queryParams.push(department);
            paramIndex++;
        }

        if (role !== undefined) {
            updateFields.push(`role = $${paramIndex}`);
            queryParams.push(role);
            paramIndex++;
        }

        // Add userId at the end
        queryParams.push(userId);

        const query = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING id, name, username, title, department, email, role, created_at
    `;

        const result = await db.query(query, queryParams);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        res.json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    title: user.title,
                    department: user.department,
                    email: user.email,
                    role: user.role,
                    createdAt: user.created_at
                }
            }
        });

    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update profile: ' + error.message
        });
    }
};

module.exports = {
    signUp,
    signIn,
    getProfile,
    updateProfile
};