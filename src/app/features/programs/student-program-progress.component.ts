import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { StudentProgramAssignment, Program } from '../../shared/models';

@Component({
  selector: 'app-student-program-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-white">Progreso de Programas</h1>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      } @else if (assignments().length > 0) {
        <div class="glass rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-white/5">
                <tr>
                  <th class="text-left py-4 px-4 text-white/80 font-medium">Alumno</th>
                  <th class="text-left py-4 px-4 text-white/80 font-medium">Programa</th>
                  <th class="text-left py-4 px-4 text-white/80 font-medium">Fecha Inicio</th>
                  <th class="text-left py-4 px-4 text-white/80 font-medium">Semana</th>
                  <th class="text-left py-4 px-4 text-white/80 font-medium">Progreso</th>
                  <th class="text-left py-4 px-4 text-white/80 font-medium">Estado</th>
                  <th class="text-left py-4 px-4 text-white/80 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (assignment of assignments(); track assignment.id) {
                  <tr class="border-t border-white/5 hover:bg-white/5">
                    <td class="py-4 px-4 text-white">{{ assignment.studentName }}</td>
                    <td class="py-4 px-4 text-white/80">{{ assignment.programName }}</td>
                    <td class="py-4 px-4 text-white/60 text-sm">{{ assignment.startDate }}</td>
                    <td class="py-4 px-4 text-white/80">
                      {{ assignment.currentWeek }} / {{ getProgramWeeks(assignment.programId) }}
                    </td>
                    <td class="py-4 px-4">
                      <div class="flex items-center space-x-2">
                        <div class="flex-1 h-2 bg-white/10 rounded-full overflow-hidden w-24">
                          <div class="h-full bg-primary-600"
                               [style.width.%]="getProgress(assignment)"></div>
                        </div>
                        <span class="text-white/70 text-sm">{{ getProgress(assignment).toFixed(0) }}%</span>
                      </div>
                    </td>
                    <td class="py-4 px-4">
                      @if (assignment.status === 'active') {
                        <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                          Activo
                        </span>
                      } @else if (assignment.status === 'paused') {
                        <span class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
                          Pausado
                        </span>
                      } @else {
                        <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                          Completado
                        </span>
                      }
                    </td>
                    <td class="py-4 px-4">
                      <div class="flex space-x-2">
                        @if (assignment.status === 'active' && assignment.currentWeek < getProgramWeeks(assignment.programId)) {
                          <button (click)="advanceWeek(assignment)"
                                  class="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded transition-colors">
                            Avanzar
                          </button>
                        }
                        @if (assignment.status === 'active') {
                          <button (click)="pauseProgram(assignment.id)"
                                  class="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors">
                            Pausar
                          </button>
                        }
                        @if (assignment.status === 'paused') {
                          <button (click)="resumeProgram(assignment.id)"
                                  class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors">
                            Reanudar
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <div class="glass rounded-lg p-12 text-center">
          <svg class="mx-auto h-16 w-16 text-white/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-white mb-2">No hay alumnos con programas asignados</h3>
          <p class="text-white/70">Comienza asignando programas a tus alumnos desde la lista de programas</p>
        </div>
      }
    </div>
  `,
  styles: []
})
export class StudentProgramProgressComponent implements OnInit {
  assignments = signal<StudentProgramAssignment[]>([]);
  programs = signal<Program[]>([]);
  loading = signal(true);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadAssignments();
    this.loadPrograms();
  }

  loadAssignments() {
    this.api.get<StudentProgramAssignment[]>('/student-program-assignments').subscribe({
      next: (data) => {
        this.assignments.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadPrograms() {
    this.api.get<Program[]>('/programs?gymId=gym-1').subscribe({
      next: (data) => this.programs.set(data)
    });
  }

  getProgramWeeks(programId: string): number {
    return this.programs().find(p => p.id === programId)?.durationWeeks || 1;
  }

  getProgress(assignment: StudentProgramAssignment): number {
    const weeks = this.getProgramWeeks(assignment.programId);
    return (assignment.currentWeek / weeks) * 100;
  }

  advanceWeek(assignment: StudentProgramAssignment) {
    const newWeek = assignment.currentWeek + 1;
    this.api.put(`/student-program-assignments/${assignment.id}/progress`, { currentWeek: newWeek }).subscribe({
      next: () => this.loadAssignments()
    });
  }

  pauseProgram(id: string) {
    this.api.put(`/student-program-assignments/${id}/pause`, {}).subscribe({
      next: () => this.loadAssignments()
    });
  }

  resumeProgram(id: string) {
    this.api.put(`/student-program-assignments/${id}/resume`, {}).subscribe({
      next: () => this.loadAssignments()
    });
  }
}
