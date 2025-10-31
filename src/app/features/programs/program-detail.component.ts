import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Program, Routine, StudentProgramAssignment } from '../../shared/models';

@Component({
  selector: 'app-program-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      } @else if (program()) {
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-white">{{ program()!.name }}</h1>
            <p class="text-white/80 mt-2">{{ program()!.description }}</p>
          </div>
          <div class="flex space-x-2">
            <a [routerLink]="['/programs/edit', program()!.id]"
               class="px-4 py-2 text-white glass hover:bg-white/20 rounded-lg">
              Editar
            </a>
            <a [routerLink]="['/programs/assign', program()!.id]"
               class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
              Asignar a Alumno
            </a>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="glass rounded-lg p-4">
            <div class="text-white/60 text-sm">Duración Total</div>
            <div class="text-2xl font-bold text-white">{{ program()!.durationWeeks }} semanas</div>
          </div>
          <div class="glass rounded-lg p-4">
            <div class="text-white/60 text-sm">Rutinas</div>
            <div class="text-2xl font-bold text-white">{{ program()!.routines.length }}</div>
          </div>
          <div class="glass rounded-lg p-4">
            <div class="text-white/60 text-sm">Alumnos Asignados</div>
            <div class="text-2xl font-bold text-white">{{ assignments().length }}</div>
          </div>
        </div>

        <div class="glass rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Timeline del Programa</h2>
          <div class="space-y-4">
            @for (routine of program()!.routines; track routine.weekNumber) {
              <div class="flex items-start space-x-4 bg-white/5 rounded-lg p-4">
                <div class="flex-shrink-0 w-16 h-16 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
                  S{{ routine.weekNumber }}
                </div>
                <div class="flex-1">
                  <h3 class="text-white font-semibold">{{ getRoutineName(routine.routineId) }}</h3>
                  @if (routine.notes) {
                    <p class="text-white/70 text-sm mt-1">{{ routine.notes }}</p>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        @if (assignments().length > 0) {
          <div class="glass rounded-lg p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Alumnos Asignados</h2>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-white/10">
                    <th class="text-left py-3 px-4 text-white/80 font-medium">Alumno</th>
                    <th class="text-left py-3 px-4 text-white/80 font-medium">Fecha Inicio</th>
                    <th class="text-left py-3 px-4 text-white/80 font-medium">Semana Actual</th>
                    <th class="text-left py-3 px-4 text-white/80 font-medium">Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  @for (assignment of assignments(); track assignment.id) {
                    <tr class="border-b border-white/5">
                      <td class="py-3 px-4 text-white">{{ assignment.studentName }}</td>
                      <td class="py-3 px-4 text-white/70">{{ assignment.startDate }}</td>
                      <td class="py-3 px-4 text-white/70">{{ assignment.currentWeek }} / {{ program()!.durationWeeks }}</td>
                      <td class="py-3 px-4">
                        <div class="flex items-center space-x-2">
                          <div class="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div class="h-full bg-primary-600"
                                 [style.width.%]="(assignment.currentWeek / program()!.durationWeeks) * 100"></div>
                          </div>
                          <span class="text-white/70 text-sm">{{ ((assignment.currentWeek / program()!.durationWeeks) * 100).toFixed(0) }}%</span>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: []
})
export class ProgramDetailComponent implements OnInit {
  program = signal<Program | null>(null);
  assignments = signal<StudentProgramAssignment[]>([]);
  routines = signal<Routine[]>([]);
  loading = signal(true);

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProgram(id);
      this.loadAssignments();
      this.loadRoutines();
    }
  }

  loadProgram(id: string) {
    this.api.get<Program>(`/programs/${id}`).subscribe({
      next: (data) => {
        this.program.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadAssignments() {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.get<StudentProgramAssignment[]>('/student-program-assignments').subscribe({
      next: (data) => {
        this.assignments.set(data.filter(a => a.programId === id && a.status === 'active'));
      }
    });
  }

  loadRoutines() {
    this.api.get<Routine[]>('/routines').subscribe({
      next: (data) => this.routines.set(data)
    });
  }

  getRoutineName(routineId: string): string {
    return this.routines().find(r => r.id === routineId)?.name || 'Rutina';
  }
}
