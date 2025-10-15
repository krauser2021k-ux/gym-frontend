import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { Routine, Exercise } from '../../shared/models';

@Component({
  selector: 'app-my-routine',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Mi Rutina Semanal</h1>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else if (routine()) {
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{{ routine()?.name }}</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6">{{ routine()?.description }}</p>

          <div class="grid grid-cols-7 gap-2 mb-6">
            @for (day of [1,2,3,4,5,6,7]; track day) {
              <button (click)="selectedDay.set(day)"
                      [class.bg-primary-600]="selectedDay() === day"
                      [class.text-white]="selectedDay() === day"
                      [class.bg-gray-100]="selectedDay() !== day && hasWorkout(day)"
                      [class.dark:bg-gray-700]="selectedDay() !== day && hasWorkout(day)"
                      [class.bg-gray-50]="selectedDay() !== day && !hasWorkout(day)"
                      [class.dark:bg-gray-800]="selectedDay() !== day && !hasWorkout(day)"
                      class="py-3 rounded-lg font-medium transition-colors">
                {{ getDayName(day) }}
              </button>
            }
          </div>

          @if (selectedDayWorkout()) {
            <div class="space-y-4">
              @for (block of selectedDayWorkout()!.blocks; track block.id) {
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">{{ block.name }}</h3>
                  @if (block.description) {
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">{{ block.description }}</p>
                  }
                  <div class="space-y-3">
                    @for (ex of block.exercises; track ex.exerciseId) {
                      <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <div class="flex justify-between items-start mb-2">
                          <h4 class="font-medium text-gray-900 dark:text-white">Ejercicio {{ ex.order }}</h4>
                          <label class="flex items-center cursor-pointer">
                            <input type="checkbox" class="w-5 h-5 text-primary-600 rounded">
                            <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">Completado</span>
                          </label>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          @if (ex.sets) {
                            <div>
                              <span class="text-gray-500 dark:text-gray-400">Series:</span>
                              <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ ex.sets }}</span>
                            </div>
                          }
                          @if (ex.reps) {
                            <div>
                              <span class="text-gray-500 dark:text-gray-400">Reps:</span>
                              <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ ex.reps }}</span>
                            </div>
                          }
                          @if (ex.weight) {
                            <div>
                              <span class="text-gray-500 dark:text-gray-400">Peso:</span>
                              <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ ex.weight }}</span>
                            </div>
                          }
                          @if (ex.rest) {
                            <div>
                              <span class="text-gray-500 dark:text-gray-400">Descanso:</span>
                              <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ ex.rest }}</span>
                            </div>
                          }
                        </div>
                        @if (ex.notes) {
                          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">{{ ex.notes }}</p>
                        }
                        <div class="mt-3">
                          <button class="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                            Agregar comentario
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p class="mt-4 text-gray-600 dark:text-gray-300">Día de descanso</p>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">No tienes rutina asignada</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Contacta a tu entrenador para que te asigne una rutina</p>
        </div>
      }
    </div>
  `,
  styles: []
})
export class MyRoutineComponent implements OnInit {
  routine = signal<Routine | null>(null);
  loading = signal(true);
  selectedDay = signal(1);

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.get<Routine[]>('/routines').subscribe({
      next: (routines) => {
        const myRoutine = routines.find(r => r.assignedTo && r.assignedTo.includes('student-1'));
        this.routine.set(myRoutine || null);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading routine:', err);
        this.loading.set(false);
      }
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
}
