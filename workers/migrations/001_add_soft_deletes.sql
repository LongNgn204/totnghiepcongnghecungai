-- Migration: Add updated_at / deleted_at columns and indexes
-- WARNING: Run this once on staging DB before production. Backup recommended.

-- Exams
ALTER TABLE exams ADD COLUMN updated_at INTEGER;
ALTER TABLE exams ADD COLUMN deleted_at INTEGER;
CREATE INDEX IF NOT EXISTS idx_exams_deleted ON exams(deleted_at);
CREATE INDEX IF NOT EXISTS idx_exams_user_date ON exams(user_id, completed_at);

-- Flashcard decks
ALTER TABLE flashcard_decks ADD COLUMN deleted_at INTEGER;
CREATE INDEX IF NOT EXISTS idx_decks_deleted ON flashcard_decks(deleted_at);

-- Flashcards
ALTER TABLE flashcards ADD COLUMN updated_at INTEGER;
ALTER TABLE flashcards ADD COLUMN deleted_at INTEGER;
CREATE INDEX IF NOT EXISTS idx_cards_deleted ON flashcards(deleted_at);
CREATE INDEX IF NOT EXISTS idx_cards_last_reviewed ON flashcards(last_reviewed);

-- Chat sessions
ALTER TABLE chat_sessions ADD COLUMN deleted_at INTEGER;
CREATE INDEX IF NOT EXISTS idx_chats_deleted ON chat_sessions(deleted_at);
CREATE INDEX IF NOT EXISTS idx_chats_user_date ON chat_sessions(user_id, updated_at);

-- Study sessions
ALTER TABLE study_sessions ADD COLUMN updated_at INTEGER;
ALTER TABLE study_sessions ADD COLUMN deleted_at INTEGER;
CREATE INDEX IF NOT EXISTS idx_sessions_deleted ON study_sessions(deleted_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON study_sessions(user_id, session_date);

-- Auth users
ALTER TABLE auth_users ADD COLUMN deleted_at INTEGER;
CREATE INDEX IF NOT EXISTS idx_auth_users_username ON auth_users(username);
CREATE INDEX IF NOT EXISTS idx_auth_users_deleted ON auth_users(deleted_at);

