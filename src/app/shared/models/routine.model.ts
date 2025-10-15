import { ExerciseInBlock } from './exercise.model';

export interface Block {
  id: string;
  name: string;
  description?: string;
  exercises: ExerciseInBlock[];
  order: number;
}

export interface DayRoutine {
  day: number;
  blocks: Block[];
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  type: 'default' | 'personalized';
  weeklyPlan: DayRoutine[];
  createdBy: string;
  gymId: string;
  assignedTo?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExerciseComment {
  id: string;
  exerciseId: string;
  studentId: string;
  routineId: string;
  comment: string;
  completed: boolean;
  createdAt: string;
}
