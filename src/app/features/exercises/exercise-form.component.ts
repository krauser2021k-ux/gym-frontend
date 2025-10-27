import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Exercise } from '../../shared/models';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" (click)="onBackdropClick($event)">
      <div class="glass rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <div class="sticky top-0 glass border-b border-white/20 px-6 py-4 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-white">
            {{ exercise() ? 'Editar Ejercicio' : 'Crear Ejercicio' }}
          </h2>
          <button (click)="onCancel()" class="text-white hover:text-white/70 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-white mb-2">
                Nombre del Ejercicio <span class="text-red-400">*</span>
              </label>
              <input type="text" formControlName="name"
                     class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass placeholder-white/70"
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
                        class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass placeholder-white/70"
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
                Nivel de Dificultad <span class="text-red-400">*</span>
              </label>
              <select formControlName="difficulty"
                      class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass">
                <option value="">Seleccionar...</option>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
              @if (form.get('difficulty')?.invalid && form.get('difficulty')?.touched) {
                <p class="mt-1 text-sm text-red-400">El nivel de dificultad es obligatorio</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                URL del Video Principal <span class="text-red-400">*</span>
              </label>
              <input type="url" formControlName="videoUrl"
                     class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass placeholder-white/70"
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
                     class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass placeholder-white/70"
                     placeholder="https://...">
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Tipo de Ejercicio
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
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Equipamiento (separado por comas)
              </label>
              <input type="text" formControlName="equipmentInput"
                     class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass placeholder-white/70"
                     placeholder="Barra, Mancuernas, Banco">
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Músculos Trabajados (separado por comas)
              </label>
              <input type="text" formControlName="muscleGroupsInput"
                     class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass placeholder-white/70"
                     placeholder="Pectoral mayor, Tríceps, Deltoides anterior">
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Series Recomendadas
              </label>
              <input type="text" formControlName="suggestedSets"
                     class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass placeholder-white/70"
                     placeholder="3-4">
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Repeticiones Recomendadas
              </label>
              <input type="text" formControlName="suggestedReps"
                     class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass placeholder-white/70"
                     placeholder="8-12">
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Descanso Sugerido
              </label>
              <input type="text" formControlName="suggestedRest"
                     class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass placeholder-white/70"
                     placeholder="60-90 seg">
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Tempo/Cadencia
              </label>
              <input type="text" formControlName="tempo"
                     class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass placeholder-white/70"
                     placeholder="3-1-1-0">
            </div>


            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-white mb-2">
                Videos Adicionales (una URL por línea)
              </label>
              <textarea formControlName="videoUrlsInput" rows="3"
                        class="w-full px-4 py-2 border border-white/30 rounded-lg text-white glass placeholder-white/70"
                        placeholder="https://youtube.com/video1&#10;https://youtube.com/video2"></textarea>
            </div>

          </div>

          <div class="flex justify-end gap-4 pt-4 border-t border-white/20">
            <button type="button" (click)="onCancel()"
                    class="px-6 py-2 text-white font-semibold rounded-lg transition-all duration-200 glass hover:bg-white/20">
              Cancelar
            </button>
            <button type="submit" [disabled]="form.invalid || submitting()"
                    class="px-6 py-2 text-white font-semibold rounded-lg transition-all duration-200 glass hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ submitting() ? 'Guardando...' : (exercise() ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class ExerciseFormComponent implements OnInit {
  @Input() exercise = signal<Exercise | null>(null);
  @Output() saved = new EventEmitter<Exercise>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  submitting = signal(false);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    if (this.exercise()) {
      this.patchForm(this.exercise()!);
    }
  }

  private initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      difficulty: ['', Validators.required],
      videoUrl: ['', Validators.required],
      thumbnailUrl: [''],
      exerciseType: [''],
      equipmentInput: [''],
      muscleGroupsInput: [''],
      suggestedSets: [''],
      suggestedReps: [''],
      suggestedRest: [''],
      tempo: [''],
      videoUrlsInput: ['']
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
      tempo: exercise.tempo || '',
      videoUrlsInput: exercise.videoUrls?.join('\n') || ''
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

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
      videoUrls: this.parseLineSeparated(formValue.videoUrlsInput)
    };

    if (this.exercise()) {
      exerciseData.id = this.exercise()!.id;
    }

    this.saved.emit(exerciseData as Exercise);
  }

  onCancel() {
    this.cancelled.emit();
  }

  onBackdropClick(event: MouseEvent) {
    this.onCancel();
  }

  private parseCommaSeparated(value: string): string[] {
    return value ? value.split(',').map(v => v.trim()).filter(v => v) : [];
  }

  private parseLineSeparated(value: string): string[] {
    return value ? value.split('\n').map(v => v.trim()).filter(v => v) : [];
  }
}
