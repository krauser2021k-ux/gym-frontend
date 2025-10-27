import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoutineService } from '../../core/routine.service';
import { StudentService } from '../../core/student.service';
import { Routine, Student } from '../../shared/models';

@Component({
  selector: 'app-routine-assign',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center space-x-4 mb-6">
        <button (click)="goBack()"
                class="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-200">
          <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Asignar Rutinas</h1>
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      } @else if (student()) {
        <div class="glass rounded-lg p-6 mb-6">
          <h2 class="text-xl font-semibold text-white mb-4">Información del Alumno</h2>
          <div class="flex items-center space-x-4">
            @if (student()!.photoUrl) {
              <img [src]="student()!.photoUrl" [alt]="student()!.firstName"
                   class="w-16 h-16 rounded-full object-cover">
            } @else {
              <div class="w-16 h-16 rounded-full flex items-center justify-center" style="background: rgba(34, 197, 94, 0.3);">
                <span class="text-2xl font-bold text-white">
                  {{ student()!.firstName.charAt(0) }}{{ student()!.lastName.charAt(0) }}
                </span>
              </div>
            }
            <div>
              <h3 class="text-lg font-semibold text-white">
                {{ student()!.firstName }} {{ student()!.lastName }}
              </h3>
              <p class="text-sm text-white/70">{{ student()!.email }}</p>
            </div>
          </div>
        </div>

        @if (assignedRoutines().length > 0) {
          <div class="glass rounded-lg p-6 mb-6">
            <h2 class="text-xl font-semibold text-white mb-4">Rutinas Asignadas Actualmente</h2>
            <div class="space-y-3">
              @for (routine of assignedRoutines(); track routine.id) {
                <div class="flex items-center justify-between p-4 rounded-lg bg-white/10">
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <p class="text-white font-medium">{{ routine.name }}</p>
                      <p class="text-xs text-white/60">{{ routine.description }}</p>
                    </div>
                  </div>
                  <button (click)="unassignRoutine(routine.id)"
                          class="px-3 py-1 text-sm text-red-300 hover:text-red-200 transition-colors">
                    Desasignar
                  </button>
                </div>
              }
            </div>
          </div>
        }

        <div class="glass rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-white">Rutinas Disponibles</h2>
            @if (selectedRoutines().size > 0) {
              <span class="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                {{ selectedRoutines().size }} seleccionada(s)
              </span>
            }
          </div>

          @if (availableRoutines().length === 0) {
            <div class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="mt-2 text-white/60">No hay rutinas disponibles para asignar</p>
              <button (click)="goToCreateRoutine()"
                      class="inline-block mt-4 px-6 py-2 glass rounded-lg hover:bg-white/20 text-white transition-all duration-200">
                Crear Nueva Rutina
              </button>
            </div>
          } @else {
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              @for (routine of availableRoutines(); track routine.id) {
                <div [class.ring-2]="selectedRoutines().has(routine.id)"
                     [class.ring-green-400]="selectedRoutines().has(routine.id)"
                     class="border border-white/20 rounded-lg p-4 hover:border-white/40 transition-all duration-200 cursor-pointer"
                     (click)="toggleRoutineSelection(routine.id)">
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 mt-1">
                      <div [ngClass]="{'bg-green-500': selectedRoutines().has(routine.id), 'border-white/40': !selectedRoutines().has(routine.id)}"
                           class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors">
                        @if (selectedRoutines().has(routine.id)) {
                          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                        }
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between">
                        <h3 class="text-white font-semibold">{{ routine.name }}</h3>
                        <span [class]="routine.type === 'default' ? 'bg-blue-500/20 text-blue-300' : 'bg-cyan-500/20 text-cyan-300'"
                              class="ml-2 px-2 py-1 text-xs rounded-full whitespace-nowrap">
                          {{ routine.type === 'default' ? 'Por Defecto' : 'Personalizada' }}
                        </span>
                      </div>
                      @if (routine.description) {
                        <p class="text-sm text-white/60 mt-1">{{ routine.description }}</p>
                      }
                      <div class="flex items-center mt-2 text-sm text-white/70">
                        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ getRoutineDaysCount(routine) }} días
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button (click)="assignSelectedRoutines()"
                      [disabled]="selectedRoutines().size === 0 || saving()"
                      [class.opacity-50]="selectedRoutines().size === 0 || saving()"
                      [class.cursor-not-allowed]="selectedRoutines().size === 0 || saving()"
                      class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:hover:bg-green-600">
                @if (saving()) {
                  <span class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Asignando...
                  </span>
                } @else {
                  Asignar Rutinas Seleccionadas
                }
              </button>
              <button (click)="goBack()"
                      [disabled]="saving()"
                      class="px-6 py-3 glass hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-200">
                Cancelar
              </button>
            </div>
          }
        </div>

        @if (successMessage()) {
          <div class="fixed bottom-4 right-4 glass p-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-up">
            <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-white font-medium">{{ successMessage() }}</span>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    @keyframes slide-up {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    .animate-slide-up {
      animation: slide-up 0.3s ease-out;
    }
  `]
})
export class RoutineAssignComponent implements OnInit {
  student = signal<Student | undefined>(undefined);
  availableRoutines = signal<Routine[]>([]);
  assignedRoutines = signal<Routine[]>([]);
  selectedRoutines = signal<Set<string>>(new Set());
  loading = signal(true);
  saving = signal(false);
  successMessage = signal<string>('');

  private studentId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routineService: RoutineService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.studentId = this.route.snapshot.paramMap.get('studentId') || '';
    if (this.studentId) {
      this.loadData();
    }
  }

  loadData() {
    this.loading.set(true);

    this.studentService.getStudentById(this.studentId).subscribe({
      next: (student) => {
        this.student.set(student);
        this.loadRoutines();
      },
      error: (err) => {
        console.error('Error loading student:', err);
        this.loading.set(false);
      }
    });
  }

  loadRoutines() {
    this.routineService.getRoutines('current-gym-id').subscribe({
      next: (allRoutines) => {
        this.routineService.getStudentRoutines(this.studentId).subscribe({
          next: (assigned) => {
            this.assignedRoutines.set(assigned);
            const assignedIds = new Set(assigned.map(r => r.id));
            const available = allRoutines.filter(r => !assignedIds.has(r.id));
            this.availableRoutines.set(available);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error loading assigned routines:', err);
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error loading routines:', err);
        this.loading.set(false);
      }
    });
  }

  toggleRoutineSelection(routineId: string) {
    const current = new Set(this.selectedRoutines());
    if (current.has(routineId)) {
      current.delete(routineId);
    } else {
      current.add(routineId);
    }
    this.selectedRoutines.set(current);
  }

  assignSelectedRoutines() {
    if (this.selectedRoutines().size === 0) return;

    this.saving.set(true);
    const routineIds = Array.from(this.selectedRoutines());

    this.routineService.assignRoutinesToStudent(this.studentId, routineIds, 'current-trainer-id').subscribe({
      next: () => {
        this.saving.set(false);
        this.selectedRoutines.set(new Set());
        this.showSuccessMessage(`${routineIds.length} rutina(s) asignada(s) exitosamente`);
        this.loadRoutines();
      },
      error: (err) => {
        console.error('Error assigning routines:', err);
        this.saving.set(false);
      }
    });
  }

  unassignRoutine(routineId: string) {
    if (!confirm('¿Estás seguro de que deseas desasignar esta rutina?')) {
      return;
    }

    this.routineService.unassignRoutineFromStudent(this.studentId, routineId).subscribe({
      next: () => {
        this.showSuccessMessage('Rutina desasignada exitosamente');
        this.loadRoutines();
      },
      error: (err) => {
        console.error('Error unassigning routine:', err);
      }
    });
  }

  getRoutineDaysCount(routine: Routine): number {
    return routine.weeklyPlan?.length || 0;
  }

  showSuccessMessage(message: string) {
    this.successMessage.set(message);
    setTimeout(() => {
      this.successMessage.set('');
    }, 3000);
  }

  goBack() {
    this.router.navigate(['/students']);
  }

  goToCreateRoutine() {
    this.router.navigate(['/routines/new']);
  }
}
