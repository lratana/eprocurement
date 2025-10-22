-- Database Migration Script
-- Run this SQL to update your existing users table with new fields

-- Add new columns to existing users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS title VARCHAR(100),
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Update existing users with default usernames (you can change these)
UPDATE users SET username = LOWER(REPLACE(name, ' ', '')) WHERE username IS NULL;

-- Make username NOT NULL after setting default values
ALTER TABLE users ALTER COLUMN username SET NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);

-- Display updated table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;