import { ExerciseInBlock } from './exercise.model';

export interface BlockPreset {
  id: string;
  name: string;
  description?: string;
  type: 'preset';
  exercises: ExerciseInBlock[];
  createdBy: string;
  createdAt: string;
}
