import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Program, StudentProgramAssignment, Routine } from '../../shared/models';

@Component({
  selector: 'app-my-program',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-white">Mi Programa</h1>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      } @else if (assignment() && program()) {
        <div class="glass rounded-lg p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl font-bold text-white">{{ program()!.name }}</h2>
              <p class="text-white/70 mt-1">{{ program()!.description }}</p>
            </div>
            <span class="px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-medium">
              {{ assignment()!.status === 'active' ? 'Activo' : 'Completado' }}
            </span>
          </div>

          <div class="mt-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-white/80">Progreso General</span>
              <span class="text-white font-semibold">
                Semana {{ assignment()!.currentWeek }} de {{ program()!.durationWeeks }}
              </span>
            </div>
            <div class="h-4 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all"
                   [style.width.%]="(assignment()!.currentWeek / program()!.durationWeeks) * 100"></div>
            </div>
            <div class="mt-2 text-center">
              <span class="text-3xl font-bold text-white">
                {{ ((assignment()!.currentWeek / program()!.durationWeeks) * 100).toFixed(0) }}%
              </span>
              <span class="text-white/60 ml-2">completado</span>
            </div>
          </div>
        </div>

        <div class="glass rounded-lg p-6">
          <h3 class="text-xl font-semibold text-white mb-4">Rutina de la Semana Actual</h3>
          @if (currentWeekRoutine()) {
            <div class="bg-primary-600/20 border-2 border-primary-600 rounded-lg p-6">
              <div class="flex justify-between items-start mb-3">
                <h4 class="text-lg font-semibold text-white">{{ getCurrentRoutineName() }}</h4>
                <span class="px-3 py-1 bg-primary-600 text-white rounded-full text-sm">
                  Semana {{ assignment()!.currentWeek }}
                </span>
              </div>
              @if (currentWeekRoutine()!.notes) {
                <p class="text-white/80 mb-4">{{ currentWeekRoutine()!.notes }}</p>
              }
              <a routerLink="/my-routine"
                 class="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                Ver Rutina Completa
              </a>
            </div>
          }
        </div>

        <div class="glass rounded-lg p-6">
          <h3 class="text-xl font-semibold text-white mb-4">Timeline del Programa</h3>
          <div class="space-y-3">
            @for (routine of program()!.routines; track routine.weekNumber) {
              <div class="flex items-center space-x-4 p-4 rounded-lg"
                   [ngClass]="{
                     'bg-green-600 bg-opacity-20': routine.weekNumber < assignment()!.currentWeek,
                     'bg-primary-600 bg-opacity-20': routine.weekNumber === assignment()!.currentWeek,
                     'bg-white bg-opacity-5': routine.weekNumber > assignment()!.currentWeek
                   }">
                <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold"
                     [ngClass]="{
                       'bg-green-600 text-white': routine.weekNumber < assignment()!.currentWeek,
                       'bg-primary-600 text-white': routine.weekNumber === assignment()!.currentWeek,
                       'bg-white bg-opacity-10 text-white text-opacity-50': routine.weekNumber > assignment()!.currentWeek
                     }">
                  @if (routine.weekNumber < assignment()!.currentWeek) {
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  } @else {
                    S{{ routine.weekNumber }}
                  }
                </div>
                <div class="flex-1">
                  <div class="font-semibold"
                       [ngClass]="{
                         'text-white': routine.weekNumber <= assignment()!.currentWeek,
                         'text-white text-opacity-50': routine.weekNumber > assignment()!.currentWeek
                       }">
                    {{ getRoutineName(routine.routineId) }}
                  </div>
                  @if (routine.notes) {
                    <div class="text-sm"
                         [ngClass]="{
                           'text-white text-opacity-70': routine.weekNumber <= assignment()!.currentWeek,
                           'text-white text-opacity-40': routine.weekNumber > assignment()!.currentWeek
                         }">
                      {{ routine.notes }}
                    </div>
                  }
                </div>
                @if (routine.weekNumber === assignment()!.currentWeek) {
                  <span class="px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-medium">Actual</span>
                }
              </div>
            }
          </div>
        </div>

        @if (getMotivationalMessage()) {
          <div class="glass rounded-lg p-6 text-center">
            <p class="text-lg text-white">{{ getMotivationalMessage() }}</p>
          </div>
        }
      } @else {
        <div class="glass rounded-lg p-12 text-center">
          <svg class="mx-auto h-16 w-16 text-white/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-xl font-semibold text-white mb-2">No tienes un programa asignado</h3>
          <p class="text-white/70">Contacta a tu entrenador para que te asigne un programa personalizado</p>
        </div>
      }
    </div>
  `,
  styles: []
})
export class MyProgramComponent implements OnInit {
  assignment = signal<StudentProgramAssignment | null>(null);
  program = signal<Program | null>(null);
  routines = signal<Routine[]>([]);
  loading = signal(true);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadMyProgram();
    this.loadRoutines();
  }

  loadMyProgram() {
    this.api.get<StudentProgramAssignment | null>('/students/student-1/program').subscribe({
      next: (assignment) => {
        if (assignment) {
          this.assignment.set(assignment);
          this.loadProgram(assignment.programId);
        } else {
          this.loading.set(false);
        }
      },
      error: () => this.loading.set(false)
    });
  }

  loadProgram(programId: string) {
    this.api.get<Program>(`/programs/${programId}`).subscribe({
      next: (data) => {
        this.program.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadRoutines() {
    this.api.get<Routine[]>('/routines').subscribe({
      next: (data) => this.routines.set(data)
    });
  }

  currentWeekRoutine() {
    if (!this.program() || !this.assignment()) return null;
    return this.program()!.routines.find(r => r.weekNumber === this.assignment()!.currentWeek);
  }

  getRoutineName(routineId: string): string {
    return this.routines().find(r => r.id === routineId)?.name || 'Rutina';
  }

  getCurrentRoutineName(): string {
    const routine = this.currentWeekRoutine();
    return routine ? this.getRoutineName(routine.routineId) : '';
  }

  getMotivationalMessage(): string {
    if (!this.assignment() || !this.program()) return '';
    const progress = (this.assignment()!.currentWeek / this.program()!.durationWeeks) * 100;

    if (progress < 25) return '¡Excelente comienzo! Mantén el enfoque y la constancia.';
    if (progress < 50) return '¡Vas por buen camino! Ya completaste un cuarto del programa.';
    if (progress < 75) return '¡Más de la mitad! Tu esfuerzo está dando resultados.';
    if (progress < 100) return '¡Estás en la recta final! No aflojes ahora.';
    return '¡Felicitaciones! Completaste el programa exitosamente.';
  }
}
