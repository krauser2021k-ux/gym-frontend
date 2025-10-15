import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Reportes y Exportación</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reporte de Alumnos</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Exporta la lista completa de alumnos</p>
          <div class="flex space-x-2">
            <button (click)="exportStudentsCSV()"
                    class="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm">
              CSV
            </button>
            <button (click)="exportStudentsPDF()"
                    class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">
              PDF
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reporte de Rutinas</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Exporta todas las rutinas creadas</p>
          <div class="flex space-x-2">
            <button (click)="exportRoutinesCSV()"
                    class="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm">
              CSV
            </button>
            <button (click)="exportRoutinesPDF()"
                    class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">
              PDF
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reporte de Ejercicios</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Exporta el catálogo de ejercicios</p>
          <div class="flex space-x-2">
            <button (click)="exportExercisesCSV()"
                    class="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm">
              CSV
            </button>
            <button (click)="exportExercisesPDF()"
                    class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">
              PDF
            </button>
          </div>
        </div>
      </div>

      @if (exporting()) {
        <div class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p class="text-blue-800 dark:text-blue-200">Generando reporte...</p>
        </div>
      }

      @if (lastExport()) {
        <div class="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <p class="text-green-800 dark:text-green-200">✓ Reporte generado exitosamente: {{ lastExport() }}</p>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ReportsComponent {
  exporting = signal(false);
  lastExport = signal('');

  constructor(private apiService: ApiService) {}

  exportStudentsCSV() {
    this.exporting.set(true);
    this.apiService.get<any[]>('/students').subscribe({
      next: (students) => {
        const csv = this.convertToCSV(students, ['firstName', 'lastName', 'email', 'phone']);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'alumnos.csv');
        this.exporting.set(false);
        this.lastExport.set('alumnos.csv');
      },
      error: () => this.exporting.set(false)
    });
  }

  exportStudentsPDF() {
    this.exporting.set(true);
    this.apiService.get<any[]>('/students').subscribe({
      next: (students) => {
        const doc = new jsPDF();
        doc.text('Reporte de Alumnos', 20, 20);
        let y = 40;
        students.forEach(s => {
          doc.text(`${s.firstName} ${s.lastName} - ${s.email}`, 20, y);
          y += 10;
        });
        doc.save('alumnos.pdf');
        this.exporting.set(false);
        this.lastExport.set('alumnos.pdf');
      },
      error: () => this.exporting.set(false)
    });
  }

  exportRoutinesCSV() {
    this.exporting.set(true);
    this.apiService.get<any[]>('/routines').subscribe({
      next: (routines) => {
        const csv = this.convertToCSV(routines, ['name', 'description', 'type']);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'rutinas.csv');
        this.exporting.set(false);
        this.lastExport.set('rutinas.csv');
      },
      error: () => this.exporting.set(false)
    });
  }

  exportRoutinesPDF() {
    this.exporting.set(true);
    this.apiService.get<any[]>('/routines').subscribe({
      next: (routines) => {
        const doc = new jsPDF();
        doc.text('Reporte de Rutinas', 20, 20);
        let y = 40;
        routines.forEach(r => {
          doc.text(`${r.name} - ${r.type}`, 20, y);
          y += 10;
        });
        doc.save('rutinas.pdf');
        this.exporting.set(false);
        this.lastExport.set('rutinas.pdf');
      },
      error: () => this.exporting.set(false)
    });
  }

  exportExercisesCSV() {
    this.exporting.set(true);
    this.apiService.get<any[]>('/exercises').subscribe({
      next: (exercises) => {
        const csv = this.convertToCSV(exercises, ['name', 'category', 'difficulty']);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'ejercicios.csv');
        this.exporting.set(false);
        this.lastExport.set('ejercicios.csv');
      },
      error: () => this.exporting.set(false)
    });
  }

  exportExercisesPDF() {
    this.exporting.set(true);
    this.apiService.get<any[]>('/exercises').subscribe({
      next: (exercises) => {
        const doc = new jsPDF();
        doc.text('Reporte de Ejercicios', 20, 20);
        let y = 40;
        exercises.forEach(e => {
          doc.text(`${e.name} - ${e.category}`, 20, y);
          y += 10;
        });
        doc.save('ejercicios.pdf');
        this.exporting.set(false);
        this.lastExport.set('ejercicios.pdf');
      },
      error: () => this.exporting.set(false)
    });
  }

  private convertToCSV(data: any[], fields: string[]): string {
    const header = fields.join(',');
    const rows = data.map(item => fields.map(f => item[f] || '').join(','));
    return [header, ...rows].join('\n');
  }
}
