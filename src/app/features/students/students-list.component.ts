import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../core/student.service';
import { Student } from '../../shared/models';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
      <div class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h1 class="text-2xl sm:text-3xl font-bold text-white">Alumnos</h1>
              <a routerLink="/students/new"
                 class="px-4 sm:px-6 py-2 sm:py-3 text-white font-semibold rounded-lg transition-all duration-200 glass hover:bg-white/20 text-center">
                  Nuevo Alumno
              </a>
          </div>

          <div class="glass rounded-lg p-4">
              <div class="relative">
                  <input type="text"
                         [(ngModel)]="searchTerm"
                         (input)="onSearchChange()"
                         placeholder="Buscar por nombre o apellido..."
                         class="w-full px-4 py-3 pl-11 bg-white/10 border border-white/20 rounded-lg text-white 
                  focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200">
                  <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 " fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  @if (searchTerm) {
                      <button (click)="clearSearch()"
                              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                      </button>
                  }
              </div>
              @if (filteredStudents().length !== students().length) {
                  <p class="mt-2 text-sm text-white/60">
                      Mostrando {{ filteredStudents().length }} de {{ students().length }} alumno(s)
                  </p>
              }
          </div>

          @if (loading()) {
              <div class="flex justify-center items-center py-12">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
          } @else if (filteredStudents().length === 0) {
              <div class="glass rounded-lg p-12">
                  <div class="text-center">
                      <svg class="mx-auto h-16 w-16 text-white/40" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      <h3 class="mt-4 text-xl font-medium text-white">
                          @if (searchTerm) {
                              No se encontraron alumnos
                          } @else {
                              No hay alumnos registrados
                          }
                      </h3>
                      <p class="mt-2 text-white ">
                          @if (searchTerm) {
                              No hay alumnos que coincidan con "{{ searchTerm }}"
                          } @else {
                              Comienza agregando tu primer alumno
                          }
                      </p>
                      @if (!searchTerm) {
                          <a routerLink="/students/new"
                             class="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-200 font-medium">
                              Agregar Primer Alumno
                          </a>
                      }
                  </div>
              </div>
          } @else {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  @for (student of filteredStudents(); track student.id) {
                      <div class="glass rounded-lg hover:bg-white/25 transition-all duration-200 overflow-hidden">
                          <div class="p-6">
                              <div class="flex items-center space-x-4">
                                  @if (student.photoUrl) {
                                      <img [src]="student.photoUrl" [alt]="student.firstName"
                                           class="w-16 h-16 rounded-full object-cover">
                                  } @else {
                                      <div class="w-16 h-16 rounded-full flex items-center justify-center"
                                           style="background: rgba(34, 197, 94, 0.3);">
                      <span class="text-2xl font-bold text-white">
                        {{ student.firstName.charAt(0) }}{{ student.lastName.charAt(0) }}
                      </span>
                                      </div>
                                  }
                                  <div class="flex-1 min-w-0">
                                      <h3 class="text-lg font-semibold text-white truncate">
                                          {{ student.firstName }} {{ student.lastName }}
                                      </h3>
                                      <p class="text-sm text-white/70 truncate">{{ student.email }}</p>
                                  </div>
                              </div>

                              <div class="mt-4 space-y-2">
                                  <div class="flex items-center text-sm text-white/80">
                                      <svg class="h-5 w-5 mr-2 text-white/60" fill="none" viewBox="0 0 24 24"
                                           stroke="currentColor">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                      </svg>
                                      {{ student.phone }}
                                  </div>
                                  @if (student.weight && student.height) {
                                      <div class="flex items-center text-sm text-white/80">
                                          <svg class="h-5 w-5 mr-2 text-white/60" fill="none" viewBox="0 0 24 24"
                                               stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                          </svg>
                                          {{ student.weight }}kg / {{ student.height }}cm
                                      </div>
                                  }
                              </div>

                              <div class="mt-4 flex flex-col sm:flex-row gap-2">
                                  <a [routerLink]="['/students', student.id]"
                                     class="flex-1 text-center px-4 py-2 text-sm sm:text-base text-white rounded-lg transition-all duration-200 font-medium glass hover:bg-white/20">
                                      Ver Detalle
                                  </a>
                                  <a [routerLink]="['/students', student.id, 'routines']"
                                     class="flex-1 text-center px-4 py-2 text-sm sm:text-base text-white rounded-lg transition-all duration-200 font-medium glass hover:bg-white/25">
                                      Rutinas
                                  </a>
                              </div>
                          </div>
                      </div>
                  }
              </div>
          }
      </div>
  `,
  styles: []
})
export class StudentsListComponent implements OnInit {
  students = signal<Student[]>([]);
  loading = signal(false);
  searchTerm = '';

  filteredStudents = computed(() => {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      return this.students();
    }

    return this.students().filter(student => {
      const firstName = student.firstName.toLowerCase();
      const lastName = student.lastName.toLowerCase();
      const fullName = `${firstName} ${lastName}`;

      return firstName.includes(term) ||
             lastName.includes(term) ||
             fullName.includes(term);
    });
  });

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadStudents();
    this.subscribeToStudents();
  }

  subscribeToStudents() {
    this.studentService.students$.subscribe({
      next: (students) => {
        this.students.set(students);
      }
    });
  }

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.loading.set(false);
      }
    });
  }

  onSearchChange() {
  }

  clearSearch() {
    this.searchTerm = '';
  }
}
