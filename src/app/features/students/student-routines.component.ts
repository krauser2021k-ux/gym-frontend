import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoutineService } from '../../core/routine.service';
import { StudentService } from '../../core/student.service';
import { Routine, Student } from '../../shared/models';

@Component({
  selector: 'app-student-routines',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center space-x-4 mb-6">
        <button (click)="goBack()"
                class="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-200">
          <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Rutinas del Alumno</h1>
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      } @else if (student()) {
        <div class="glass rounded-lg p-6 mb-6">
          <div class="flex items-center justify-between">
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
            <a [routerLink]="['/routines/assign', studentId]"
               class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-medium">
              Asignar Rutina
            </a>
          </div>
        </div>

        @if (routines().length === 0) {
          <div class="glass rounded-lg p-12">
            <div class="text-center">
              <svg class="mx-auto h-16 w-16 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-4 text-xl font-medium text-white">No hay rutinas asignadas</h3>
              <p class="mt-2 text-white/60">Este alumno no tiene ninguna rutina asignada actualmente.</p>
              <a [routerLink]="['/routines/assign', studentId]"
                 class="inline-block mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-medium">
                Asignar Primera Rutina
              </a>
            </div>
          </div>
        } @else {
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-white">
                Rutinas Activas ({{ routines().length }})
              </h2>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              @for (routine of routines(); track routine.id) {
                <div class="glass rounded-lg p-6 hover:bg-white/25 transition-all duration-200">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <h3 class="text-lg font-semibold text-white">{{ routine.name }}</h3>
                      @if (routine.description) {
                        <p class="text-sm text-white/60 mt-1">{{ routine.description }}</p>
                      }
                    </div>
                    <span [class]="routine.type === 'default' ? 'bg-blue-500/20 text-blue-300' : 'bg-cyan-500/20 text-cyan-300'"
                          class="px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap">
                      {{ routine.type === 'default' ? 'Por Defecto' : 'Personalizada' }}
                    </span>
                  </div>

                  <div class="space-y-2 mb-4">
                    <div class="flex items-center text-sm text-white/80">
                      <svg class="h-5 w-5 mr-2 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ getRoutineDaysCount(routine) }} días de entrenamiento
                    </div>
                    <div class="flex items-center text-sm text-white/80">
                      <svg class="h-5 w-5 mr-2 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Asignada {{ getRelativeDate(routine.createdAt) }}
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <a [routerLink]="['/routines', routine.id]"
                       class="flex-1 text-center px-4 py-2 glass hover:bg-white/20 text-white rounded-lg transition-all duration-200 font-medium">
                      Ver Detalle
                    </a>
                    <button (click)="confirmUnassign(routine.id)"
                            class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-200 font-medium">
                      Desasignar
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

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
export class StudentRoutinesComponent implements OnInit {
  student = signal<Student | undefined>(undefined);
  routines = signal<Routine[]>([]);
  loading = signal(true);
  successMessage = signal<string>('');

  studentId: string = '';

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
    this.routineService.getStudentRoutines(this.studentId).subscribe({
      next: (routines) => {
        this.routines.set(routines);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading routines:', err);
        this.loading.set(false);
      }
    });
  }

  confirmUnassign(routineId: string) {
    if (confirm('¿Estás seguro de que deseas desasignar esta rutina?')) {
      this.unassignRoutine(routineId);
    }
  }

  unassignRoutine(routineId: string) {
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

  getRelativeDate(dateString?: string): string {
    if (!dateString) return 'recientemente';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'hoy';
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
    return `hace ${Math.floor(diffDays / 30)} meses`;
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
}
