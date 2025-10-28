import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RoutineService } from '../../core/routine.service';
import { Exercise } from '../../shared/models/exercise.model';
import { ApiService } from '../../core/api.service';
import { BlockService } from '../../core/block.service';
import { BlockPreset } from '../../shared/models';

interface ExerciseFormData {
  exerciseId: string;
  exerciseName: string;
  sets?: number;
  reps?: string;
  rest?: string;
  weight?: string;
  notes?: string;
  order: number;
}

interface BlockFormData {
  name: string;
  description?: string;
  exercises: ExerciseFormData[];
  order: number;
}

interface DayFormData {
  day: number;
  blocks: BlockFormData[];
}

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Nueva Rutina</h1>
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

      <form [formGroup]="routineForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="glass rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Información General</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Nombre de la Rutina *
              </label>
              <input type="text"
                     formControlName="name"
                     class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                     placeholder="Ej: Rutina de Fuerza Nivel Intermedio">
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
                        placeholder="Describe los objetivos y características de esta rutina"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Tipo de Rutina *
              </label>
              <select formControlName="type"
                      class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all">
                <option value="default" class="bg-gray-800">Rutina por Defecto</option>
                <option value="personalized" class="bg-gray-800">Rutina Personalizada</option>
              </select>
            </div>
          </div>
        </div>

        <div class="glass rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-white">Plan Semanal</h2>
            <button type="button"
                    (click)="addDay()"
                    class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200">
              + Agregar Día
            </button>
          </div>

          <div class="space-y-4">
            @for (dayControl of weeklyPlanArray.controls; track $index) {
              <div class="glass rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-white">
                    Día {{ dayControl.get('day')?.value }}
                  </h3>
                  <button type="button"
                          (click)="removeDay($index)"
                          class="text-red-400 hover:text-red-300 transition-colors">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-white/90 mb-2">
                    Día de la semana *
                  </label>
                  <select [formControl]="getDayControl(dayControl)"
                          class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all">
                    <option [value]="1" [disabled]="isDaySelected(1) && getDayControl(dayControl).value !== 1" class="bg-gray-800">Día 1</option>
                    <option [value]="2" [disabled]="isDaySelected(2) && getDayControl(dayControl).value !== 2" class="bg-gray-800">Día 2</option>
                    <option [value]="3" [disabled]="isDaySelected(3) && getDayControl(dayControl).value !== 3" class="bg-gray-800">Día 3</option>
                    <option [value]="4" [disabled]="isDaySelected(4) && getDayControl(dayControl).value !== 4" class="bg-gray-800">Día 4</option>
                    <option [value]="5" [disabled]="isDaySelected(5) && getDayControl(dayControl).value !== 5" class="bg-gray-800">Día 5</option>
                    <option [value]="6" [disabled]="isDaySelected(6) && getDayControl(dayControl).value !== 6" class="bg-gray-800">Día 6</option>
                    <option [value]="7" [disabled]="isDaySelected(7) && getDayControl(dayControl).value !== 7" class="bg-gray-800">Día 7</option>
                  </select>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h4 class="text-md font-medium text-white/90">Bloques</h4>
                    <div class="flex gap-2">
                      <button type="button"
                              (click)="openBlockSelectionModal($index)"
                              class="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200">
                        + Usar Preestablecido
                      </button>
                      <button type="button"
                              (click)="addBlock($index)"
                              class="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200">
                        + Crear Nuevo
                      </button>
                    </div>
                  </div>

                  @for (blockControl of getBlocksArray($index).controls; track blockIdx; let blockIdx = $index) {
                    <div class="bg-white/5 rounded-lg p-3">
                      <div class="flex items-center justify-between mb-3">
                        <input type="text"
                               [formControl]="getBlockNameControl(blockControl)"
                               placeholder="Nombre del bloque (ej: Calentamiento)"
                               class="flex-1 mr-3 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all">
                        <button type="button"
                                (click)="removeBlock($index, blockIdx)"
                                class="text-red-400 hover:text-red-300 transition-colors">
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <button type="button"
                              (click)="openExerciseModal($index, blockIdx)"
                              class="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-all duration-200">
                        + Agregar Ejercicios
                      </button>

                      @if (getExercisesForBlock($index, blockIdx).length > 0) {
                        <div class="mt-3 space-y-2">
                          @for (exercise of getExercisesForBlock($index, blockIdx); track exIdx; let exIdx = $index) {
                            <div class="flex items-center justify-between bg-white/5 rounded p-2">
                              <div class="flex-1">
                                <span class="text-white text-sm">{{ exercise.exerciseName }}</span>
                                <div class="text-white/70 text-xs mt-1">
                                  @if (exercise.sets) { {{ exercise.sets }} series }
                                  @if (exercise.reps) { × {{ exercise.reps }} }
                                  @if (exercise.rest) { • {{ exercise.rest }} descanso }
                                </div>
                              </div>
                              <div class="flex gap-2">
                                <button type="button"
                                        (click)="editExercise($index, blockIdx, exIdx)"
                                        class="text-blue-400 hover:text-blue-300 transition-colors">
                                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button type="button"
                                        (click)="removeExercise($index, blockIdx, exIdx)"
                                        class="text-red-400 hover:text-red-300 transition-colors">
                                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            }

            @if (weeklyPlanArray.length === 0) {
              <div class="text-center py-8 text-white/50">
                <p>No hay días agregados. Haz clic en "Agregar Día" para comenzar.</p>
              </div>
            }
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <button type="submit"
                  [disabled]="loading() || routineForm.invalid"
                  class="flex-1 px-6 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center">
            @if (loading()) {
              <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            } @else {
              Guardar Rutina
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
            <h3 class="text-xl font-semibold text-white">Seleccionar Ejercicios</h3>
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
                  </div>
                  <span class="px-2 py-1 text-xs rounded bg-white/10 text-white/80">
                    {{ exercise.difficulty }}
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
          <h3 class="text-xl font-semibold text-white mb-4">
            {{ isEditingExercise ? 'Editar Ejercicio' : 'Detalles del Ejercicio' }}
          </h3>
          @if (selectedExercise) {
            <p class="text-white/70 text-sm mb-4">{{ selectedExercise.name }}</p>
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
                       placeholder="60s">
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
                {{ isEditingExercise ? 'Guardar Cambios' : 'Agregar Ejercicio' }}
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

    @if (showBlockSelectionModal()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
           (click)="closeBlockSelectionModal()">
        <div class="glass rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
             (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-white">Seleccionar Bloque Preestablecido</h3>
            <button (click)="closeBlockSelectionModal()"
                    class="text-white/80 hover:text-white transition-colors">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mb-4">
            <input type="text"
                   [(ngModel)]="blockSearchTerm"
                   [ngModelOptions]="{standalone: true}"
                   (input)="filterBlocks()"
                   placeholder="Buscar bloques..."
                   class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all">
          </div>

          <div class="space-y-3 max-h-96 overflow-y-auto">
            @for (block of filteredBlocks(); track block.id) {
              <div class="glass rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-all"
                   (click)="selectPresetBlock(block)">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="text-white font-medium">{{ block.name }}</h4>
                    @if (block.description) {
                      <p class="text-white/70 text-sm mt-1">{{ block.description }}</p>
                    }
                    <div class="flex items-center gap-2 mt-2">
                      <span class="px-2 py-1 text-xs rounded bg-white/10 text-white/80">
                        {{ block.exercises.length }} ejercicio{{ block.exercises.length !== 1 ? 's' : '' }}
                      </span>
                    </div>
                  </div>
                  <svg class="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            } @empty {
              <p class="text-center text-white/50 py-8">No se encontraron bloques preestablecidos</p>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class RoutineFormComponent implements OnInit {
  routineForm!: FormGroup;
  exerciseDetailsForm!: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showExerciseModal = signal(false);
  showExerciseDetailsModal = signal(false);
  showBlockSelectionModal = signal(false);
  availableExercises = signal<Exercise[]>([]);
  filteredExercises = signal<Exercise[]>([]);
  availableBlocks = signal<BlockPreset[]>([]);
  filteredBlocks = signal<BlockPreset[]>([]);
  exerciseSearchTerm = '';
  blockSearchTerm = '';
  currentDayIndex = 0;
  currentBlockIndex = 0;
  selectedExercise: Exercise | null = null;
  editingExerciseIndex: number = -1;
  isEditingExercise = false;

  constructor(
    private fb: FormBuilder,
    private routineService: RoutineService,
    private apiService: ApiService,
    private blockService: BlockService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForms();
    this.loadBlocks();
    this.loadExercises();
  }

  private initForms(): void {
    this.routineForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      type: ['default', [Validators.required]],
      weeklyPlan: this.fb.array([])
    });

    this.exerciseDetailsForm = this.fb.group({
      sets: [null],
      reps: [''],
      rest: [''],
      weight: [''],
      notes: ['']
    });
  }

  get weeklyPlanArray(): FormArray {
    return this.routineForm.get('weeklyPlan') as FormArray;
  }

  getBlocksArray(dayIndex: number): FormArray {
    return this.weeklyPlanArray.at(dayIndex).get('blocks') as FormArray;
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

  private loadBlocks(): void {
    this.blockService.getBlocks().subscribe({
      next: (blocks) => {
        this.availableBlocks.set(blocks);
        this.filteredBlocks.set(blocks);
      },
      error: (error) => {
        console.error('Error loading blocks:', error);
      }
    });
  }

  openBlockSelectionModal(dayIndex: number): void {
    this.currentDayIndex = dayIndex;
    this.showBlockSelectionModal.set(true);
  }

  closeBlockSelectionModal(): void {
    this.showBlockSelectionModal.set(false);
    this.blockSearchTerm = '';
    this.filteredBlocks.set(this.availableBlocks());
  }

  filterBlocks(): void {
    const term = this.blockSearchTerm.toLowerCase();
    const filtered = this.availableBlocks().filter(block =>
      block.name.toLowerCase().includes(term) ||
      (block.description && block.description.toLowerCase().includes(term))
    );
    this.filteredBlocks.set(filtered);
  }

  selectPresetBlock(block: BlockPreset): void {
    const exercises = this.availableExercises();
    const exercisesWithNames = block.exercises.map(ex => {
      const exercise = exercises.find(e => e.id === ex.exerciseId);
      return {
        exerciseId: ex.exerciseId,
        exerciseName: exercise?.name || 'Ejercicio desconocido',
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        weight: ex.weight,
        notes: ex.notes,
        order: ex.order
      };
    });

    const blockForm = this.fb.group({
      name: [block.name, [Validators.required]],
      description: [block.description || ''],
      order: [this.getBlocksArray(this.currentDayIndex).length],
      exercises: this.fb.array(exercisesWithNames.map(ex => this.fb.control(ex)))
    });

    this.getBlocksArray(this.currentDayIndex).push(blockForm);
    this.closeBlockSelectionModal();
  }

  addDay(): void {
    const nextDayNumber = this.getNextAvailableDayNumber();
    const dayForm = this.fb.group({
      day: [nextDayNumber, [Validators.required]],
      blocks: this.fb.array([])
    });
    this.weeklyPlanArray.push(dayForm);
  }

  private getNextAvailableDayNumber(): number {
    if (this.weeklyPlanArray.length === 0) {
      return 1;
    }

    const existingDays = this.weeklyPlanArray.controls.map(control =>
      control.get('day')?.value || 0
    );
    const maxDay = Math.max(...existingDays);
    return maxDay + 1;
  }

  isDaySelected(dayNumber: number): boolean {
    return this.weeklyPlanArray.controls.some(control =>
      control.get('day')?.value === dayNumber
    );
  }

  removeDay(dayIndex: number): void {
    this.weeklyPlanArray.removeAt(dayIndex);
  }

  addBlock(dayIndex: number): void {
    const blockForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      order: [this.getBlocksArray(dayIndex).length],
      exercises: this.fb.array([])
    });
    this.getBlocksArray(dayIndex).push(blockForm);
  }

  removeBlock(dayIndex: number, blockIndex: number): void {
    this.getBlocksArray(dayIndex).removeAt(blockIndex);
  }

  openExerciseModal(dayIndex: number, blockIndex: number): void {
    this.currentDayIndex = dayIndex;
    this.currentBlockIndex = blockIndex;
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
      ex.category.toLowerCase().includes(term)
    );
    this.filteredExercises.set(filtered);
  }

  selectExercise(exercise: Exercise): void {
    const blockForm = this.getBlocksArray(this.currentDayIndex).at(this.currentBlockIndex);
    const exercisesArray = blockForm.get('exercises') as FormArray;

    const exerciseData = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: exercise.suggestedSets ? parseInt(exercise.suggestedSets) : undefined,
      reps: exercise.suggestedReps || undefined,
      rest: exercise.suggestedRest || undefined,
      weight: undefined,
      notes: undefined,
      order: exercisesArray.length
    };

    exercisesArray.push(this.fb.control(exerciseData));
    this.closeExerciseModal();
  }

  closeExerciseDetailsModal(): void {
    this.showExerciseDetailsModal.set(false);
    this.selectedExercise = null;
    this.isEditingExercise = false;
    this.editingExerciseIndex = -1;
  }

  confirmExerciseDetails(): void {
    if (!this.selectedExercise) return;

    const blockForm = this.getBlocksArray(this.currentDayIndex).at(this.currentBlockIndex);
    const exercisesArray = blockForm.get('exercises') as FormArray;

    if (this.isEditingExercise && this.editingExerciseIndex >= 0) {
      const currentExercise = exercisesArray.at(this.editingExerciseIndex).value;
      const updatedExerciseData = {
        exerciseId: currentExercise.exerciseId,
        exerciseName: currentExercise.exerciseName,
        ...this.exerciseDetailsForm.value,
        order: currentExercise.order
      };
      exercisesArray.at(this.editingExerciseIndex).setValue(updatedExerciseData);
    } else {
      const exerciseData = {
        exerciseId: this.selectedExercise.id,
        exerciseName: this.selectedExercise.name,
        ...this.exerciseDetailsForm.value,
        order: exercisesArray.length
      };
      exercisesArray.push(this.fb.control(exerciseData));
    }

    this.closeExerciseDetailsModal();
  }

  getExercisesForBlock(dayIndex: number, blockIndex: number): ExerciseFormData[] {
    const blockForm = this.getBlocksArray(dayIndex).at(blockIndex);
    const exercisesArray = blockForm.get('exercises') as FormArray;
    return exercisesArray.value || [];
  }

  getDayName(day: number): string {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return days[day - 1] || 'Día';
  }

  getDayControl(control: any): FormControl {
    return control.get('day') as FormControl;
  }

  getBlockNameControl(control: any): FormControl {
    return control.get('name') as FormControl;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.routineForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.routineForm.invalid) {
      Object.keys(this.routineForm.controls).forEach(key => {
        this.routineForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);

    const formValue = this.routineForm.value;
    const weeklyPlan = formValue.weeklyPlan.map((day: any) => ({
      day: day.day,
      blocks: day.blocks.map((block: any) => ({
        name: block.name,
        description: block.description,
        order: block.order,
        exercises: (block.exercises || []).map((ex: ExerciseFormData) => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest,
          weight: ex.weight,
          notes: ex.notes,
          order: ex.order
        }))
      }))
    }));

    const payload = {
      name: formValue.name,
      description: formValue.description,
      type: formValue.type,
      createdBy: 'current-user-id',
      gymId: 'current-gym-id',
      weeklyPlan
    };

    this.routineService.createRoutine(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/routines']);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Error al crear la rutina');
        this.loading.set(false);
      }
    });
  }

  editExercise(dayIndex: number, blockIndex: number, exerciseIndex: number): void {
    this.currentDayIndex = dayIndex;
    this.currentBlockIndex = blockIndex;
    this.editingExerciseIndex = exerciseIndex;
    this.isEditingExercise = true;

    const blockForm = this.getBlocksArray(dayIndex).at(blockIndex);
    const exercisesArray = blockForm.get('exercises') as FormArray;
    const exerciseData = exercisesArray.at(exerciseIndex).value;

    const exercise = this.availableExercises().find(ex => ex.id === exerciseData.exerciseId);
    this.selectedExercise = exercise || null;

    this.exerciseDetailsForm.patchValue({
      sets: exerciseData.sets || null,
      reps: exerciseData.reps || '',
      rest: exerciseData.rest || '',
      weight: exerciseData.weight || '',
      notes: exerciseData.notes || ''
    });

    this.showExerciseDetailsModal.set(true);
  }

  removeExercise(dayIndex: number, blockIndex: number, exerciseIndex: number): void {
    const blockForm = this.getBlocksArray(dayIndex).at(blockIndex);
    const exercisesArray = blockForm.get('exercises') as FormArray;
    exercisesArray.removeAt(exerciseIndex);
  }

  goBack(): void {
    this.router.navigate(['/routines']);
  }
}
