import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface DashboardData {
  kpis: {
    totalStudents: number;
    routinesCreated: number;
    exercisesUsed: number;
    routinesAssigned: number;
  };
  routinesByMonth: Array<{ month: string; count: number }>;
  exercisesByType: Array<{ type: string; count: number }>;
  averageAttendance: Array<{ week: string; attendance: number }>;
}

@Component({
  selector: 'app-dashboard-advanced',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Avanzado</h1>
        <div class="flex space-x-3">
          <select class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="">Todos los gimnasios</option>
            <option value="gym-1">PowerFit Center</option>
            <option value="gym-2">Elite Training</option>
          </select>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else if (data()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                <svg class="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Alumnos</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ data()!.kpis.totalStudents }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Rutinas Creadas</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ data()!.kpis.routinesCreated }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-md p-3">
                <svg class="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Ejercicios Usados</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ data()!.kpis.exercisesUsed }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-md p-3">
                <svg class="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Rutinas Asignadas</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ data()!.kpis.routinesAssigned }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rutinas Creadas por Mes</h3>
            <canvas #routinesChart></canvas>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ejercicios por Tipo</h3>
            <canvas #exercisesChart></canvas>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Asistencia Promedio Semanal</h3>
            <canvas #attendanceChart></canvas>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class DashboardAdvancedComponent implements OnInit, AfterViewInit {
  @ViewChild('routinesChart') routinesChartRef!: ElementRef;
  @ViewChild('exercisesChart') exercisesChartRef!: ElementRef;
  @ViewChild('attendanceChart') attendanceChartRef!: ElementRef;

  data = signal<DashboardData | null>(null);
  loading = signal(true);

  private routinesChart?: Chart;
  private exercisesChart?: Chart;
  private attendanceChart?: Chart;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.get<DashboardData>('/metrics/dashboard').subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.data()) {
        this.createCharts();
      }
    }, 100);
  }

  private createCharts() {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#e5e7eb' : '#374151';
    const gridColor = isDark ? '#374151' : '#e5e7eb';

    if (this.routinesChartRef && this.data()) {
      this.routinesChart = new Chart(this.routinesChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: this.data()!.routinesByMonth.map(d => d.month),
          datasets: [{
            label: 'Rutinas',
            data: this.data()!.routinesByMonth.map(d => d.count),
            backgroundColor: '#22c55e',
            borderColor: '#16a34a',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: textColor } }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: textColor },
              grid: { color: gridColor }
            },
            x: {
              ticks: { color: textColor },
              grid: { color: gridColor }
            }
          }
        }
      });
    }

    if (this.exercisesChartRef && this.data()) {
      this.exercisesChart = new Chart(this.exercisesChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: this.data()!.exercisesByType.map(d => d.type),
          datasets: [{
            data: this.data()!.exercisesByType.map(d => d.count),
            backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: textColor } }
          }
        }
      });
    }

    if (this.attendanceChartRef && this.data()) {
      this.attendanceChart = new Chart(this.attendanceChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: this.data()!.averageAttendance.map(d => d.week),
          datasets: [{
            label: 'Asistencia (%)',
            data: this.data()!.averageAttendance.map(d => d.attendance),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: textColor } }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { color: textColor },
              grid: { color: gridColor }
            },
            x: {
              ticks: { color: textColor },
              grid: { color: gridColor }
            }
          }
        }
      });
    }
  }
}
