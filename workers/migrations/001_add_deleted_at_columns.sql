-- Migration: Add deleted_at columns for soft delete support
-- Date: 2025-11-27

-- Add deleted_at to exams table
ALTER TABLE exams ADD COLUMN deleted_at INTEGER;
ALTER TABLE exams ADD COLUMN updated_at INTEGER;

-- Add deleted_at to flashcard_decks table
ALTER TABLE flashcard_decks ADD COLUMN deleted_at INTEGER;

-- Add deleted_at to flashcards table
ALTER TABLE flashcards ADD COLUMN deleted_at INTEGER;

-- Add deleted_at to chat_sessions table
ALTER TABLE chat_sessions ADD COLUMN deleted_at INTEGER;

-- Add deleted_at to study_sessions table
ALTER TABLE study_sessions ADD COLUMN deleted_at INTEGER;
ALTER TABLE study_sessions ADD COLUMN updated_at INTEGER;

-- Create indexes for soft delete queries
CREATE INDEX IF NOT EXISTS idx_exams_deleted ON exams(deleted_at);
CREATE INDEX IF NOT EXISTS idx_flashcard_decks_deleted ON flashcard_decks(deleted_at);
CREATE INDEX IF NOT EXISTS idx_flashcards_deleted ON flashcards(deleted_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_deleted ON chat_sessions(deleted_at);
CREATE INDEX IF NOT EXISTS idx_study_sessions_deleted ON study_sessions(deleted_at);

