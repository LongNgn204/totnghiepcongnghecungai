CREATE TABLE IF NOT EXISTS knowledge_sources (
  id TEXT PRIMARY KEY,
  source_type TEXT NOT NULL,
  title TEXT NOT NULL,
  channel TEXT,
  url TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  reliability REAL DEFAULT 0.9,
  created_at INTEGER DEFAULT (unixepoch() * 1000),
  updated_at INTEGER DEFAULT (unixepoch() * 1000)
);

CREATE TABLE IF NOT EXISTS knowledge_lessons (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  grade TEXT NOT NULL,
  subject TEXT NOT NULL,
  module TEXT NOT NULL,
  topic TEXT NOT NULL,
  level TEXT DEFAULT 'beginner',
  locale TEXT DEFAULT 'vi',
  summary TEXT,
  tags TEXT,
  thumbnail TEXT,
  duration_seconds INTEGER,
  published_at TEXT,
  created_at INTEGER DEFAULT (unixepoch() * 1000),
  updated_at INTEGER DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (source_id) REFERENCES knowledge_sources(id)
);

CREATE TABLE IF NOT EXISTS knowledge_segments (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL,
  title TEXT,
  content TEXT,
  start_second INTEGER,
  end_second INTEGER,
  citation TEXT,
  created_at INTEGER DEFAULT (unixepoch() * 1000),
  updated_at INTEGER DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (lesson_id) REFERENCES knowledge_lessons(id)
);

