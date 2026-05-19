-- Diary Feature SQL - 2026-05-18
-- Run this after the base schema.sql to add diary feature tables

-- Diaries table for journal entries
CREATE TABLE IF NOT EXISTS diaries (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  type TEXT DEFAULT 'diary' CHECK(type IN ('diary', 'ai')),
  ai_summary TEXT,
  ai_growth_tips TEXT[],
  ai_sentiment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Configuration table
CREATE TABLE IF NOT EXISTS ai_config (
  id SERIAL PRIMARY KEY,
  api_key TEXT,
  base_url TEXT DEFAULT 'https://api.openai.com/v1',
  model TEXT DEFAULT 'gpt-3.5-turbo',
  enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for diaries table
CREATE INDEX IF NOT EXISTS idx_diaries_created ON diaries(created_at);
CREATE INDEX IF NOT EXISTS idx_diaries_type ON diaries(type);
CREATE INDEX IF NOT EXISTS idx_diaries_tags ON diaries USING GIN(tags);

-- Update menuVisibility to include diary
UPDATE settings SET value = '{"categories": true, "tags": true, "archives": true, "about": true, "diary": true}' WHERE key = 'menuVisibility';