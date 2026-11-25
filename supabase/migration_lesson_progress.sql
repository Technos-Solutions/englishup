-- Incremental migration: adds the lesson_progress table used by the
-- guided Learning Path feature (Irish, for now). Run this once in your
-- Supabase SQL editor — it's already included in schema.sql for anyone
-- setting up a brand new database from scratch.

CREATE TABLE lesson_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lang         TEXT NOT NULL,
  step_id      TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lang, step_id)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own lesson progress"
  ON lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own lesson progress"
  ON lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
