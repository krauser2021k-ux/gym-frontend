import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Program, Student } from '../../shared/models';

interface StudentWithSelection extends Student {
  selected: boolean;
}

@Component({
  selector: 'app-program-assign',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-white">Asignar Programa a Alumnos</h1>

      @if (program()) {
        <div class="glass rounded-lg p-6">
          <h2 class="text-lg font-semibold text-white mb-2">{{ program()!.name }}</h2>
          <p class="text-white/70">{{ program()!.description }}</p>
          <div class="mt-4 flex space-x-4 text-sm text-white/60">
            <span>{{ program()!.durationWeeks }} semanas</span>
            <span>{{ program()!.routines.length }} rutinas</span>
          </div>
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="glass rounded-lg p-6 space-y-4">
          <h2 class="text-lg font-semibold text-white">Configuración de Asignación</h2>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Fecha de Inicio</label>
            <input type="date" formControlName="startDate"
                   class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
          </div>

          <div class="flex items-center">
            <input type="checkbox" formControlName="autoProgressionEnabled" id="autoProgress"
                   class="h-4 w-4 rounded border-white/20 text-primary-600 focus:ring-primary-500">
            <label for="autoProgress" class="ml-2 text-white/80">
              Activar progresión automática semanal
            </label>
          </div>
        </div>

        <div class="glass rounded-lg p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Seleccionar Alumnos</h2>

          <div class="mb-4">
            <input type="text" [(ngModel)]="searchTerm" [ngModelOptions]="{standalone: true}"
                   placeholder="Buscar alumno..."
                   class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500">
          </div>

          <div class="space-y-2 max-h-96 overflow-y-auto">
            @for (student of filteredStudents(); track student.id) {
              <label class="flex items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                <input type="checkbox" [(ngModel)]="student.selected" [ngModelOptions]="{standalone: true}"
                       class="h-4 w-4 rounded border-white/20 text-primary-600 focus:ring-primary-500">
                <div class="ml-3 flex-1">
                  <div class="text-white font-medium">{{ student.firstName }} {{ student.lastName }}</div>
                  <div class="text-white/60 text-sm">{{ student.email }}</div>
                </div>
              </label>
            }
          </div>

          @if (selectedCount() > 0) {
            <div class="mt-4 p-3 bg-primary-600/20 rounded-lg text-white">
              {{ selectedCount() }} alumno(s) seleccionado(s)
            </div>
          }
        </div>

        <div class="flex justify-end space-x-3">
          <button type="button" (click)="goBack()"
                  class="px-6 py-3 text-white rounded-lg glass hover:bg-white/20 transition-colors">
            Cancelar
          </button>
          <button type="submit" [disabled]="form.invalid || selectedCount() === 0 || saving()"
                  class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50">
            {{ saving() ? 'Asignando...' : 'Asignar Programa' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class ProgramAssignComponent implements OnInit {
  form: FormGroup;
  program = signal<Program | null>(null);
  students = signal<StudentWithSelection[]>([]);
  searchTerm = '';
  saving = signal(false);
  programId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.form = this.fb.group({
      startDate: [today, Validators.required],
      autoProgressionEnabled: [true]
    });
  }

  ngOnInit() {
    this.programId = this.route.snapshot.paramMap.get('programId');
    if (this.programId) {
      this.loadProgram(this.programId);
    }
    this.loadStudents();
  }

  loadProgram(id: string) {
    this.api.get<Program>(`/programs/${id}`).subscribe({
      next: (data) => this.program.set(data)
    });
  }

  loadStudents() {
    this.api.get<Student[]>('/students').subscribe({
      next: (data) => {
        const studentsWithSelection = data.map(s => ({ ...s, selected: false }));
        this.students.set(studentsWithSelection);
      }
    });
  }

  filteredStudents() {
    const term = this.searchTerm.toLowerCase();
    return this.students().filter(s =>
      s.firstName.toLowerCase().includes(term) ||
      s.lastName.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term)
    );
  }

  selectedCount() {
    return this.students().filter(s => s.selected).length;
  }

  onSubmit() {
    if (this.form.invalid || this.selectedCount() === 0) return;

    this.saving.set(true);
    const selectedStudents = this.students().filter(s => s.selected);
    const { startDate, autoProgressionEnabled } = this.form.value;

    const requests = selectedStudents.map(student =>
      this.api.post('/programs/assign', {
        programId: this.programId,
        programName: this.program()?.name,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        startDate,
        autoProgressionEnabled
      })
    );

    Promise.all(requests.map(req => req.toPromise())).then(() => {
      this.router.navigate(['/programs', this.programId]);
    }).catch(err => {
      console.error('Error assigning program:', err);
      this.saving.set(false);
    });
  }

  goBack() {
    this.router.navigate(['/programs', this.programId]);
  }
}
