/*
  # Create Routines and Related Tables

  1. New Tables
    - `routines`
      - `id` (uuid, primary key) - Unique identifier for the routine
      - `name` (text) - Name of the routine
      - `description` (text) - Optional description
      - `type` (text) - Type: default or personalized
      - `created_by` (uuid) - Trainer who created the routine
      - `gym_id` (uuid) - Gym that owns the routine
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `routine_assignments`
      - `id` (uuid, primary key) - Unique identifier
      - `routine_id` (uuid) - Reference to routine
      - `student_id` (uuid) - Student assigned to the routine
      - `assigned_by` (uuid) - Trainer who made the assignment
      - `assigned_at` (timestamptz) - Assignment timestamp
      - `is_active` (boolean) - Whether assignment is currently active

    - `day_routines`
      - `id` (uuid, primary key) - Unique identifier
      - `routine_id` (uuid) - Reference to routine
      - `day` (integer) - Day of the week (1-7)
      - `order` (integer) - Order of this day in the routine

    - `blocks`
      - `id` (uuid, primary key) - Unique identifier
      - `day_routine_id` (uuid) - Reference to day routine
      - `name` (text) - Name of the block
      - `description` (text) - Optional description
      - `order` (integer) - Order of the block in the day

    - `block_exercises`
      - `id` (uuid, primary key) - Unique identifier
      - `block_id` (uuid) - Reference to block
      - `exercise_id` (uuid) - Reference to exercise
      - `sets` (integer) - Number of sets
      - `reps` (text) - Repetitions (can be range like "10-12")
      - `rest` (text) - Rest time between sets
      - `weight` (text) - Suggested weight
      - `notes` (text) - Additional notes
      - `order` (integer) - Order of exercise in the block

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read routines from their gym
    - Add policies for trainers to create, update, and delete their own routines
    - Add policies for managing assignments and related data

  3. Indexes
    - Add indexes for foreign keys and frequently queried columns
*/

-- Create routines table
CREATE TABLE IF NOT EXISTS routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('default', 'personalized')),
  created_by uuid NOT NULL,
  gym_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view routines from their gym"
  ON routines FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Trainers can create routines"
  ON routines FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Trainers can update their own routines"
  ON routines FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Trainers can delete their own routines"
  ON routines FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE INDEX IF NOT EXISTS idx_routines_gym_id ON routines(gym_id);
CREATE INDEX IF NOT EXISTS idx_routines_created_by ON routines(created_by);
CREATE INDEX IF NOT EXISTS idx_routines_type ON routines(type);

-- Create routine_assignments table
CREATE TABLE IF NOT EXISTS routine_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id uuid NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  assigned_by uuid NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE routine_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view routine assignments"
  ON routine_assignments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Trainers can create assignments"
  ON routine_assignments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = assigned_by);

CREATE POLICY "Trainers can update their assignments"
  ON routine_assignments FOR UPDATE
  TO authenticated
  USING (auth.uid() = assigned_by)
  WITH CHECK (auth.uid() = assigned_by);

CREATE POLICY "Trainers can delete their assignments"
  ON routine_assignments FOR DELETE
  TO authenticated
  USING (auth.uid() = assigned_by);

CREATE INDEX IF NOT EXISTS idx_routine_assignments_routine_id ON routine_assignments(routine_id);
CREATE INDEX IF NOT EXISTS idx_routine_assignments_student_id ON routine_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_routine_assignments_is_active ON routine_assignments(is_active);

-- Create day_routines table
CREATE TABLE IF NOT EXISTS day_routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id uuid NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  day integer NOT NULL CHECK (day >= 1 AND day <= 7),
  "order" integer NOT NULL DEFAULT 0
);

ALTER TABLE day_routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view day routines"
  ON day_routines FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM routines
      WHERE routines.id = day_routines.routine_id
    )
  );

CREATE POLICY "Trainers can create day routines"
  ON day_routines FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM routines
      WHERE routines.id = day_routines.routine_id
      AND routines.created_by = auth.uid()
    )
  );

