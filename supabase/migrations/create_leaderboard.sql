/*
  # Create Leaderboard Schema

  1. New Tables
    - `leaderboard`
      - `id` (uuid, primary key)
      - `player_name` (text, not null)
      - `score` (integer, not null)
      - `level` (integer, not null)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `leaderboard` table
    - Add policy for anyone to read leaderboard
    - Add policy for anyone to insert scores
*/

CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read leaderboard"
  ON leaderboard
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert scores"
  ON leaderboard
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC, created_at ASC);
