// Database Connection Module
// This file handles all database operations

const { Pool } = require('pg');
const dbConfig = require('../config/database');

// Create a connection pool
const pool = new Pool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    // Test with a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('📅 Database time:', result.rows[0].current_time);
    
    client.release(); // Return connection to pool
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Execute a query
const query = async (text, params) => {
  try {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    console.log('📊 Query executed:', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    throw error;
  }
};

// Get a client from the pool (for transactions)
const getClient = async () => {
  return await pool.connect();
};

// Close all connections
const closePool = async () => {
  await pool.end();
  console.log('🔒 Database pool closed');
};

module.exports = {
  testConnection,
  query,
  getClient,
  closePool,
  pool
};