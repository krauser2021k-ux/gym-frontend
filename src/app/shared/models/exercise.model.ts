export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  equipment: string[];
  videoUrls: string[];
  thumbnailUrl?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExerciseInBlock {
  exerciseId: string;
  sets?: number;
  reps?: string;
  rest?: string;
  weight?: string;
  notes?: string;
  order: number;
}
