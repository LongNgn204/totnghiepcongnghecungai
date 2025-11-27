-- Migration 003: Add indexes and soft delete support
-- Run: npx wrangler d1 execute ai-hoc-tap-db --file=./workers/migrations/003_add_indexes_softdelete.sql

-- Add soft_delete column to main tables (NULL = not deleted)
ALTER TABLE exams ADD COLUMN deleted_at INTEGER DEFAULT NULL;
ALTER TABLE flashcard_decks ADD COLUMN deleted_at INTEGER DEFAULT NULL;
ALTER TABLE flashcards ADD COLUMN deleted_at INTEGER DEFAULT NULL;
ALTER TABLE chat_sessions ADD COLUMN deleted_at INTEGER DEFAULT NULL;
ALTER TABLE study_sessions ADD COLUMN deleted_at INTEGER DEFAULT NULL;
ALTER TABLE study_goals ADD COLUMN deleted_at INTEGER DEFAULT NULL;
ALTER TABLE shared_resources ADD COLUMN deleted_at INTEGER DEFAULT NULL;
ALTER TABLE study_groups ADD COLUMN deleted_at INTEGER DEFAULT NULL;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_exams_user_id_deleted ON exams(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_exams_user_updated ON exams(user_id, updated_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON flashcard_decks(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cards_deck_user ON flashcards(deck_id, user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON study_sessions(user_id, session_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_user_updated ON study_sessions(user_id, updated_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_chat_user_updated ON chat_sessions(user_id, updated_at DESC) WHERE deleted_at IS NULL;

-- Leaderboard optimization
CREATE INDEX IF NOT EXISTS idx_leaderboard_sessions_user_activity ON study_sessions(user_id, activity, session_date DESC);

-- Cleanup old data (optional, run once)
-- DELETE FROM exams WHERE deleted_at IS NOT NULL AND deleted_at < (strftime('%s','now') * 1000 - 2592000000); -- 30 days