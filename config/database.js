// Database Configuration
// This file contains all database connection settings

const dbConfig = {
    // PostgreSQL connection settings
    host: 'localhost',        // Database server address
    port: 5433,                // PostgreSQL default port
    database: 'EProcurement', // Database name
    user: 'postgres',    // Database username
    password: 'admin',   // Database password

    // Connection pool settings (for better performance)
    max: 10,                 // Maximum number of connections
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 2000, // Timeout after 2 seconds
};

module.exports = dbConfig;