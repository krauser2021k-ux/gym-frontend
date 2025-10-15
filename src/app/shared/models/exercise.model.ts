export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  videoUrl: string;
  videoUrls: string[];
  thumbnailUrl?: string;
  exerciseType?: 'strength' | 'hypertrophy' | 'endurance' | 'cardio' | 'mobility' | 'functional';
  suggestedSets?: string;
  suggestedReps?: string;
  suggestedRest?: string;
  tempo?: string;
  keyInstructions?: string[];
  contraindications?: string;
  easierVariations?: string;
  harderVariations?: string;
  isPublic?: boolean;
  tags?: string[];
  createdBy: string;
  gymId: string;
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
