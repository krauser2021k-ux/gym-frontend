import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Program, Routine } from '../../shared/models';

@Component({
  selector: 'app-program-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">
          {{ isEditMode() ? 'Editar Programa' : 'Crear Programa' }}
        </h1>
        <button (click)="goBack()" class="px-4 py-2 text-white glass hover:bg-white/20 rounded-lg">
          Cancelar
        </button>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="glass rounded-lg p-6 space-y-4">
          <h2 class="text-lg font-semibold text-white">Información Básica</h2>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Nombre del Programa</label>
            <input type="text" formControlName="name"
                   class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500">
            @if (form.get('name')?.invalid && form.get('name')?.touched) {
              <p class="mt-1 text-sm text-red-400">El nombre es requerido</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Descripción</label>
            <textarea formControlName="description" rows="3"
                      class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Duración (semanas)</label>
            <input type="number" formControlName="durationWeeks" min="1"
                   class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500">
            @if (form.get('durationWeeks')?.invalid && form.get('durationWeeks')?.touched) {
              <p class="mt-1 text-sm text-red-400">La duración debe ser al menos 1 semana</p>
            }
          </div>
        </div>

        <div class="glass rounded-lg p-6 space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-white">Rutinas del Programa</h2>
            <button type="button" (click)="addRoutine()"
                    class="px-4 py-2 text-white glass hover:bg-white/20 rounded-lg text-sm">
              Agregar Rutina
            </button>
          </div>

          <div formArrayName="routines" class="space-y-3">
            @for (routine of routinesArray.controls; track $index) {
              <div [formGroupName]="$index" class="bg-white/5 rounded-lg p-4 space-y-3">
                <div class="flex justify-between items-start">
                  <span class="text-white font-medium">Semana {{ $index + 1 }}</span>
                  <button type="button" (click)="removeRoutine($index)"
                          class="text-red-400 hover:text-red-300">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div>
                  <label class="block text-sm font-medium text-white/70 mb-1">Rutina</label>
                  <select formControlName="routineId"
                          class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Seleccionar rutina</option>
                    @for (r of availableRoutines(); track r.id) {
                      <option [value]="r.id">{{ r.name }}</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-white/70 mb-1">Notas (opcional)</label>
                  <input type="text" formControlName="notes"
                         placeholder="Ej: Enfoque en técnica, aumentar cargas, etc."
                         class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500">
                </div>
              </div>
            }
          </div>

          @if (routinesArray.length === 0) {
            <p class="text-white/60 text-center py-4">No hay rutinas agregadas. Click en "Agregar Rutina" para comenzar.</p>
          }
        </div>

        <div class="flex justify-end space-x-3">
          <button type="button" (click)="goBack()"
                  class="px-6 py-3 text-white rounded-lg glass hover:bg-white/20 transition-colors">
            Cancelar
          </button>
          <button type="submit" [disabled]="form.invalid || saving()"
                  class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {{ saving() ? 'Guardando...' : 'Guardar Programa' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class ProgramFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = signal(false);
  saving = signal(false);
  availableRoutines = signal<Routine[]>([]);
  programId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      durationWeeks: [1, [Validators.required, Validators.min(1)]],
      routines: this.fb.array([])
    });
  }

  get routinesArray(): FormArray {
    return this.form.get('routines') as FormArray;
  }

  ngOnInit() {
    this.programId = this.route.snapshot.paramMap.get('id');
    this.isEditMode.set(!!this.programId);

    this.loadRoutines();

    if (this.programId) {
      this.loadProgram(this.programId);
    }
  }

  loadRoutines() {
    this.api.get<Routine[]>('/routines').subscribe({
      next: (data) => {
        this.availableRoutines.set(data);
      }
    });
  }

  loadProgram(id: string) {
    this.api.get<Program>(`/programs/${id}`).subscribe({
      next: (program) => {
        this.form.patchValue({
          name: program.name,
          description: program.description,
          durationWeeks: program.durationWeeks
        });

        program.routines.forEach(r => {
          this.routinesArray.push(this.fb.group({
            routineId: [r.routineId, Validators.required],
            weekNumber: [r.weekNumber],
            notes: [r.notes]
          }));
        });
      }
    });
  }

  addRoutine() {
    const weekNumber = this.routinesArray.length + 1;
    this.routinesArray.push(this.fb.group({
      routineId: ['', Validators.required],
      weekNumber: [weekNumber],
      notes: ['']
    }));
  }

  removeRoutine(index: number) {
    this.routinesArray.removeAt(index);
    this.routinesArray.controls.forEach((control, i) => {
      control.get('weekNumber')?.setValue(i + 1);
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.saving.set(true);
    const payload = {
      ...this.form.value,
      gymId: 'gym-1',
      createdBy: 'user-1'
    };

    const request = this.isEditMode()
      ? this.api.put(`/programs/${this.programId}`, payload)
      : this.api.post('/programs', payload);

    request.subscribe({
      next: () => {
        this.router.navigate(['/programs']);
      },
      error: (err) => {
        console.error('Error saving program:', err);
        this.saving.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/programs']);
  }
}
