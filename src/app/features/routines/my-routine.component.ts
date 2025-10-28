import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Routine, Exercise, Block, ExerciseInBlock } from '../../shared/models';

interface ExerciseProgress {
  exerciseId: string;
  completed: boolean;
  comment: string;
  showCommentField: boolean;
}

interface DayCompletion {
  day: number;
  completed: boolean;
}

@Component({
  selector: 'app-my-routine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 pb-24">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-white">Mi Rutina Semanal</h1>
        @if (selectedBlock()) {
          <button (click)="backToBlocks()"
                  class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver a bloques</span>
          </button>
        }
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      } @else if (routine()) {
        <div class="glass rounded-lg p-6">
          <h2 class="text-2xl font-semibold text-white mb-2">{{ routine()?.name }}</h2>
          <p class="text-white/70 mb-6">{{ routine()?.description }}</p>

          <div class="grid grid-cols-7 gap-2 mb-6">
            @for (day of [1,2,3,4,5,6,7]; track day) {
              <button (click)="selectedDay.set(day)"
                      [ngClass]="{
                        'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105 ring-4 ring-blue-400/50': selectedDay() === day && isCurrentDay(day),
                        'bg-blue-500/30 text-white': selectedDay() === day && !isCurrentDay(day),
                        'bg-green-500/20 text-green-300': selectedDay() !== day && isDayCompleted(day),
                        'bg-white/10 text-white/70': selectedDay() !== day && !isDayCompleted(day) && hasWorkout(day),
                        'bg-white/5 text-white/40': selectedDay() !== day && !hasWorkout(day)
                      }"
                      class="py-3 rounded-lg font-medium transition-all duration-200 relative hover:scale-105">
                <div class="flex flex-col items-center">
                  <span>{{ getDayName(day) }}</span>
                  @if (isDayCompleted(day)) {
                    <svg class="w-4 h-4 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  }
                  @if (isCurrentDay(day) && !isDayCompleted(day)) {
                    <div class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  }
                </div>
              </button>
            }
          </div>

          @if (selectedDayWorkout()) {
            @if (!selectedBlock()) {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                @for (block of selectedDayWorkout()!.blocks; track block.id) {
                  <button (click)="selectBlock(block)"
                          class="glass rounded-xl p-6 text-left hover:scale-105 transition-all duration-300 hover:shadow-xl border-2"
                          [ngClass]="{
                            'border-green-500/50 bg-green-500/10': isBlockCompleted(block),
                            'border-white/20 hover:border-blue-500/50': !isBlockCompleted(block)
                          }">
                    <div class="flex items-start justify-between mb-4">
                      <div class="flex-1">
                        <h3 class="text-2xl font-bold text-white mb-2">{{ block.name }}</h3>
                        @if (block.description) {
                          <p class="text-sm text-white/60 line-clamp-2">{{ block.description }}</p>
                        }
                      </div>
                      @if (isBlockCompleted(block)) {
                        <div class="bg-green-500 rounded-full p-2 ml-3">
                          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      }
                    </div>
                    <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <div class="flex items-center gap-2 text-white/70">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span class="text-sm">{{ block.exercises.length }} ejercicio{{ block.exercises.length !== 1 ? 's' : '' }}</span>
                      </div>
                      <div class="text-sm font-semibold"
                           [ngClass]="{
                             'text-green-400': isBlockCompleted(block),
                             'text-blue-400': !isBlockCompleted(block)
                           }">
                        {{ getBlockProgress(block) }}
                      </div>
                    </div>
                  </button>
                }
              </div>
            } @else {
              <div class="space-y-4">
                <div class="glass rounded-lg p-6 mb-6">
                  <h3 class="text-2xl font-bold text-white mb-2">{{ selectedBlock()!.name }}</h3>
                  @if (selectedBlock()!.description) {
                    <p class="text-white/60">{{ selectedBlock()!.description }}</p>
                  }
                  <div class="flex items-center gap-4 mt-4">
                    <div class="flex items-center gap-2 text-white/70">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span class="text-sm">{{ selectedBlock()!.exercises.length }} ejercicios</span>
                    </div>
                    <div class="text-sm font-semibold"
                         [ngClass]="{
                           'text-green-400': isBlockCompleted(selectedBlock()!),
                           'text-blue-400': !isBlockCompleted(selectedBlock()!)
                         }">
                      {{ getBlockProgress(selectedBlock()!) }}
                    </div>
                  </div>
                </div>
                <div class="space-y-4">
                  @for (ex of selectedBlock()!.exercises; track ex.exerciseId) {
                    @if (getExerciseDetails(ex.exerciseId); as exercise) {
                      <div class="bg-white/10 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-200"
                           [class.ring-2]="isExerciseCompleted(ex.exerciseId)"
                           [class.ring-green-400]="isExerciseCompleted(ex.exerciseId)">
                        @if (exercise.thumbnailUrl) {
                          <div class="relative h-48 w-full">
                            <img [src]="exercise.thumbnailUrl" [alt]="exercise.name"
                                 class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            @if (isExerciseCompleted(ex.exerciseId)) {
                              <div class="absolute top-3 right-3 bg-green-500 rounded-full p-2">
                                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                              </div>
                            }
                          </div>
                        }
                        <div class="p-5">
                          <div class="flex justify-between items-start mb-4">
                            <div class="flex-1">
                              <h4 class="text-xl font-bold text-white mb-1">{{ exercise.name }}</h4>
                              @if (exercise.description) {
                                <p class="text-sm text-white/60 line-clamp-2">{{ exercise.description }}</p>
                              }
                              @if (exercise.muscleGroups && exercise.muscleGroups.length > 0) {
                                <div class="flex flex-wrap gap-1 mt-2">
                                  @for (muscle of exercise.muscleGroups; track muscle) {
                                    <span class="px-2 py-1 text-white/80 text-xs rounded-full bg-green-500/20">
                                      {{ muscle }}
                                    </span>
                                  }
                                </div>
                              }
                            </div>
                            <div class="flex items-center gap-2 ml-4">
                              <button (click)="openExerciseDetail(exercise, ex); $event.stopPropagation()"
                                      class="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 flex-shrink-0">
                                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>
                              <button (click)="toggleExerciseCompletion(ex.exerciseId)"
                                      [ngClass]="{
                                        'bg-green-500 scale-110': isExerciseCompleted(ex.exerciseId),
                                        'bg-white/20 hover:bg-white/30': !isExerciseCompleted(ex.exerciseId)
                                      }"
                                      class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg flex-shrink-0">
                                @if (isExerciseCompleted(ex.exerciseId)) {
                                  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                  </svg>
                                } @else {
                                  <div class="w-6 h-6 rounded-full border-3 border-white/50"></div>
                                }
                              </button>
                            </div>
                          </div>
                          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            @if (ex.sets) {
                              <div class="bg-white/5 rounded-lg p-3 text-center">
                                <div class="text-xs text-white/60 mb-1">Series</div>
                                <div class="text-2xl font-bold text-blue-400">{{ ex.sets }}</div>
                              </div>
                            }
                            @if (ex.reps) {
                              <div class="bg-white/5 rounded-lg p-3 text-center">
                                <div class="text-xs text-white/60 mb-1">Reps</div>
                                <div class="text-2xl font-bold text-purple-400">{{ ex.reps }}</div>
                              </div>
                            }
                            @if (ex.weight) {
                              <div class="bg-white/5 rounded-lg p-3 text-center">
                                <div class="text-xs text-white/60 mb-1">Peso</div>
                                <div class="text-2xl font-bold text-blue-400">{{ ex.weight }}</div>
                              </div>
                            }
                            @if (ex.rest) {
                              <div class="bg-white/5 rounded-lg p-3 text-center">
                                <div class="text-xs text-white/60 mb-1">Descanso</div>
                                <div class="text-2xl font-bold text-purple-400">{{ ex.rest }}</div>
                              </div>
                            }
                          </div>
                          @if (ex.notes) {
                            <div class="mb-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                              <p class="text-sm text-blue-300">{{ ex.notes }}</p>
                            </div>
                          }
                          <div class="flex items-center gap-2">
                            <button (click)="toggleCommentField(ex.exerciseId)"
                                    [ngClass]="{'text-blue-400': getExerciseProgress(ex.exerciseId)?.showCommentField, 'text-white/50': !getExerciseProgress(ex.exerciseId)?.showCommentField}"
                                    class="p-2 hover:bg-white/10 rounded-lg transition-colors">
                              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                              </svg>
                            </button>
                            @if (getExerciseProgress(ex.exerciseId)?.showCommentField) {
                              <input type="text"
                                     [(ngModel)]="exerciseProgress[ex.exerciseId].comment"
                                     placeholder="Agregar nota sobre este ejercicio..."
                                     class="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all">
                            } @else if (getExerciseProgress(ex.exerciseId)?.comment) {
                              <p class="flex-1 text-sm text-white/80 italic">{{ getExerciseProgress(ex.exerciseId)?.comment }}</p>
                            }
                          </div>
                        </div>
                      </div>
                    }
                  }
                </div>
              </div>
            }
          } @else {
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p class="mt-4 text-white/70 text-lg font-medium">Día de descanso</p>
              <p class="text-white/50 text-sm mt-2">Aprovecha para recuperarte</p>
            </div>
          }
        </div>

        @if (selectedDayWorkout() && canFinishDay()) {
          <button (click)="finishDay()"
                  class="fixed bottom-6 right-6 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-full shadow-2xl transition-all duration-200 hover:scale-110 flex items-center gap-3 z-50">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-lg">FINALIZAR DÍA</span>
          </button>
        }
      } @else {
        <div class="text-center py-12 glass rounded-lg">
          <svg class="mx-auto h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-4 text-lg text-white/70">No tienes rutina asignada</p>
          <p class="text-sm text-white/50 mt-2">Contacta a tu entrenador para que te asigne una rutina</p>
        </div>
      }

      @if (showSuccessMessage()) {
        <div class="fixed bottom-24 right-6 glass p-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-up z-50">
          <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="text-white font-medium">¡Día completado! Excelente trabajo</span>
        </div>
      }

      @if (exerciseDetail()) {
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             (click)="closeExerciseDetail()">
          <div class="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
               (click)="$event.stopPropagation()">
            <div class="sticky top-0 glass border-b border-white/20 p-6 flex items-center justify-between z-10">
              <h3 class="text-2xl font-bold text-white">Detalles del Ejercicio</h3>
              <button (click)="closeExerciseDetail()"
                      class="p-2 hover:bg-white/20 rounded-lg transition-all duration-200">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-6 space-y-6">
              @if (exerciseDetail()!.exercise.thumbnailUrl) {
                <div class="relative h-64 w-full rounded-xl overflow-hidden">
                  <img [src]="exerciseDetail()!.exercise.thumbnailUrl"
                       [alt]="exerciseDetail()!.exercise.name"
                       class="w-full h-full object-cover">
                </div>
              }

              <div>
                <h4 class="text-3xl font-bold text-white mb-3">{{ exerciseDetail()!.exercise.name }}</h4>
                @if (exerciseDetail()!.exercise.description) {
                  <p class="text-white/70 text-lg">{{ exerciseDetail()!.exercise.description }}</p>
                }
              </div>

              <div class="grid grid-cols-2 gap-4">
                @if (exerciseDetail()!.exerciseInBlock.sets) {
                  <div class="glass rounded-lg p-4">
                    <div class="text-sm text-white/60 mb-2">Series Recomendadas</div>
                    <div class="text-3xl font-bold text-blue-400">{{ exerciseDetail()!.exerciseInBlock.sets }}</div>
                  </div>
                }
                @if (exerciseDetail()!.exerciseInBlock.reps) {
                  <div class="glass rounded-lg p-4">
                    <div class="text-sm text-white/60 mb-2">Repeticiones</div>
                    <div class="text-3xl font-bold text-purple-400">{{ exerciseDetail()!.exerciseInBlock.reps }}</div>
                  </div>
                }
                @if (exerciseDetail()!.exerciseInBlock.weight) {
                  <div class="glass rounded-lg p-4">
                    <div class="text-sm text-white/60 mb-2">Peso Recomendado</div>
                    <div class="text-3xl font-bold text-blue-400">{{ exerciseDetail()!.exerciseInBlock.weight }}</div>
                  </div>
                }
                @if (exerciseDetail()!.exerciseInBlock.rest) {
                  <div class="glass rounded-lg p-4">
                    <div class="text-sm text-white/60 mb-2">Descanso</div>
                    <div class="text-3xl font-bold text-purple-400">{{ exerciseDetail()!.exerciseInBlock.rest }}</div>
                  </div>
                }
              </div>

              @if (exerciseDetail()!.exerciseInBlock.notes) {
                <div class="glass rounded-lg p-4">
                  <div class="text-sm text-white/60 mb-2 font-semibold">Notas del Entrenador</div>
                  <p class="text-white">{{ exerciseDetail()!.exerciseInBlock.notes }}</p>
                </div>
              }

              @if (exerciseDetail()!.exercise.muscleGroups && exerciseDetail()!.exercise.muscleGroups.length > 0) {
                <div class="glass rounded-lg p-4">
                  <div class="text-sm text-white/60 mb-3 font-semibold">Grupos Musculares</div>
                  <div class="flex flex-wrap gap-2">
                    @for (muscle of exerciseDetail()!.exercise.muscleGroups; track muscle) {
                      <span class="px-3 py-1.5 text-white text-sm rounded-full bg-green-500/30 border border-green-500/50">
                        {{ muscle }}
                      </span>
                    }
                  </div>
                </div>
              }

              @if (exerciseDetail()!.exercise.difficulty) {
                <div class="glass rounded-lg p-4">
                  <div class="text-sm text-white/60 mb-2 font-semibold">Dificultad</div>
                  <div class="flex items-center gap-2">
                    <span class="px-3 py-1.5 text-white text-sm rounded-full"
                          [ngClass]="{
                            'bg-green-500/30 border border-green-500/50': exerciseDetail()!.exercise.difficulty === 'beginner',
                            'bg-yellow-500/30 border border-yellow-500/50': exerciseDetail()!.exercise.difficulty === 'intermediate',
                            'bg-red-500/30 border border-red-500/50': exerciseDetail()!.exercise.difficulty === 'advanced'
                          }">
                      {{ exerciseDetail()!.exercise.difficulty === 'beginner' ? 'Principiante' :
                         exerciseDetail()!.exercise.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado' }}
                    </span>
                  </div>
                </div>
              }

              @if (exerciseDetail()!.exercise.equipment && exerciseDetail()!.exercise.equipment.length > 0) {
                <div class="glass rounded-lg p-4">
                  <div class="text-sm text-white/60 mb-3 font-semibold">Equipamiento Necesario</div>
                  <div class="flex flex-wrap gap-2">
                    @for (equipment of exerciseDetail()!.exercise.equipment; track equipment) {
                      <span class="px-3 py-1.5 text-white text-sm rounded-full bg-blue-500/30 border border-blue-500/50">
                        {{ equipment }}
                      </span>
                    }
                  </div>
                </div>
              }

              @if (exerciseDetail()!.exercise.suggestedSets || exerciseDetail()!.exercise.suggestedReps || exerciseDetail()!.exercise.suggestedRest) {
                <div class="glass rounded-lg p-4">
                  <div class="text-sm text-white/60 mb-3 font-semibold">Recomendaciones Generales</div>
                  <div class="space-y-2 text-white/80">
                    @if (exerciseDetail()!.exercise.suggestedSets) {
                      <p><span class="font-semibold">Series sugeridas:</span> {{ exerciseDetail()!.exercise.suggestedSets }}</p>
                    }
                    @if (exerciseDetail()!.exercise.suggestedReps) {
                      <p><span class="font-semibold">Repeticiones sugeridas:</span> {{ exerciseDetail()!.exercise.suggestedReps }}</p>
                    }
                    @if (exerciseDetail()!.exercise.suggestedRest) {
                      <p><span class="font-semibold">Descanso sugerido:</span> {{ exerciseDetail()!.exercise.suggestedRest }}</p>
                    }
                  </div>
                </div>
              }

              @if (exerciseDetail()!.exercise.keyInstructions && (exerciseDetail()!.exercise.keyInstructions?.length ?? 0) > 0) {
                <div class="glass rounded-lg p-4">
                  <div class="text-sm text-white/60 mb-3 font-semibold">Instrucciones Clave</div>
                  <ul class="space-y-2">
                    @for (instruction of exerciseDetail()!.exercise.keyInstructions; track instruction) {
                      <li class="flex items-start gap-2 text-white/80">
                        <svg class="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <span>{{ instruction }}</span>
                      </li>
                    }
                  </ul>
                </div>
              }

              @if (exerciseDetail()!.exercise.videoUrl) {
                <div class="glass rounded-lg p-4">
                  <div class="text-sm text-white/60 mb-3 font-semibold">Video Tutorial</div>
                  <a [href]="exerciseDetail()!.exercise.videoUrl" target="_blank" rel="noopener noreferrer"
                     class="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                    Ver video demostrativo
                  </a>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-up {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    .animate-slide-up {
      animation: slide-up 0.3s ease-out;
    }
  `]
})
export class MyRoutineComponent implements OnInit {
  routine = signal<Routine | null>(null);
  loading = signal(true);
  selectedDay = signal(1);
  selectedBlock = signal<Block | null>(null);
  exerciseDetail = signal<{exercise: Exercise, exerciseInBlock: ExerciseInBlock} | null>(null);
  exerciseProgress: Record<string, ExerciseProgress> = {};
  completedDays: Set<number> = new Set();
  showSuccessMessage = signal(false);
  exercisesMap = signal<Map<string, Exercise>>(new Map());

  currentDayOfWeek = computed(() => {
    const today = new Date().getDay();
    return today === 0 ? 7 : today;
  });

  constructor(private apiService: ApiService) {}

  ngOnInit() {
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

  selectBlock(block: Block) {
    this.selectedBlock.set(block);
  }

  backToBlocks() {
    this.selectedBlock.set(null);
    this.exerciseDetail.set(null);
  }

  openExerciseDetail(exercise: Exercise, exerciseInBlock: ExerciseInBlock) {
    this.exerciseDetail.set({ exercise, exerciseInBlock });
  }

  closeExerciseDetail() {
    this.exerciseDetail.set(null);
  }

  isBlockCompleted(block: Block): boolean {
    return block.exercises.every(ex => this.isExerciseCompleted(ex.exerciseId));
  }

  getBlockProgress(block: Block): string {
    const total = block.exercises.length;
    const completed = block.exercises.filter(ex => this.isExerciseCompleted(ex.exerciseId)).length;
    return `${completed}/${total} completados`;
  }

  loadRoutine() {
    this.apiService.get<Routine[]>('/routines').subscribe({
      next: (routines) => {
        const myRoutine = routines.find(r => r.assignedTo && r.assignedTo.includes('student-1'));
        this.routine.set(myRoutine || null);
        this.loading.set(false);
        this.selectedDay.set(this.currentDayOfWeek());
        this.selectedBlock.set(null);
        this.initializeExerciseProgress();
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

  initializeExerciseProgress() {
    const workout = this.selectedDayWorkout();
    if (!workout) return;

    workout.blocks.forEach(block => {
      block.exercises.forEach(ex => {
        if (!this.exerciseProgress[ex.exerciseId]) {
          this.exerciseProgress[ex.exerciseId] = {
            exerciseId: ex.exerciseId,
            completed: false,
            comment: '',
            showCommentField: false
          };
        }
      });
    });
  }

  getDayName(day: number): string {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[day - 1] || '';
  }

  hasWorkout(day: number): boolean {
    return !!this.routine()?.weeklyPlan.find(d => d.day === day);
  }

  selectedDayWorkout() {
    return this.routine()?.weeklyPlan.find(d => d.day === this.selectedDay());
  }

  isCurrentDay(day: number): boolean {
    return day === this.currentDayOfWeek();
  }

  isDayCompleted(day: number): boolean {
    return this.completedDays.has(day);
  }

  toggleExerciseCompletion(exerciseId: string) {
    if (!this.exerciseProgress[exerciseId]) {
      this.exerciseProgress[exerciseId] = {
        exerciseId,
        completed: false,
        comment: '',
        showCommentField: false
      };
    }
    this.exerciseProgress[exerciseId].completed = !this.exerciseProgress[exerciseId].completed;
  }

  isExerciseCompleted(exerciseId: string): boolean {
    return this.exerciseProgress[exerciseId]?.completed || false;
  }

  toggleCommentField(exerciseId: string) {
    if (!this.exerciseProgress[exerciseId]) {
      this.exerciseProgress[exerciseId] = {
        exerciseId,
        completed: false,
        comment: '',
        showCommentField: false
      };
    }
    this.exerciseProgress[exerciseId].showCommentField = !this.exerciseProgress[exerciseId].showCommentField;
  }

  getExerciseProgress(exerciseId: string): ExerciseProgress | undefined {
    return this.exerciseProgress[exerciseId];
  }

  canFinishDay(): boolean {
    const workout = this.selectedDayWorkout();
    if (!workout) return false;

    const allExercises: string[] = [];
    workout.blocks.forEach(block => {
      block.exercises.forEach(ex => {
        allExercises.push(ex.exerciseId);
      });
    });

    return allExercises.every(id => this.isExerciseCompleted(id));
  }

  finishDay() {
    this.completedDays.add(this.selectedDay());
    this.showSuccessMessage.set(true);
    setTimeout(() => {
      this.showSuccessMessage.set(false);
    }, 3000);

    const nextDay = this.selectedDay() === 7 ? 1 : this.selectedDay() + 1;
    setTimeout(() => {
      this.selectedDay.set(nextDay);
      this.selectedBlock.set(null);
      this.initializeExerciseProgress();
    }, 1500);
  }
}
