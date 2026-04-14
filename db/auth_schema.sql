-- Drop the broken table first (cascade handles foreign key deps)
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS verification_tokens CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- users table (this one was fine)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  role TEXT DEFAULT 'user'
);

-- accounts: snake_case column names required by @auth/pg-adapter
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,        -- ✅ snake_case
  access_token TEXT,         -- ✅ snake_case
  expires_at BIGINT,         -- ✅ snake_case
  token_type TEXT,           -- ✅ snake_case
  scope TEXT,
  id_token TEXT,             -- ✅ snake_case
  session_state TEXT,        -- ✅ snake_case
  UNIQUE (provider, "providerAccountId")
);

-- sessions table (was fine)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

-- verification_tokens: adapter expects singular "verification_token"
DROP TABLE IF EXISTS verification_tokens;
CREATE TABLE IF NOT EXISTS verification_token (  -- ✅ singular, no 's'
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  UNIQUE (identifier, token)
);