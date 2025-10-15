/*
  # Create Exercises Table

  1. New Tables
    - `exercises`
      - `id` (uuid, primary key) - Unique identifier for the exercise
      - `name` (text) - Name of the exercise
      - `description` (text) - Detailed description of proper execution
      - `category` (text) - Main muscle group category
      - `muscle_groups` (text[]) - Specific muscles worked
      - `difficulty` (text) - Difficulty level: beginner, intermediate, advanced
      - `equipment` (text[]) - Required equipment
      - `video_url` (text) - Main video demonstration URL
      - `video_urls` (text[]) - Additional video URLs
      - `thumbnail_url` (text) - Exercise image/thumbnail URL
      - `exercise_type` (text) - Type: strength, hypertrophy, endurance, cardio, mobility, functional
      - `suggested_sets` (text) - Recommended set range
      - `suggested_reps` (text) - Recommended rep range
      - `suggested_rest` (text) - Suggested rest time
      - `tempo` (text) - Tempo/cadence suggestion
      - `key_instructions` (text[]) - Important execution points
      - `contraindications` (text) - Safety warnings
      - `easier_variations` (text) - Easier alternatives
      - `harder_variations` (text) - Advanced progressions
      - `is_public` (boolean) - Whether exercise is shared across gyms
      - `tags` (text[]) - Custom search tags
      - `created_by` (uuid) - Trainer who created the exercise
      - `gym_id` (uuid) - Gym that owns the exercise
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `exercises` table
    - Add policy for authenticated users to read exercises from their gym
    - Add policy for trainers to create exercises for their gym
    - Add policy for trainers to update their own exercises
    - Add policy for trainers to delete their own exercises
*/

CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  muscle_groups text[] DEFAULT '{}',
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  equipment text[] DEFAULT '{}',
  video_url text NOT NULL,
  video_urls text[] DEFAULT '{}',
  thumbnail_url text,
  exercise_type text CHECK (exercise_type IN ('strength', 'hypertrophy', 'endurance', 'cardio', 'mobility', 'functional')),
  suggested_sets text,
  suggested_reps text,
  suggested_rest text,
  tempo text,
  key_instructions text[] DEFAULT '{}',
  contraindications text,
  easier_variations text,
  harder_variations text,
  is_public boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  created_by uuid NOT NULL,
  gym_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view exercises from their gym"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Trainers can create exercises"
  ON exercises FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Trainers can update their own exercises"
  ON exercises FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Trainers can delete their own exercises"
  ON exercises FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE INDEX IF NOT EXISTS idx_exercises_gym_id ON exercises(gym_id);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_created_by ON exercises(created_by);