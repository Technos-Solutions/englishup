-- EnglishUp Database Schema
-- Run this in your Supabase SQL editor

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  xp            INTEGER DEFAULT 0,
  level         TEXT DEFAULT 'A1',
  streak        INTEGER DEFAULT 0,
  last_activity DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions (game/conversation history)
CREATE TABLE sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_type       TEXT NOT NULL,
  xp_earned       INTEGER DEFAULT 0,
  fluency_score   INTEGER,
  duration_seconds INTEGER,
  corrections     JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements (trophies)
CREATE TABLE achievements (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  earned_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_type)
);

-- Row Level Security
ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Policies: profiles
CREATE POLICY "Anyone can view profiles for ranking"
  ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies: sessions
CREATE POLICY "Users view own sessions"
  ON sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions"
  ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies: achievements
CREATE POLICY "Anyone can view achievements for ranking"
  ON achievements FOR SELECT USING (true);
CREATE POLICY "Users insert own achievements"
  ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