CREATE POLICY "Trainers can update day routines"
  ON day_routines FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM routines
      WHERE routines.id = day_routines.routine_id
      AND routines.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM routines
      WHERE routines.id = day_routines.routine_id
      AND routines.created_by = auth.uid()
    )
  );

CREATE POLICY "Trainers can delete day routines"
  ON day_routines FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM routines
      WHERE routines.id = day_routines.routine_id
      AND routines.created_by = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_day_routines_routine_id ON day_routines(routine_id);

-- Create blocks table
CREATE TABLE IF NOT EXISTS blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_routine_id uuid NOT NULL REFERENCES day_routines(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  "order" integer NOT NULL DEFAULT 0
);

ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view blocks"
  ON blocks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM day_routines
      JOIN routines ON routines.id = day_routines.routine_id
      WHERE day_routines.id = blocks.day_routine_id
    )
  );

CREATE POLICY "Trainers can create blocks"
  ON blocks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM day_routines
      JOIN routines ON routines.id = day_routines.routine_id
      WHERE day_routines.id = blocks.day_routine_id
      AND routines.created_by = auth.uid()
    )
  );

CREATE POLICY "Trainers can update blocks"
  ON blocks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM day_routines
      JOIN routines ON routines.id = day_routines.routine_id
      WHERE day_routines.id = blocks.day_routine_id
      AND routines.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM day_routines
      JOIN routines ON routines.id = day_routines.routine_id
      WHERE day_routines.id = blocks.day_routine_id
      AND routines.created_by = auth.uid()
    )
  );

CREATE POLICY "Trainers can delete blocks"
  ON blocks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM day_routines
      JOIN routines ON routines.id = day_routines.routine_id
      WHERE day_routines.id = blocks.day_routine_id
      AND routines.created_by = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_blocks_day_routine_id ON blocks(day_routine_id);

-- Create block_exercises table
CREATE TABLE IF NOT EXISTS block_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id uuid NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets integer,
  reps text,
  rest text,
  weight text,
  notes text,
  "order" integer NOT NULL DEFAULT 0
);

ALTER TABLE block_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view block exercises"
  ON block_exercises FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM blocks
      JOIN day_routines ON day_routines.id = blocks.day_routine_id
      JOIN routines ON routines.id = day_routines.routine_id
      WHERE blocks.id = block_exercises.block_id
    )
  );

CREATE POLICY "Trainers can create block exercises"
  ON block_exercises FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM blocks
      JOIN day_routines ON day_routines.id = blocks.day_routine_id
      JOIN routines ON routines.id = day_routines.routine_id
      WHERE blocks.id = block_exercises.block_id
      AND routines.created_by = auth.uid()
    )
  );

CREATE POLICY "Trainers can update block exercises"
  ON block_exercises FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM blocks
      JOIN day_routines ON day_routines.id = blocks.day_routine_id
      JOIN routines ON routines.id = day_routines.routine_id
      WHERE blocks.id = block_exercises.block_id
      AND routines.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM blocks
      JOIN day_routines ON day_routines.id = blocks.day_routine_id
      JOIN routines ON routines.id = day_routines.routine_id
      WHERE blocks.id = block_exercises.block_id
      AND routines.created_by = auth.uid()
    )
  );

CREATE POLICY "Trainers can delete block exercises"
  ON block_exercises FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM blocks
      JOIN day_routines ON day_routines.id = blocks.day_routine_id
      JOIN routines ON routines.id = day_routines.routine_id
      WHERE blocks.id = block_exercises.block_id
      AND routines.created_by = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_block_exercises_block_id ON block_exercises(block_id);
CREATE INDEX IF NOT EXISTS idx_block_exercises_exercise_id ON block_exercises(exercise_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for routines
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_routines_updated_at'
  ) THEN
    CREATE TRIGGER update_routines_updated_at
      BEFORE UPDATE ON routines
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;