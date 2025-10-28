import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineService } from '../../core/routine.service';
import { ApiService } from '../../core/api.service';
import { Routine, Exercise } from '../../shared/models';

@Component({
  selector: 'app-routine-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center space-x-4 mb-6">
        <button (click)="goBack()"
                class="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-200">
          <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Detalle de Rutina</h1>
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      } @else if (routine()) {
        <div class="glass rounded-lg p-6 mb-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl font-bold text-white mb-2">{{ routine()!.name }}</h2>
              @if (routine()!.description) {
                <p class="text-white/70">{{ routine()!.description }}</p>
              }
            </div>
            <span [ngClass]="routine()!.type === 'default' ? 'bg-blue-500/20 text-blue-300' : 'bg-cyan-500/20 text-cyan-300'"
                  class="px-3 py-1 text-sm font-medium rounded-full">
              {{ routine()!.type === 'default' ? 'Por Defecto' : 'Personalizada' }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div class="bg-white/10 rounded-lg p-4">
              <div class="flex items-center text-white/60 mb-2">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm">Días de Entrenamiento</span>
              </div>
              <p class="text-2xl font-bold text-white">{{ getRoutineDaysCount() }}</p>
            </div>

            <div class="bg-white/10 rounded-lg p-4">
              <div class="flex items-center text-white/60 mb-2">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span class="text-sm">Bloques Totales</span>
              </div>
              <p class="text-2xl font-bold text-white">{{ getTotalBlocks() }}</p>
            </div>

            <div class="bg-white/10 rounded-lg p-4">
              <div class="flex items-center text-white/60 mb-2">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span class="text-sm">Ejercicios Totales</span>
              </div>
              <p class="text-2xl font-bold text-white">{{ getTotalExercises() }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          @for (day of routine()!.weeklyPlan; track day.day) {
            <div class="glass rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-white">{{ getDayName(day.day) }}</h3>
                <span class="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                  Día {{ day.day }}
                </span>
              </div>

              @if (day.blocks && day.blocks.length > 0) {
                <div class="space-y-4">
                  @for (block of day.blocks; track block.id) {
                    <div class="border border-white/20 rounded-lg p-5 bg-white/5">
                      <div class="flex justify-between items-start mb-3">
                        <h4 class="text-lg font-bold text-white">{{ block.name }}</h4>
                        @if (block.order) {
                          <span class="px-2 py-1 bg-white/10 text-white/70 rounded text-xs font-medium">
                            Orden: {{ block.order }}
                          </span>
                        }
                      </div>

                      @if (block.description) {
                        <p class="text-sm text-white/60 mb-4">{{ block.description }}</p>
                      }

                      @if (block.exercises && block.exercises.length > 0) {
                        <div class="space-y-3">
                          @for (exercise of block.exercises; track exercise.exerciseId) {
                            @if (getExerciseDetails(exercise.exerciseId); as exerciseDetail) {
                              <div class="bg-white/10 rounded-lg overflow-hidden border border-white/10">
                                @if (exerciseDetail.thumbnailUrl) {
                                  <img [src]="exerciseDetail.thumbnailUrl" [alt]="exerciseDetail.name"
                                       class="w-full h-40 object-cover">
                                }
                                <div class="p-4">
                                  <div class="mb-3">
                                    <h5 class="text-lg font-bold text-white mb-1">
                                      {{ exerciseDetail.name }}
                                    </h5>
                                    @if (exerciseDetail.description) {
                                      <p class="text-sm text-white/60 line-clamp-2">{{ exerciseDetail.description }}</p>
                                    }
                                    @if (exerciseDetail.muscleGroups && exerciseDetail.muscleGroups.length > 0) {
                                      <div class="flex flex-wrap gap-1 mt-2">
                                        @for (muscle of exerciseDetail.muscleGroups; track muscle) {
                                          <span class="px-2 py-1 text-white/80 text-xs rounded-full bg-green-500/20">
                                            {{ muscle }}
                                          </span>
                                        }
                                      </div>
                                    }
                                  </div>

                                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    @if (exercise.sets) {
                                      <div class="bg-white/5 rounded-lg p-3 text-center">
                                        <div class="text-xs text-white/60 mb-1">Series</div>
                                        <div class="text-xl font-bold text-blue-400">{{ exercise.sets }}</div>
                                      </div>
                                    }
                                    @if (exercise.reps) {
                                      <div class="bg-white/5 rounded-lg p-3 text-center">
                                        <div class="text-xs text-white/60 mb-1">Repeticiones</div>
                                        <div class="text-xl font-bold text-purple-400">{{ exercise.reps }}</div>
                                      </div>
                                    }
                                    @if (exercise.weight) {
                                      <div class="bg-white/5 rounded-lg p-3 text-center">
                                        <div class="text-xs text-white/60 mb-1">Peso</div>
                                        <div class="text-xl font-bold text-blue-400">{{ exercise.weight }}</div>
                                      </div>
                                    }
                                    @if (exercise.rest) {
                                      <div class="bg-white/5 rounded-lg p-3 text-center">
                                        <div class="text-xs text-white/60 mb-1">Descanso</div>
                                        <div class="text-xl font-bold text-purple-400">{{ exercise.rest }}</div>
                                      </div>
                                    }
                                  </div>

                                  @if (exercise.notes) {
                                    <div class="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                      <div class="flex items-start">
                                        <svg class="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                        </svg>
                                        <p class="text-sm text-blue-300">{{ exercise.notes }}</p>
                                      </div>
                                    </div>
                                  }
                                </div>
                              </div>
                            }
                          }
                        </div>
                      } @else {
                        <p class="text-sm text-white/50 italic">No hay ejercicios en este bloque</p>
                      }
                    </div>
                  }
                </div>
              } @else {
                <div class="text-center py-8">
                  <svg class="mx-auto h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p class="mt-4 text-white/70 text-sm">Día de descanso</p>
                </div>
              }
            </div>
          }
        </div>

      } @else {
        <div class="glass rounded-lg p-12">
          <div class="text-center">
            <svg class="mx-auto h-16 w-16 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-4 text-xl font-medium text-white">Rutina no encontrada</h3>
            <p class="mt-2 text-white/60">La rutina que buscas no existe o no está disponible.</p>
            <button (click)="goBack()"
                    class="mt-6 px-6 py-3 glass hover:bg-white/20 text-white rounded-lg transition-all duration-200 font-medium">
              Volver
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class RoutineDetailComponent implements OnInit {
  routine = signal<Routine | undefined>(undefined);
  loading = signal(true);
  exercisesMap = signal<Map<string, Exercise>>(new Map());

  private routineId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routineService: RoutineService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.routineId = this.route.snapshot.paramMap.get('routineId') || '';
    if (this.routineId) {
      this.apiService.get<Exercise[]>('/exercises').subscribe({
        next: (exercises) => {
          const map = new Map<string, Exercise>();
          exercises.forEach(ex => map.set(ex.id, ex));
          this.exercisesMap.set(map);
          this.loadRoutine();
        },
        error: (err) => {
          console.error('Error loading exercises:', err);
          this.loadRoutine();
        }
      });
    }
  }

  loadRoutine() {
    this.routineService.getRoutineById(this.routineId).subscribe({
      next: (routine) => {
        this.routine.set(routine);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading routine:', err);
        this.loading.set(false);
      }
    });
  }

  getExerciseDetails(exerciseId: string): Exercise | undefined {
    return this.exercisesMap().get(exerciseId);
  }

  getDayName(day: number): string {
    const days = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return days[day] || `Día ${day}`;
  }

  getRoutineDaysCount(): number {
    return this.routine()?.weeklyPlan?.length || 0;
  }

  getTotalBlocks(): number {
    let total = 0;
    this.routine()?.weeklyPlan.forEach(day => {
      total += day.blocks?.length || 0;
    });
    return total;
  }

  getTotalExercises(): number {
    let total = 0;
    this.routine()?.weeklyPlan.forEach(day => {
      day.blocks?.forEach(block => {
        total += block.exercises?.length || 0;
      });
    });
    return total;
  }

  goBack() {
    this.router.navigate(['/routines']);
  }
}
