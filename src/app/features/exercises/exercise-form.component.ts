import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Exercise } from '../../shared/models';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-white">
          {{ exerciseId() ? 'Editar Ejercicio' : 'Crear Ejercicio' }}
        </h1>
        <button (click)="goBack()"
                class="px-4 py-2 text-white font-semibold rounded-lg transition-all duration-200 glass hover:bg-white/20">
          <i class="pi pi-arrow-left mr-2"></i>
          Volver
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      } @else {
        <div class="glass rounded-lg p-6">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-white mb-2">
                  Nombre del Ejercicio <span class="text-red-400">*</span>
                </label>
                <input type="text" formControlName="name"
                       class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass"
                       placeholder="Ej: Press de banca">
                @if (form.get('name')?.invalid && form.get('name')?.touched) {
                  <p class="mt-1 text-sm text-red-400">El nombre es obligatorio</p>
                }
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-white mb-2">
                  Descripción <span class="text-red-400">*</span>
                </label>
                <textarea formControlName="description" rows="4"
                          class="w-full px-4 py-2 border  rounded-lg text-white glass "
                          placeholder="Describe la ejecución correcta del ejercicio..."></textarea>
                @if (form.get('description')?.invalid && form.get('description')?.touched) {
                  <p class="mt-1 text-sm text-red-400">La descripción es obligatoria</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">
                  Categoría Principal <span class="text-red-400">*</span>
                </label>
                <select formControlName="category"
                        class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass">
                  <option value="">Seleccionar...</option>
                  <option value="Pecho">Pecho</option>
                  <option value="Espalda">Espalda</option>
                  <option value="Piernas">Piernas</option>
                  <option value="Hombros">Hombros</option>
                  <option value="Brazos">Brazos</option>
                  <option value="Core">Core</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Funcional">Funcional</option>
                </select>
                @if (form.get('category')?.invalid && form.get('category')?.touched) {
                  <p class="mt-1 text-sm text-red-400">La categoría es obligatoria</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">
                  Nivel de Dificultad
                </label>
                <select formControlName="difficulty"
                        class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass">
                  <option value="">Seleccionar...</option>
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">
                  URL del Video Principal <span class="text-red-400">*</span>
                </label>
                <input type="url" formControlName="videoUrl"
                       class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass "
                       placeholder="https://youtube.com/...">
                @if (form.get('videoUrl')?.invalid && form.get('videoUrl')?.touched) {
                  <p class="mt-1 text-sm text-red-400">La URL del video es obligatoria</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">
                  URL de la Imagen/Thumbnail
                </label>
                <input type="url" formControlName="thumbnailUrl"
                       class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass "
                       placeholder="https://...">
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">
                  Tipo de Ejercicio <span class="text-red-400">*</span>
                </label>
                <select formControlName="exerciseType"
                        class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass">
                  <option value="">Seleccionar...</option>
                  <option value="strength">Fuerza</option>
                  <option value="hypertrophy">Hipertrofia</option>
                  <option value="endurance">Resistencia</option>
                  <option value="cardio">Cardio</option>
                  <option value="mobility">Movilidad</option>
                  <option value="functional">Funcional</option>
                </select>
                @if (form.get('exerciseType')?.invalid && form.get('exerciseType')?.touched) {
                  <p class="mt-1 text-sm text-red-400">El tipo de ejercicio es obligatorio</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">
                  Equipamiento (separado por comas)
                </label>
                <input type="text" formControlName="equipmentInput"
                       class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass "
                       placeholder="Barra, Mancuernas, Banco">
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">
                  Músculos Trabajados (separado por comas)
                </label>
                <input type="text" formControlName="muscleGroupsInput"
                       class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass "
                       placeholder="Pectoral mayor, Tríceps, Deltoides anterior">
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">
                  Series Recomendadas
                </label>
                <input type="text" formControlName="suggestedSets"
                       class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass "
                       placeholder="3-4">
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">
                  Repeticiones Recomendadas
                </label>
                <input type="text" formControlName="suggestedReps"
                       class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass "
                       placeholder="8-12">
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">
                  Descanso Sugerido
                </label>
                <input type="text" formControlName="suggestedRest"
                       class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass "
                       placeholder="60-90 seg">
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">
                  Tempo/Cadencia
                </label>
                <input type="text" formControlName="tempo"
                       class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass "
                       placeholder="3-1-1-0">
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-white mb-2">
                  Videos Adicionales
                </label>
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <input type="url"
                           [(ngModel)]="newVideoUrl"
                           [ngModelOptions]="{standalone: true}"
                           (keydown.enter)="addVideoUrl($event)"
                           class="flex-1 px-4 py-2 border border-white/30 rounded-lg text-white glass "
                           placeholder="https://youtube.com/video...">
                    <button type="button"
                            (click)="addVideoUrl()"
                            class="px-4 py-2 text-white font-semibold rounded-lg transition-all duration-200 glass hover:bg-white/20">
                      Agregar
                    </button>
                  </div>
                  @if (videoUrls().length > 0) {
                    <div class="flex flex-wrap gap-2">
                      @for (url of videoUrls(); track $index) {
                        <div class="flex items-center gap-2 px-3 py-2 glass rounded-lg border border-white/20">
                          <span class="text-white text-sm truncate max-w-xs">{{ url }}</span>
                          <button type="button"
                                  (click)="removeVideoUrl($index)"
                                  class="text-red-400 hover:text-red-300 transition-colors">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-4 pt-4 border-t border-white/20">
              <button type="button" (click)="goBack()"
                      class="px-6 py-2 text-white font-semibold rounded-lg transition-all duration-200 glass hover:bg-white/20">
                Cancelar
              </button>
              <button type="submit" [disabled]="form.invalid || submitting()"
                      class="px-6 py-2 text-white font-semibold rounded-lg transition-all duration-200 glass hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ submitting() ? 'Guardando...' : (exerciseId() ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ExerciseFormComponent implements OnInit {
  form!: FormGroup;
  submitting = signal(false);
  loading = signal(false);
  exerciseId = signal<string | null>(null);
  videoUrls = signal<string[]>([]);
  newVideoUrl = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.exerciseId.set(id);
      this.loadExercise(id);
    }
  }

  private initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      difficulty: [''],
      videoUrl: ['', Validators.required],
      thumbnailUrl: [''],
      exerciseType: ['', Validators.required],
      equipmentInput: [''],
      muscleGroupsInput: [''],
      suggestedSets: [''],
      suggestedReps: [''],
      suggestedRest: [''],
      tempo: ['']
    });
  }

  private loadExercise(id: string) {
    this.loading.set(true);
    this.apiService.get<Exercise>(`/exercises/${id}`).subscribe({
      next: (exercise) => {
        this.patchForm(exercise);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading exercise:', err);
        this.loading.set(false);
        this.goBack();
      }
    });
  }

  private patchForm(exercise: Exercise) {
    this.form.patchValue({
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      difficulty: exercise.difficulty,
      videoUrl: exercise.videoUrl,
      thumbnailUrl: exercise.thumbnailUrl || '',
      exerciseType: exercise.exerciseType || '',
      equipmentInput: exercise.equipment?.join(', ') || '',
      muscleGroupsInput: exercise.muscleGroups?.join(', ') || '',
      suggestedSets: exercise.suggestedSets || '',
      suggestedReps: exercise.suggestedReps || '',
      suggestedRest: exercise.suggestedRest || '',
      tempo: exercise.tempo || ''
    });
    if (exercise.videoUrls && exercise.videoUrls.length > 0) {
      this.videoUrls.set([...exercise.videoUrls]);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting.set(true);
    const formValue = this.form.value;

    const exerciseData: Partial<Exercise> = {
      name: formValue.name,
      description: formValue.description,
      category: formValue.category,
      difficulty: formValue.difficulty,
      videoUrl: formValue.videoUrl,
      thumbnailUrl: formValue.thumbnailUrl || undefined,
      exerciseType: formValue.exerciseType || undefined,
      equipment: this.parseCommaSeparated(formValue.equipmentInput),
      muscleGroups: this.parseCommaSeparated(formValue.muscleGroupsInput),
      suggestedSets: formValue.suggestedSets || undefined,
      suggestedReps: formValue.suggestedReps || undefined,
      suggestedRest: formValue.suggestedRest || undefined,
      tempo: formValue.tempo || undefined,
      videoUrls: this.videoUrls()
    };

    const id = this.exerciseId();
    const endpoint = id ? `/exercises/${id}` : '/exercises';
    const method = id ? 'put' : 'post';

    this.apiService[method]<Exercise>(endpoint, exerciseData).subscribe({
      next: () => {
        this.submitting.set(false);
        this.goBack();
      },
      error: (err) => {
        console.error('Error saving exercise:', err);
        this.submitting.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/exercises']);
  }

  private parseCommaSeparated(value: string): string[] {
    return value ? value.split(',').map(v => v.trim()).filter(v => v) : [];
  }

  addVideoUrl(event?: Event | KeyboardEvent): void {
    if (event) {
      event.preventDefault();
    }

    const url = this.newVideoUrl.trim();
    if (url && this.isValidUrl(url)) {
      const currentUrls = this.videoUrls();
      if (!currentUrls.includes(url)) {
        this.videoUrls.set([...currentUrls, url]);
        this.newVideoUrl = '';
      }
    }
  }

  removeVideoUrl(index: number): void {
    const currentUrls = this.videoUrls();
    this.videoUrls.set(currentUrls.filter((_, i) => i !== index));
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
