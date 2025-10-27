import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlockService } from '../../core/block.service';
import { ApiService } from '../../core/api.service';
import { Exercise, ExerciseInBlock } from '../../shared/models';

interface ExerciseFormData extends ExerciseInBlock {
  exerciseName: string;
}

@Component({
  selector: 'app-block-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">
          {{ isEditMode() ? 'Editar Bloque' : 'Nuevo Bloque Preestablecido' }}
        </h1>
        <button (click)="goBack()"
                class="px-4 py-2 text-white/80 hover:text-white transition-colors">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      @if (errorMessage()) {
        <div class="glass rounded-lg p-4 border-l-4 border-red-400">
          <p class="text-red-400">{{ errorMessage() }}</p>
        </div>
      }

      <form [formGroup]="blockForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="glass rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Información del Bloque</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Nombre del Bloque *
              </label>
              <input type="text"
                     formControlName="name"
                     class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                     placeholder="Ej: Calentamiento General, Fuerza Tren Superior">
              @if (isFieldInvalid('name')) {
                <p class="mt-1 text-sm text-red-400">El nombre es requerido</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Descripción
              </label>
              <textarea formControlName="description"
                        rows="3"
                        class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all resize-none"
                        placeholder="Describe el propósito y características de este bloque"></textarea>
            </div>
          </div>
        </div>

        <div class="glass rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-white">Ejercicios</h2>
            <button type="button"
                    (click)="openExerciseModal()"
                    class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200">
              + Agregar Ejercicio
            </button>
          </div>

          @if (exercisesList().length > 0) {
            <div class="space-y-3">
              @for (exercise of exercisesList(); track exercise.exerciseId; let idx = $index) {
                <div class="glass rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                              style="background: rgba(255, 255, 255, 0.2);">
                          {{ idx + 1 }}
                        </span>
                        <h3 class="text-white font-medium">{{ exercise.exerciseName }}</h3>
                      </div>
                      <div class="flex flex-wrap gap-3 text-sm text-white/70">
                        @if (exercise.sets) {
                          <span>{{ exercise.sets }} series</span>
                        }
                        @if (exercise.reps) {
                          <span>× {{ exercise.reps }}</span>
                        }
                        @if (exercise.rest) {
                          <span>Descanso: {{ exercise.rest }}</span>
                        }
                        @if (exercise.weight) {
                          <span>Peso: {{ exercise.weight }}</span>
                        }
                      </div>
                      @if (exercise.notes) {
                        <p class="text-xs text-white/60 mt-2">{{ exercise.notes }}</p>
                      }
                    </div>
                    <button type="button"
                            (click)="removeExercise(idx)"
                            class="text-red-400 hover:text-red-300 transition-colors ml-2">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="text-center py-8 text-white/50">
              <p>No hay ejercicios agregados. Haz clic en "Agregar Ejercicio" para comenzar.</p>
            </div>
          }

          @if (exercisesList().length === 0 && blockForm.touched) {
            <p class="mt-2 text-sm text-red-400">Debes agregar al menos un ejercicio</p>
          }
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <button type="submit"
                  [disabled]="loading() || blockForm.invalid || exercisesList().length === 0"
                  class="flex-1 px-6 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center">
            @if (loading()) {
              <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            } @else {
              {{ isEditMode() ? 'Actualizar Bloque' : 'Guardar Bloque' }}
            }
          </button>

          <button type="button"
                  (click)="goBack()"
                  [disabled]="loading()"
                  class="flex-1 px-6 py-3 glass hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    @if (showExerciseModal()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
           (click)="closeExerciseModal()">
        <div class="glass rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
             (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-white">Seleccionar Ejercicio</h3>
            <button (click)="closeExerciseModal()"
                    class="text-white/80 hover:text-white transition-colors">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mb-4">
            <input type="text"
                   [(ngModel)]="exerciseSearchTerm"
                   [ngModelOptions]="{standalone: true}"
                   (input)="filterExercises()"
                   placeholder="Buscar ejercicios..."
                   class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all">
          </div>

          <div class="space-y-2 max-h-96 overflow-y-auto">
            @for (exercise of filteredExercises(); track exercise.id) {
              <div class="glass rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-all"
                   (click)="selectExercise(exercise)">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="text-white font-medium">{{ exercise.name }}</h4>
                    <p class="text-white/70 text-sm mt-1">{{ exercise.category }}</p>
                    @if (exercise.muscleGroups && exercise.muscleGroups.length > 0) {
                      <p class="text-white/60 text-xs mt-1">{{ exercise.muscleGroups.join(', ') }}</p>
                    }
                  </div>
                  <span class="px-2 py-1 text-xs rounded bg-white/10 text-white/80">
                    {{ getDifficultyLabel(exercise.difficulty) }}
                  </span>
                </div>
              </div>
            } @empty {
              <p class="text-center text-white/50 py-8">No se encontraron ejercicios</p>
            }
          </div>
        </div>
      </div>
    }

    @if (showExerciseDetailsModal()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
           (click)="closeExerciseDetailsModal()">
        <div class="glass rounded-lg p-6 max-w-2xl w-full"
             (click)="$event.stopPropagation()">
          <h3 class="text-xl font-semibold text-white mb-4">Configurar Ejercicio</h3>

          @if (selectedExercise()) {
            <div class="mb-4 p-3 glass rounded-lg">
              <h4 class="text-white font-medium">{{ selectedExercise()!.name }}</h4>
              <p class="text-white/70 text-sm">{{ selectedExercise()!.category }}</p>
            </div>
          }

          <form [formGroup]="exerciseDetailsForm" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-white/90 mb-2">Series</label>
                <input type="number"
                       formControlName="sets"
                       min="1"
                       class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                       placeholder="3">
              </div>

              <div>
                <label class="block text-sm font-medium text-white/90 mb-2">Repeticiones</label>
                <input type="text"
                       formControlName="reps"
                       class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                       placeholder="10-12">
              </div>

              <div>
                <label class="block text-sm font-medium text-white/90 mb-2">Descanso</label>
                <input type="text"
                       formControlName="rest"
                       class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                       placeholder="60 seg">
              </div>

              <div>
                <label class="block text-sm font-medium text-white/90 mb-2">Peso</label>
                <input type="text"
                       formControlName="weight"
                       class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                       placeholder="20kg">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">Notas</label>
              <textarea formControlName="notes"
                        rows="2"
                        class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all resize-none"
                        placeholder="Observaciones adicionales"></textarea>
            </div>

            <div class="flex gap-4">
              <button type="button"
                      (click)="confirmExerciseDetails()"
                      class="flex-1 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-200">
                Agregar Ejercicio
              </button>
              <button type="button"
                      (click)="closeExerciseDetailsModal()"
                      class="flex-1 px-6 py-3 glass hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-200">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: []
})
export class BlockFormComponent implements OnInit {
  blockForm!: FormGroup;
  exerciseDetailsForm!: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showExerciseModal = signal(false);
  showExerciseDetailsModal = signal(false);
  availableExercises = signal<Exercise[]>([]);
  filteredExercises = signal<Exercise[]>([]);
  exerciseSearchTerm = '';
  selectedExercise = signal<Exercise | null>(null);
  exercisesList = signal<ExerciseFormData[]>([]);
  isEditMode = signal(false);
  blockId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private blockService: BlockService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForms();
    this.loadExercises();

    this.blockId = this.route.snapshot.paramMap.get('id');
    if (this.blockId) {
      this.isEditMode.set(true);
      this.loadBlock(this.blockId);
    }
  }

  private initForms(): void {
    this.blockForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });

    this.exerciseDetailsForm = this.fb.group({
      sets: [null],
      reps: [''],
      rest: [''],
      weight: [''],
      notes: ['']
    });
  }

  private loadExercises(): void {
    this.apiService.get<Exercise[]>('/exercises').subscribe({
      next: (exercises) => {
        this.availableExercises.set(exercises);
        this.filteredExercises.set(exercises);
      },
      error: (error) => {
        console.error('Error loading exercises:', error);
      }
    });
  }

  private loadBlock(id: string): void {
    this.loading.set(true);
    this.blockService.getBlockById(id).subscribe({
      next: (block) => {
        this.blockForm.patchValue({
          name: block.name,
          description: block.description
        });

        const exercises = this.availableExercises();
        const exercisesWithNames = block.exercises.map(ex => {
          const exercise = exercises.find(e => e.id === ex.exerciseId);
          return {
            ...ex,
            exerciseName: exercise?.name || 'Ejercicio desconocido'
          };
        });
        this.exercisesList.set(exercisesWithNames);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar el bloque');
        this.loading.set(false);
        console.error('Error loading block:', error);
      }
    });
  }

  openExerciseModal(): void {
    this.showExerciseModal.set(true);
  }

  closeExerciseModal(): void {
    this.showExerciseModal.set(false);
    this.exerciseSearchTerm = '';
    this.filteredExercises.set(this.availableExercises());
  }

  filterExercises(): void {
    const term = this.exerciseSearchTerm.toLowerCase();
    const filtered = this.availableExercises().filter(ex =>
      ex.name.toLowerCase().includes(term) ||
      ex.category.toLowerCase().includes(term) ||
      ex.muscleGroups?.some(mg => mg.toLowerCase().includes(term))
    );
    this.filteredExercises.set(filtered);
  }

  selectExercise(exercise: Exercise): void {
    this.selectedExercise.set(exercise);
    this.exerciseDetailsForm.reset();
    this.showExerciseModal.set(false);
    this.showExerciseDetailsModal.set(true);
  }

  closeExerciseDetailsModal(): void {
    this.showExerciseDetailsModal.set(false);
    this.selectedExercise.set(null);
  }

  confirmExerciseDetails(): void {
    const exercise = this.selectedExercise();
    if (!exercise) return;

    const currentList = this.exercisesList();
    const exerciseData: ExerciseFormData = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      ...this.exerciseDetailsForm.value,
      order: currentList.length + 1
    };

    this.exercisesList.set([...currentList, exerciseData]);
    this.closeExerciseDetailsModal();
  }

  removeExercise(index: number): void {
    const currentList = this.exercisesList();
    const updatedList = currentList.filter((_, i) => i !== index)
      .map((ex, i) => ({ ...ex, order: i + 1 }));
    this.exercisesList.set(updatedList);
  }

  getDifficultyLabel(difficulty: string): string {
    const labels: Record<string, string> = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado'
    };
    return labels[difficulty] || difficulty;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.blockForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.blockForm.invalid || this.exercisesList().length === 0) {
      this.blockForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const exercises = this.exercisesList().map(ex => ({
      exerciseId: ex.exerciseId,
      sets: ex.sets,
      reps: ex.reps,
      rest: ex.rest,
      weight: ex.weight,
      notes: ex.notes,
      order: ex.order
    }));

    const payload = {
      name: this.blockForm.value.name,
      description: this.blockForm.value.description,
      type: 'preset' as const,
      exercises,
      createdBy: 'current-trainer-id'
    };

    const request = this.isEditMode() && this.blockId
      ? this.blockService.updateBlock(this.blockId, payload)
      : this.blockService.createBlock(payload);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/blocks']);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Error al guardar el bloque');
        this.loading.set(false);
        console.error('Error saving block:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/blocks']);
  }
}
