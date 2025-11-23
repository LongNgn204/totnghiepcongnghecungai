-- Migration: Add missing columns to auth_users table
-- This fixes the mismatch between Drizzle schema and actual D1 database

-- Add is_admin column if it doesn't exist (D1/SQLite doesn't support IF NOT EXISTS for columns directly,
-- so this might fail if column exists, but based on error it is missing)
-- ALTER TABLE auth_users ADD COLUMN is_admin INTEGER DEFAULT 0;

-- Add role column (present in schema.ts but might be missing in DB)
ALTER TABLE auth_users ADD COLUMN role TEXT DEFAULT 'user';

-- Add updated_at column (present in schema.ts but might be missing in DB)
ALTER TABLE auth_users ADD COLUMN updated_at INTEGER;
