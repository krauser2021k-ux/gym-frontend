import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Program, StudentProgramAssignment } from '../../shared/models';

@Component({
  selector: 'app-programs-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Programas</h1>
        <a routerLink="/programs/new"
           class="px-4 sm:px-6 py-2 sm:py-3 text-white font-semibold rounded-lg transition-all duration-200 glass hover:bg-white/20 text-center">
          Crear Programa
        </a>
      </div>

      <div class="flex flex-wrap gap-2">
        <button (click)="filterType.set('all')"
                [class.bg-primary-600]="filterType() === 'all'"
                [class.text-white]="filterType() === 'all'"
                class="px-4 py-2 rounded-lg transition-all duration-200 text-white glass hover:bg-white/20">
          Todos
        </button>
        <button (click)="filterType.set('assigned')"
                [class.bg-primary-600]="filterType() === 'assigned'"
                [class.text-white]="filterType() === 'assigned'"
                class="px-4 py-2 rounded-lg transition-all duration-200 text-white glass hover:bg-white/20">
          Con Alumnos
        </button>
        <button (click)="filterType.set('unassigned')"
                [class.bg-primary-600]="filterType() === 'unassigned'"
                [class.text-white]="filterType() === 'unassigned'"
                class="px-4 py-2 rounded-lg transition-all duration-200 text-white glass hover:bg-white/20">
          Sin Asignar
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          @for (program of filteredPrograms(); track program.id) {
            <div class="glass rounded-lg hover:bg-white/25 transition-all duration-200 p-6">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <h3 class="text-xl font-semibold text-white">{{ program.name }}</h3>
                  <p class="text-sm text-white/80 mt-1">{{ program.description }}</p>
                </div>
                @if (getAssignmentCount(program.id) > 0) {
                  <span class="ml-2 px-3 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    Activo
                  </span>
                } @else {
                  <span class="ml-2 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                    Disponible
                  </span>
                }
              </div>

              <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-white/80">
                  <svg class="h-5 w-5 mr-2 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ program.durationWeeks }} semanas
                </div>
                <div class="flex items-center text-sm text-white/80">
                  <svg class="h-5 w-5 mr-2 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {{ program.routines.length }} rutinas
                </div>
                @if (getAssignmentCount(program.id) > 0) {
                  <div class="flex items-center text-sm text-white/80">
                    <svg class="h-5 w-5 mr-2 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {{ getAssignmentCount(program.id) }} alumno(s) asignado(s)
                  </div>
                }
              </div>

              <div class="flex space-x-2">
                <a [routerLink]="['/programs', program.id]"
                   class="flex-1 text-center px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium glass hover:bg-white/20">
                  Ver Detalle
                </a>
                <button (click)="duplicateProgram(program.id)"
                        class="px-4 py-2 bg-primary-50 dark:bg-primary-900 hover:bg-primary-100 dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-lg transition-colors font-medium">
                  Duplicar
                </button>
                <button (click)="deleteProgram(program.id)"
                        class="px-4 py-2 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg transition-colors font-medium">
                  Eliminar
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class ProgramsListComponent implements OnInit {
  programs = signal<Program[]>([]);
  assignments = signal<StudentProgramAssignment[]>([]);
  loading = signal(true);
  filterType = signal<'all' | 'assigned' | 'unassigned'>('all');

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadPrograms();
    this.loadAssignments();
  }

  loadPrograms() {
    this.api.get<Program[]>('/programs?gymId=gym-1').subscribe({
      next: (data) => {
        this.programs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading programs:', err);
        this.loading.set(false);
      }
    });
  }

  loadAssignments() {
    this.api.get<StudentProgramAssignment[]>('/student-program-assignments').subscribe({
      next: (data) => {
        this.assignments.set(data);
      },
      error: (err) => {
        console.error('Error loading assignments:', err);
      }
    });
  }

  filteredPrograms() {
    const all = this.programs();
    if (this.filterType() === 'all') {
      return all;
    } else if (this.filterType() === 'assigned') {
      return all.filter(p => this.getAssignmentCount(p.id) > 0);
    } else {
      return all.filter(p => this.getAssignmentCount(p.id) === 0);
    }
  }

  getAssignmentCount(programId: string): number {
    return this.assignments().filter(a => a.programId === programId && a.status === 'active').length;
  }

  duplicateProgram(id: string) {
    this.loading.set(true);
    this.api.post(`/programs/${id}/duplicate`, {}).subscribe({
      next: () => {
        this.loadPrograms();
      },
      error: (err) => {
        console.error('Error duplicating program:', err);
        this.loading.set(false);
      }
    });
  }

  deleteProgram(id: string) {
    if (this.getAssignmentCount(id) > 0) {
      alert('No se puede eliminar un programa con alumnos asignados');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este programa?')) {
      this.loading.set(true);
      this.api.delete(`/programs/${id}`).subscribe({
        next: () => {
          this.loadPrograms();
        },
        error: (err) => {
          console.error('Error deleting program:', err);
          this.loading.set(false);
        }
      });
    }
  }
}
