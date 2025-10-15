import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Routine, Block, DayRoutine } from '../shared/models/routine.model';
import { Observable, from, map } from 'rxjs';

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
  private supabase: SupabaseClient;

  constructor() {

  }

  getRoutines(gymId: string): Observable<Routine[]> {
    return from(
      this.supabase
        .from('routines')
        .select(`
          id,
          name,
          description,
          type,
          created_by,
          gym_id,
          created_at,
          updated_at
        `)
        .eq('gym_id', gymId)
        .order('created_at', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          type: item.type,
          createdBy: item.created_by,
          gymId: item.gym_id,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          weeklyPlan: []
        })) as Routine[];
      })
    );
  }

  getRoutineById(routineId: string): Observable<Routine> {
    return from(
      this.supabase
        .from('routines')
        .select(`
          id,
          name,
          description,
          type,
          created_by,
          gym_id,
          created_at,
          updated_at,
          day_routines (
            id,
            day,
            order,
            blocks (
              id,
              name,
              description,
              order,
              block_exercises (
                id,
                exercise_id,
                sets,
                reps,
                rest,
                weight,
                notes,
                order
              )
            )
          ),
          routine_assignments (
            student_id
          )
        `)
        .eq('id', routineId)
        .maybeSingle()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        if (!response.data) throw new Error('Routine not found');

        const data = response.data as any;

        const weeklyPlan: DayRoutine[] = (data.day_routines || []).map((dr: any) => ({
          day: dr.day,
          blocks: (dr.blocks || []).map((b: any) => ({
            id: b.id,
            name: b.name,
            description: b.description,
            order: b.order,
            exercises: (b.block_exercises || []).map((be: any) => ({
              exerciseId: be.exercise_id,
              sets: be.sets,
              reps: be.reps,
              rest: be.rest,
              weight: be.weight,
              notes: be.notes,
              order: be.order
            }))
          }))
        }));

        const routine: Routine = {
          id: data.id,
          name: data.name,
          description: data.description,
          type: data.type,
          createdBy: data.created_by,
          gymId: data.gym_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          weeklyPlan,
          assignedTo: (data.routine_assignments || []).map((ra: any) => ra.student_id)
        };

        return routine;
      })
    );
  }

  createRoutine(payload: CreateRoutinePayload): Observable<Routine> {
    return from(
      (async () => {
        const { data: routine, error: routineError } = await this.supabase
          .from('routines')
          .insert({
            name: payload.name,
            description: payload.description,
            type: payload.type,
            created_by: payload.createdBy,
            gym_id: payload.gymId
          })
          .select()
          .single();

        if (routineError) throw routineError;

        for (const dayPlan of payload.weeklyPlan) {
          const { data: dayRoutine, error: dayError } = await this.supabase
            .from('day_routines')
            .insert({
              routine_id: routine.id,
              day: dayPlan.day,
              order: 0
            })
            .select()
            .single();

          if (dayError) throw dayError;

          for (const block of dayPlan.blocks) {
            const { data: blockData, error: blockError } = await this.supabase
              .from('blocks')
              .insert({
                day_routine_id: dayRoutine.id,
                name: block.name,
                description: block.description,
                order: block.order
              })
              .select()
              .single();

            if (blockError) throw blockError;

            if (block.exercises && block.exercises.length > 0) {
              const blockExercises = block.exercises.map(ex => ({
                block_id: blockData.id,
                exercise_id: ex.exerciseId,
                sets: ex.sets,
                reps: ex.reps,
                rest: ex.rest,
                weight: ex.weight,
                notes: ex.notes,
                order: ex.order
              }));

              const { error: exercisesError } = await this.supabase
                .from('block_exercises')
                .insert(blockExercises);

              if (exercisesError) throw exercisesError;
            }
          }
        }

        if (payload.assignedTo && payload.assignedTo.length > 0) {
          const assignments = payload.assignedTo.map(studentId => ({
            routine_id: routine.id,
            student_id: studentId,
            assigned_by: payload.createdBy
          }));

          const { error: assignmentsError } = await this.supabase
            .from('routine_assignments')
            .insert(assignments);

          if (assignmentsError) throw assignmentsError;
        }

        return this.getRoutineById(routine.id).toPromise();
      })()
    ).pipe(
      map(routine => {
        if (!routine) throw new Error('Failed to create routine');
        return routine;
      })
    );
  }

  updateRoutine(routineId: string, payload: Partial<CreateRoutinePayload>): Observable<Routine> {
    return from(
      (async () => {
        const { error: routineError } = await this.supabase
          .from('routines')
          .update({
            name: payload.name,
            description: payload.description,
            type: payload.type
          })
          .eq('id', routineId);

        if (routineError) throw routineError;

        if (payload.weeklyPlan) {
          const { error: deleteDaysError } = await this.supabase
            .from('day_routines')
            .delete()
            .eq('routine_id', routineId);

          if (deleteDaysError) throw deleteDaysError;

          for (const dayPlan of payload.weeklyPlan) {
            const { data: dayRoutine, error: dayError } = await this.supabase
              .from('day_routines')
              .insert({
                routine_id: routineId,
                day: dayPlan.day,
                order: 0
              })
              .select()
              .single();

            if (dayError) throw dayError;

            for (const block of dayPlan.blocks) {
              const { data: blockData, error: blockError } = await this.supabase
                .from('blocks')
                .insert({
                  day_routine_id: dayRoutine.id,
                  name: block.name,
                  description: block.description,
                  order: block.order
                })
                .select()
                .single();

              if (blockError) throw blockError;

              if (block.exercises && block.exercises.length > 0) {
                const blockExercises = block.exercises.map(ex => ({
                  block_id: blockData.id,
                  exercise_id: ex.exerciseId,
                  sets: ex.sets,
                  reps: ex.reps,
                  rest: ex.rest,
                  weight: ex.weight,
                  notes: ex.notes,
                  order: ex.order
                }));

                const { error: exercisesError } = await this.supabase
                  .from('block_exercises')
                  .insert(blockExercises);

                if (exercisesError) throw exercisesError;
              }
            }
          }
        }

        if (payload.assignedTo !== undefined) {
          const { error: deleteAssignmentsError } = await this.supabase
            .from('routine_assignments')
            .delete()
            .eq('routine_id', routineId);

          if (deleteAssignmentsError) throw deleteAssignmentsError;

          if (payload.assignedTo.length > 0 && payload.createdBy) {
            const assignments = payload.assignedTo.map(studentId => ({
              routine_id: routineId,
              student_id: studentId,
              assigned_by: payload.createdBy
            }));

            const { error: assignmentsError } = await this.supabase
              .from('routine_assignments')
              .insert(assignments);

            if (assignmentsError) throw assignmentsError;
          }
        }

        return this.getRoutineById(routineId).toPromise();
      })()
    ).pipe(
      map(routine => {
        if (!routine) throw new Error('Failed to update routine');
        return routine;
      })
    );
  }

  deleteRoutine(routineId: string): Observable<void> {
    return from(
      this.supabase
        .from('routines')
        .delete()
        .eq('id', routineId)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  assignRoutineToStudents(routineId: string, studentIds: string[], assignedBy: string): Observable<void> {
    return from(
      (async () => {
        const { error: deleteError } = await this.supabase
          .from('routine_assignments')
          .delete()
          .eq('routine_id', routineId);

        if (deleteError) throw deleteError;

        if (studentIds.length > 0) {
          const assignments = studentIds.map(studentId => ({
            routine_id: routineId,
            student_id: studentId,
            assigned_by: assignedBy
          }));

          const { error: insertError } = await this.supabase
            .from('routine_assignments')
            .insert(assignments);

          if (insertError) throw insertError;
        }
      })()
    ).pipe(
      map(() => undefined)
    );
  }

  getStudentRoutines(studentId: string): Observable<Routine[]> {
    return from(
      this.supabase
        .from('routine_assignments')
        .select(`
          routine:routines (
            id,
            name,
            description,
            type,
            created_by,
            gym_id,
            created_at,
            updated_at
          )
        `)
        .eq('student_id', studentId)
        .eq('is_active', true)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map((item: any) => item.routine) as Routine[];
      })
    );
  }
}
