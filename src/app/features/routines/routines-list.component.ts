import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoutineService } from '../../core/routine.service';
import { Routine } from '../../shared/models';

@Component({
  selector: 'app-routines-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Rutinas</h1>
        <a routerLink="/routines/new"
           class="px-4 sm:px-6 py-2 sm:py-3 text-white font-semibold rounded-lg transition-all duration-200 glass hover:bg-white/20 text-center">
          Crear Rutina
        </a>
      </div>

      <div class="flex flex-wrap gap-2">
        <button (click)="filterType.set('all')"
                [class.bg-primary-600]="filterType() === 'all'"
                [class.text-white]="filterType() === 'all'"
                class="px-4 py-2 rounded-lg transition-all duration-200 text-white glass hover:bg-white/20">
          Todas
        </button>
        <button (click)="filterType.set('default')"
                [class.bg-primary-600]="filterType() === 'default'"
                [class.text-white]="filterType() === 'default'"
                class="px-4 py-2 rounded-lg transition-all duration-200 text-white glass hover:bg-white/20">
          Por Defecto
        </button>
        <button (click)="filterType.set('personalized')"
                [class.bg-primary-600]="filterType() === 'personalized'"
                [class.text-white]="filterType() === 'personalized'"
                class="px-4 py-2 rounded-lg transition-all duration-200 text-white glass hover:bg-white/20">
          Personalizadas
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          @for (routine of filteredRoutines(); track routine.id) {
            <div class="glass rounded-lg hover:bg-white/25 transition-all duration-200 p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-semibold text-white">{{ routine.name }}</h3>
                  <p class="text-sm text-white/80 mt-1">{{ routine.description }}</p>
                </div>
                <span [class]="routine.type === 'default' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'"
                      class="px-3 py-1 text-xs font-medium rounded-full">
                  {{ routine.type === 'default' ? 'Por Defecto' : 'Personalizada' }}
                </span>
              </div>

              <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-white/80">
                  <svg class="h-5 w-5 mr-2 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ routine.weeklyPlan.length }} días
                </div>
                @if (routine.assignedTo && routine.assignedTo.length > 0) {
                  <div class="flex items-center text-sm text-white/80">
                    <svg class="h-5 w-5 mr-2 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {{ routine.assignedTo.length }} alumno(s) asignado(s)
                  </div>
                }
              </div>

              <div class="flex space-x-2">
                <a [routerLink]="['/routines', routine.id]"
                   class="flex-1 text-center px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium glass hover:bg-white/20">
                  Ver Detalle
                </a>
                <button (click)="duplicateRoutine(routine.id)"
                        class="px-4 py-2 bg-primary-50 dark:bg-primary-900 hover:bg-primary-100 dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-lg transition-colors font-medium">
                  Duplicar
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
export class RoutinesListComponent implements OnInit {
  routines = signal<Routine[]>([]);
  loading = signal(true);
  filterType = signal<'all' | 'default' | 'personalized'>('all');

  constructor(private routineService: RoutineService) {}

  ngOnInit() {
    this.loadRoutines();
  }

  loadRoutines() {
    this.routineService.getRoutines('current-gym-id').subscribe({
      next: (data) => {
        this.routines.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading routines:', err);
        this.loading.set(false);
      }
    });
  }

  filteredRoutines() {
    if (this.filterType() === 'all') {
      return this.routines();
    }
    return this.routines().filter(r => r.type === this.filterType());
  }

  duplicateRoutine(id: string) {
    this.loading.set(true);
    this.routineService.getRoutineById(id).subscribe({
      next: (routine) => {
        const duplicatedRoutine = {
          ...routine,
          name: `${routine.name} (Copia)`,
          createdBy: 'current-user-id',
          gymId: 'current-gym-id',
          assignedTo: []
        };

        this.routineService.createRoutine(duplicatedRoutine).subscribe({
          next: () => {
            this.loadRoutines();
          },
          error: (err) => {
            console.error('Error duplicating routine:', err);
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error loading routine:', err);
        this.loading.set(false);
      }
    });
  }
}
