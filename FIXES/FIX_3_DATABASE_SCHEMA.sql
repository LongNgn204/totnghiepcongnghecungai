-- FIX #3: Add Soft Delete Columns and Indexes
-- 
-- Problem: Missing soft delete columns, missing indexes, no updated_at tracking
-- Solution: Add soft delete support and performance indexes
-- Time: 45 minutes
--
-- File: workers/migrations/001_add_soft_deletes.sql

-- ============= ADD SOFT DELETE COLUMNS =============

-- Add deleted_at to exams
ALTER TABLE exams ADD COLUMN deleted_at INTEGER;
ALTER TABLE exams ADD COLUMN updated_at INTEGER;

-- Add deleted_at to flashcard_decks
ALTER TABLE flashcard_decks ADD COLUMN deleted_at INTEGER;

-- Add deleted_at to flashcards
ALTER TABLE flashcards ADD COLUMN deleted_at INTEGER;
ALTER TABLE flashcards ADD COLUMN updated_at INTEGER;

-- Add deleted_at to chat_sessions
ALTER TABLE chat_sessions ADD COLUMN deleted_at INTEGER;

-- Add deleted_at to study_sessions
ALTER TABLE study_sessions ADD COLUMN deleted_at INTEGER;
ALTER TABLE study_sessions ADD COLUMN updated_at INTEGER;

-- Add deleted_at to auth_users
ALTER TABLE auth_users ADD COLUMN deleted_at INTEGER;

-- ============= ADD PERFORMANCE INDEXES =============

-- Indexes for auth_users
CREATE INDEX IF NOT EXISTS idx_auth_users_username ON auth_users(username);
CREATE INDEX IF NOT EXISTS idx_auth_users_deleted ON auth_users(deleted_at);

-- Indexes for exams
CREATE INDEX IF NOT EXISTS idx_exams_user_date ON exams(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_exams_deleted ON exams(deleted_at);

-- Indexes for flashcard_decks
CREATE INDEX IF NOT EXISTS idx_decks_user_deleted ON flashcard_decks(user_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_decks_deleted ON flashcard_decks(deleted_at);

-- Indexes for flashcards
CREATE INDEX IF NOT EXISTS idx_cards_deck_deleted ON flashcards(deck_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_cards_last_reviewed ON flashcards(last_reviewed);
CREATE INDEX IF NOT EXISTS idx_cards_next_review ON flashcards(next_review);
CREATE INDEX IF NOT EXISTS idx_cards_deleted ON flashcards(deleted_at);

-- Indexes for chat_sessions
CREATE INDEX IF NOT EXISTS idx_chats_user_date ON chat_sessions(user_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_chats_deleted ON chat_sessions(deleted_at);

-- Indexes for study_sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON study_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_activity ON study_sessions(activity);
CREATE INDEX IF NOT EXISTS idx_sessions_deleted ON study_sessions(deleted_at);

-- ============= UPDATE QUERIES TO EXCLUDE SOFT DELETES =============

-- When querying, always add: WHERE deleted_at IS NULL

-- Example queries:

-- Get all exams for user (excluding deleted)
-- SELECT * FROM exams WHERE user_id = ? AND deleted_at IS NULL;

-- Get all flashcard decks (excluding deleted)
-- SELECT * FROM flashcard_decks WHERE user_id = ? AND deleted_at IS NULL;

-- Get all flashcards in deck (excluding deleted)
-- SELECT * FROM flashcards WHERE deck_id = ? AND deleted_at IS NULL;

-- Get all chat sessions (excluding deleted)
-- SELECT * FROM chat_sessions WHERE user_id = ? AND deleted_at IS NULL;

-- Get all study sessions (excluding deleted)
-- SELECT * FROM study_sessions WHERE user_id = ? AND deleted_at IS NULL;

-- ============= SOFT DELETE FUNCTION =============

-- To soft delete a record, set deleted_at to current timestamp:
-- UPDATE exams SET deleted_at = ? WHERE id = ?;

-- To restore a soft deleted record:
-- UPDATE exams SET deleted_at = NULL WHERE id = ?;

-- To permanently delete a record:
-- DELETE FROM exams WHERE id = ?;

-- ============= MIGRATION SCRIPT =============

/*
Run this migration with:

cd workers
wrangler d1 execute ai-hoc-tap-db --file=migrations/001_add_soft_deletes.sql

Or for local testing:
wrangler d1 execute ai-hoc-tap-db --local --file=migrations/001_add_soft_deletes.sql
*/

-- ============= VERIFICATION =============

-- After running migration, verify columns exist:
-- PRAGMA table_info(exams);
-- PRAGMA table_info(flashcard_decks);
-- PRAGMA table_info(flashcards);
-- PRAGMA table_info(chat_sessions);
-- PRAGMA table_info(study_sessions);
-- PRAGMA table_info(auth_users);

-- Verify indexes exist:
-- SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%';

-- ============= CHECKLIST =============
/*
✅ Add deleted_at column to exams
✅ Add updated_at column to exams
✅ Add deleted_at column to flashcard_decks
✅ Add deleted_at column to flashcards
✅ Add updated_at column to flashcards
✅ Add deleted_at column to chat_sessions
✅ Add deleted_at column to study_sessions
✅ Add updated_at column to study_sessions
✅ Add deleted_at column to auth_users
✅ Create performance indexes
✅ Update all SELECT queries to filter deleted_at IS NULL
✅ Test migration
✅ Verify columns and indexes exist
✅ Deploy to staging
*/

