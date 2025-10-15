import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { Exercise } from '../../shared/models';

@Component({
  selector: 'app-exercises-library',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Biblioteca de Ejercicios</h1>
        <button (click)="openCreateDialog()"
                class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200">
          Crear Ejercicio
        </button>
      </div>

      <div class="flex space-x-4">
        <input type="text" placeholder="Buscar ejercicios..."
               class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <select class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="">Todas las categorías</option>
          <option value="Pecho">Pecho</option>
          <option value="Espalda">Espalda</option>
          <option value="Piernas">Piernas</option>
          <option value="Hombros">Hombros</option>
          <option value="Brazos">Brazos</option>
          <option value="Core">Core</option>
        </select>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (exercise of exercises(); track exercise.id) {
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
              @if (exercise.thumbnailUrl) {
                <img [src]="exercise.thumbnailUrl" [alt]="exercise.name"
                     class="w-full h-48 object-cover">
              } @else {
                <div class="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <svg class="h-16 w-16 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              }
              <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ exercise.name }}</h3>
                  <span [class]="getDifficultyClass(exercise.difficulty)"
                        class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getDifficultyLabel(exercise.difficulty) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{{ exercise.description }}</p>
                <div class="space-y-2">
                  <div class="flex flex-wrap gap-1">
                    @for (muscle of exercise.muscleGroups; track muscle) {
                      <span class="px-2 py-1 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                        {{ muscle }}
                      </span>
                    }
                  </div>
                  @if (exercise.videoUrls.length > 0) {
                    <div class="flex items-center text-sm text-primary-600 dark:text-primary-400">
                      <svg class="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                      {{ exercise.videoUrls.length }} video(s)
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class ExercisesLibraryComponent implements OnInit {
  exercises = signal<Exercise[]>([]);
  loading = signal(true);

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadExercises();
  }

  loadExercises() {
    this.apiService.get<Exercise[]>('/exercises').subscribe({
      next: (data) => {
        this.exercises.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading exercises:', err);
        this.loading.set(false);
      }
    });
  }

  openCreateDialog() {
    console.log('Open create dialog');
  }

  getDifficultyClass(difficulty: string): string {
    const classes = {
      'beginner': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      'intermediate': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
      'advanced': 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
    };
    return classes[difficulty as keyof typeof classes] || classes.beginner;
  }

  getDifficultyLabel(difficulty: string): string {
    const labels = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  }
}
