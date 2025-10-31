export interface ProgramRoutine {
  programId: string;
  routineId: string;
  weekNumber: number;
  notes?: string;
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  durationWeeks: number;
  gymId: string;
  createdBy: string;
  routines: ProgramRoutine[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentProgramAssignment {
  id: string;
  programId: string;
  programName: string;
  studentId: string;
  studentName: string;
  startDate: string;
  currentWeek: number;
  status: 'active' | 'completed' | 'paused';
  autoProgressionEnabled: boolean;
  createdAt: string;
  updatedAt?: string;
}
