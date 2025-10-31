import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Program, StudentProgramAssignment } from '../shared/models';

interface CreateProgramPayload {
  name: string;
  description?: string;
  durationWeeks: number;
  gymId: string;
  createdBy: string;
  routines: Array<{
    routineId: string;
    weekNumber: number;
    notes?: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private mockPrograms: Program[] = [];
  private mockAssignments: StudentProgramAssignment[] = [];

  constructor() {}

  getPrograms(gymId: string): Observable<Program[]> {
    const filtered = this.mockPrograms.filter(p => p.gymId === gymId);
    return of(filtered).pipe(delay(300));
  }

  getProgramById(programId: string): Observable<Program> {
    const program = this.mockPrograms.find(p => p.id === programId);
    if (!program) {
      return throwError(() => new Error('Program not found'));
    }
    return of(program).pipe(delay(300));
  }

  createProgram(payload: CreateProgramPayload): Observable<Program> {
    const newProgram: Program = {
      id: `program-${Date.now()}`,
      name: payload.name,
      description: payload.description,
      durationWeeks: payload.durationWeeks,
      gymId: payload.gymId,
      createdBy: payload.createdBy,
      routines: payload.routines.map(r => ({
        programId: `program-${Date.now()}`,
        routineId: r.routineId,
        weekNumber: r.weekNumber,
        notes: r.notes
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockPrograms.push(newProgram);
    return of(newProgram).pipe(delay(300));
  }

  updateProgram(programId: string, payload: Partial<CreateProgramPayload>): Observable<Program> {
    const index = this.mockPrograms.findIndex(p => p.id === programId);
    if (index === -1) {
      return throwError(() => new Error('Program not found'));
    }

    const updatedProgram: Program = {
      ...this.mockPrograms[index],
      name: payload.name ?? this.mockPrograms[index].name,
      description: payload.description ?? this.mockPrograms[index].description,
      durationWeeks: payload.durationWeeks ?? this.mockPrograms[index].durationWeeks,
      routines: payload.routines ? payload.routines.map(r => ({
        programId: programId,
        routineId: r.routineId,
        weekNumber: r.weekNumber,
        notes: r.notes
      })) : this.mockPrograms[index].routines,
      updatedAt: new Date().toISOString()
    };

    this.mockPrograms[index] = updatedProgram;
    return of(updatedProgram).pipe(delay(300));
  }

  deleteProgram(programId: string): Observable<void> {
    const hasActiveAssignments = this.mockAssignments.some(
      a => a.programId === programId && a.status === 'active'
    );

    if (hasActiveAssignments) {
      return throwError(() => new Error('Cannot delete program with active assignments'));
    }

    const index = this.mockPrograms.findIndex(p => p.id === programId);
    if (index !== -1) {
      this.mockPrograms.splice(index, 1);
    }
    return of(undefined).pipe(delay(300));
  }

  duplicateProgram(programId: string): Observable<Program> {
    const original = this.mockPrograms.find(p => p.id === programId);
    if (!original) {
      return throwError(() => new Error('Program not found'));
    }

    const newId = `program-${Date.now()}`;
    const duplicated: Program = {
      ...original,
      id: newId,
      name: `${original.name} (Copia)`,
      routines: original.routines.map(r => ({
        ...r,
        programId: newId
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.mockPrograms.push(duplicated);
    return of(duplicated).pipe(delay(300));
  }

  assignProgramToStudent(
    programId: string,
    studentId: string,
    studentName: string,
    startDate: string,
    autoProgressionEnabled: boolean
  ): Observable<StudentProgramAssignment> {
    const program = this.mockPrograms.find(p => p.id === programId);
    if (!program) {
      return throwError(() => new Error('Program not found'));
    }

    const assignment: StudentProgramAssignment = {
      id: `assignment-prog-${Date.now()}`,
      programId: program.id,
      programName: program.name,
      studentId,
      studentName,
      startDate,
      currentWeek: 1,
      status: 'active',
      autoProgressionEnabled,
      createdAt: new Date().toISOString()
    };

    this.mockAssignments.push(assignment);
    return of(assignment).pipe(delay(300));
  }

  getStudentActiveProgram(studentId: string): Observable<StudentProgramAssignment | null> {
    const assignment = this.mockAssignments.find(
      a => a.studentId === studentId && a.status === 'active'
    );
    return of(assignment || null).pipe(delay(300));
  }

  getAllStudentProgramAssignments(): Observable<StudentProgramAssignment[]> {
    return of(this.mockAssignments).pipe(delay(300));
  }

  updateStudentProgress(assignmentId: string, newWeek: number): Observable<StudentProgramAssignment> {
    const index = this.mockAssignments.findIndex(a => a.id === assignmentId);
    if (index === -1) {
      return throwError(() => new Error('Assignment not found'));
    }

    const assignment = this.mockAssignments[index];
    const program = this.mockPrograms.find(p => p.id === assignment.programId);

    if (!program) {
      return throwError(() => new Error('Program not found'));
    }

    const updatedAssignment: StudentProgramAssignment = {
      ...assignment,
      currentWeek: newWeek,
      status: newWeek > program.durationWeeks ? 'completed' : 'active',
      updatedAt: new Date().toISOString()
    };

    this.mockAssignments[index] = updatedAssignment;
    return of(updatedAssignment).pipe(delay(300));
  }

  pauseProgram(assignmentId: string): Observable<StudentProgramAssignment> {
    const index = this.mockAssignments.findIndex(a => a.id === assignmentId);
    if (index === -1) {
      return throwError(() => new Error('Assignment not found'));
    }

    const updatedAssignment: StudentProgramAssignment = {
      ...this.mockAssignments[index],
      status: 'paused',
      updatedAt: new Date().toISOString()
    };

    this.mockAssignments[index] = updatedAssignment;
    return of(updatedAssignment).pipe(delay(300));
  }

  resumeProgram(assignmentId: string): Observable<StudentProgramAssignment> {
    const index = this.mockAssignments.findIndex(a => a.id === assignmentId);
    if (index === -1) {
      return throwError(() => new Error('Assignment not found'));
    }

    const updatedAssignment: StudentProgramAssignment = {
      ...this.mockAssignments[index],
      status: 'active',
      updatedAt: new Date().toISOString()
    };

    this.mockAssignments[index] = updatedAssignment;
    return of(updatedAssignment).pipe(delay(300));
  }

  getAssignmentsByProgramId(programId: string): Observable<StudentProgramAssignment[]> {
    const assignments = this.mockAssignments.filter(a => a.programId === programId);
    return of(assignments).pipe(delay(300));
  }
}
