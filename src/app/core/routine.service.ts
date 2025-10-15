import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Routine, Block, DayRoutine } from '../shared/models/routine.model';
import { Observable, of, delay } from 'rxjs';

interface CreateRoutinePayload {
  name: string;
  description?: string;
  type: 'default' | 'personalized';
  createdBy: string;
  gymId: string;
  weeklyPlan: DayRoutine[];
  assignedTo?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  private mockRoutines: Routine[] = [
    {
      id: '1',
      name: 'Rutina de Fuerza',
      description: 'Rutina enfocada en desarrollo de fuerza',
      type: 'default',
      createdBy: 'trainer-1',
      gymId: 'gym-1',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
      weeklyPlan: [
        {
          day: 1,
          blocks: [
            {
              id: 'block-1',
              name: 'Calentamiento',
              description: 'Ejercicios de movilidad',
              order: 1,
              exercises: [
                {
                  exerciseId: 'ex-1',
                  sets: 3,
                  notes: 'Sin peso',
                  order: 1
                }
              ]
            },
            {
              id: 'block-2',
              name: 'Pecho',
              description: 'Ejercicios de pecho',
              order: 2,
              exercises: [
                {
                  exerciseId: 'ex-2',
                  sets: 4,
                  notes: 'Press de banca',
                  order: 1
                },
                {
                  exerciseId: 'ex-3',
                  sets: 3,
                  notes: 'Aperturas con mancuernas',
                  order: 2
                }
              ]
            }
          ]
        },
        {
          day: 3,
          blocks: [
            {
              id: 'block-3',
              name: 'Piernas',
              description: 'Ejercicios de piernas',
              order: 1,
              exercises: [
                {
                  exerciseId: 'ex-4',
                  sets: 4,
                  notes: 'Sentadillas',
                  order: 1
                }
              ]
            }
          ]
        }
      ],
      assignedTo: ['student-1', 'student-2']
    },
    {
      id: '2',
      name: 'Rutina de Hipertrofia',
      description: 'Rutina para ganancia muscular',
      type: 'personalized',
      createdBy: 'trainer-1',
      gymId: 'gym-1',
      createdAt: '2025-01-20T10:00:00Z',
      updatedAt: '2025-01-20T10:00:00Z',
      weeklyPlan: [
        {
          day: 2,
          blocks: [
            {
              id: 'block-4',
              name: 'Espalda',
              description: 'Ejercicios de espalda',
              order: 1,
              exercises: [
                {
                  exerciseId: 'ex-5',
                  sets: 4,
                  notes: 'Dominadas',
                  order: 1
                }
              ]
            }
          ]
        }
      ],
      assignedTo: ['student-3']
    }
  ];

  constructor() {

  }

  getRoutines(gymId: string): Observable<Routine[]> {
    const filteredRoutines = this.mockRoutines
      .filter(r => r.gymId === gymId)
      .map(r => ({
        ...r,
        weeklyPlan: [] // Return without weekly plan for list view
      }));
    return of(filteredRoutines).pipe(delay(300));
  }

  getRoutineById(routineId: string): Observable<Routine> {
    const routine = this.mockRoutines.find(r => r.id === routineId);
    if (!routine) {
      throw new Error('Routine not found');
    }
    return of(routine).pipe(delay(300));
  }

  createRoutine(payload: CreateRoutinePayload): Observable<Routine> {
    const newRoutine: Routine = {
      id: `routine-${Date.now()}`,
      name: payload.name,
      description: payload.description,
      type: payload.type,
      createdBy: payload.createdBy,
      gymId: payload.gymId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      weeklyPlan: payload.weeklyPlan,
      assignedTo: payload.assignedTo || []
    };
    this.mockRoutines.push(newRoutine);
    return of(newRoutine).pipe(delay(300));
  }

  updateRoutine(routineId: string, payload: Partial<CreateRoutinePayload>): Observable<Routine> {
    const index = this.mockRoutines.findIndex(r => r.id === routineId);
    if (index === -1) {
      throw new Error('Routine not found');
    }
    
    const updatedRoutine: Routine = {
      ...this.mockRoutines[index],
      name: payload.name ?? this.mockRoutines[index].name,
      description: payload.description ?? this.mockRoutines[index].description,
      type: payload.type ?? this.mockRoutines[index].type,
      weeklyPlan: payload.weeklyPlan ?? this.mockRoutines[index].weeklyPlan,
      assignedTo: payload.assignedTo ?? this.mockRoutines[index].assignedTo,
      updatedAt: new Date().toISOString()
    };
    
    this.mockRoutines[index] = updatedRoutine;
    return of(updatedRoutine).pipe(delay(300));
  }

  deleteRoutine(routineId: string): Observable<void> {
    const index = this.mockRoutines.findIndex(r => r.id === routineId);
    if (index !== -1) {
      this.mockRoutines.splice(index, 1);
    }
    return of(undefined).pipe(delay(300));
  }

  assignRoutineToStudents(routineId: string, studentIds: string[], assignedBy: string): Observable<void> {
    const routine = this.mockRoutines.find(r => r.id === routineId);
    if (routine) {
      routine.assignedTo = studentIds;
    }
    return of(undefined).pipe(delay(300));
  }

  getStudentRoutines(studentId: string): Observable<Routine[]> {
    const studentRoutines = this.mockRoutines.filter(r => 
      r.assignedTo && r.assignedTo.includes(studentId)
    );
    return of(studentRoutines).pipe(delay(300));
  }
}
