import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-progress-tracker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Seguimiento de Progreso</h1>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else if (data()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Evolución de Peso</h3>
            <canvas #weightChart></canvas>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Asistencia Semanal</h3>
            <canvas #attendanceChart></canvas>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progreso de Fuerza</h3>
            <canvas #strengthChart></canvas>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Metas Activas</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @for (goal of data()!.goals; track goal.id) {
              <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">{{ goal.title }}</h4>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Actual:</span>
                    <span class="font-medium">{{ goal.current }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Meta:</span>
                    <span class="font-medium">{{ goal.target }}</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div class="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
                         [style.width.%]="goal.progress"></div>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 text-center">{{ goal.progress }}% completado</p>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ProgressTrackerComponent implements OnInit, AfterViewInit {
  @ViewChild('weightChart') weightChartRef!: ElementRef;
  @ViewChild('attendanceChart') attendanceChartRef!: ElementRef;
  @ViewChild('strengthChart') strengthChartRef!: ElementRef;

  data = signal<any>(null);
  loading = signal(true);

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.get('/metrics/progress').subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.data()) this.createCharts();
    }, 100);
  }

  private createCharts() {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#e5e7eb' : '#374151';
    const gridColor = isDark ? '#374151' : '#e5e7eb';

    if (this.weightChartRef && this.data()?.weightHistory) {
      new Chart(this.weightChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: this.data().weightHistory.map((d: any) => d.date),
          datasets: [{
            label: 'Peso (kg)',
            data: this.data().weightHistory.map((d: any) => d.value),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: textColor } } },
          scales: {
            y: { ticks: { color: textColor }, grid: { color: gridColor } },
            x: { ticks: { color: textColor }, grid: { color: gridColor } }
          }
        }
      });
    }

    if (this.attendanceChartRef && this.data()?.attendanceHistory) {
      new Chart(this.attendanceChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: this.data().attendanceHistory.map((d: any) => d.week),
          datasets: [{
            label: 'Sesiones',
            data: this.data().attendanceHistory.map((d: any) => d.sessions),
            backgroundColor: '#22c55e'
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: textColor } } },
          scales: {
            y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } },
            x: { ticks: { color: textColor }, grid: { color: gridColor } }
          }
        }
      });
    }

    if (this.strengthChartRef && this.data()?.strengthHistory) {
      const datasets = this.data().strengthHistory.map((exercise: any, idx: number) => ({
        label: exercise.exercise,
        data: exercise.data.map((d: any) => d.value),
        borderColor: ['#8b5cf6', '#f59e0b'][idx] || '#3b82f6',
        tension: 0.4
      }));

      new Chart(this.strengthChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: this.data().strengthHistory[0].data.map((d: any) => d.date),
          datasets
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: textColor } } },
          scales: {
            y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } },
            x: { ticks: { color: textColor }, grid: { color: gridColor } }
          }
        }
      });
    }
  }
}
