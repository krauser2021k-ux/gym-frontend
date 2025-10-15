import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';

interface Metrics {
  activeStudents: number;
  totalRoutines: number;
  totalExercises: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  studentGrowth: Array<{ month: string; count: number }>;
  revenueByMonth: Array<{ month: string; amount: number }>;
  topExercises: Array<{ name: string; usage: number }>;
  subscriptionsByPack: Array<{ pack: string; count: number }>;
  completionRate: number;
  averageSessionsPerWeek: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-white">Dashboard</h1>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      } @else if (metrics()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="glass rounded-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 rounded-md p-3" style="background: rgba(22, 163, 74, 0.3);">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-white/70 truncate">Alumnos Activos</dt>
                  <dd class="text-3xl font-semibold text-white">{{ metrics()!.activeStudents }}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="glass rounded-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 rounded-md p-3" style="background: rgba(34, 197, 94, 0.3);">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-white/70 truncate">Rutinas Creadas</dt>
                  <dd class="text-3xl font-semibold text-white">{{ metrics()!.totalRoutines }}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="glass rounded-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 rounded-md p-3" style="background: rgba(59, 130, 246, 0.3);">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-white/70 truncate">Ejercicios Totales</dt>
                  <dd class="text-3xl font-semibold text-white">{{ metrics()!.totalExercises }}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="glass rounded-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 rounded-md p-3" style="background: rgba(245, 158, 11, 0.3);">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-white/70 truncate">Ingresos Mensuales</dt>
                  <dd class="text-3xl font-semibold text-white">{{ formatCurrency(metrics()!.monthlyRevenue) }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="glass rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Crecimiento de Alumnos</h3>
            <div class="space-y-3">
              @for (item of metrics()!.studentGrowth; track item.month) {
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-medium text-white/80">{{ item.month }}</span>
                    <span class="text-sm font-semibold text-white">{{ item.count }}</span>
                  </div>
                  <div class="w-full rounded-full h-2" style="background: rgba(255, 255, 255, 0.2);">
                    <div class="h-2 rounded-full transition-all duration-500" style="background: rgba(34, 197, 94, 0.8);"
                         [style.width.%]="(item.count / 40) * 100"></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="glass rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Ejercicios Más Utilizados</h3>
            <div class="space-y-3">
              @for (exercise of metrics()!.topExercises; track exercise.name) {
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-medium text-white/80">{{ exercise.name }}</span>
                    <span class="text-sm font-semibold text-white">{{ exercise.usage }}</span>
                  </div>
                  <div class="w-full rounded-full h-2" style="background: rgba(255, 255, 255, 0.2);">
                    <div class="h-2 rounded-full transition-all duration-500" style="background: rgba(59, 130, 246, 0.8);"
                         [style.width.%]="(exercise.usage / 150) * 100"></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="glass rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Ingresos por Mes</h3>
            <div class="space-y-3">
              @for (item of metrics()!.revenueByMonth; track item.month) {
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-white/80">{{ item.month }}</span>
                  <span class="text-sm font-semibold text-white">{{ formatCurrency(item.amount) }}</span>
                </div>
              }
            </div>
          </div>

          <div class="glass rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Suscripciones por Pack</h3>
            <div class="space-y-4">
              @for (sub of metrics()!.subscriptionsByPack; track sub.pack) {
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                         [class]="getPackColorClass(sub.pack)">
                      <span class="text-lg font-bold">{{ sub.count }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-white">Pack {{ sub.pack }}</p>
                      <p class="text-xs text-white/70">{{ getPackPercentage(sub.count) }}% del total</p>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="glass rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-2">Tasa de Completación</h3>
            <div class="flex items-center justify-center py-8">
              <div class="relative inline-flex items-center justify-center w-32 h-32">
                <svg class="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" stroke-width="8" fill="none"
                          class="text-white/20" />
                  <circle cx="64" cy="64" r="56" stroke="currentColor" stroke-width="8" fill="none"
                          [attr.stroke-dasharray]="calculateCircleProgress(metrics()!.completionRate)"
                          class="text-white transition-all duration-1000" />
                </svg>
                <span class="absolute text-3xl font-bold text-white">{{ metrics()!.completionRate }}%</span>
              </div>
            </div>
          </div>

          <div class="glass rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-2">Promedio de Sesiones por Semana</h3>
            <div class="flex items-center justify-center py-8">
              <div class="text-center">
                <div class="text-5xl font-bold text-white">{{ metrics()!.averageSessionsPerWeek }}</div>
                <p class="text-sm text-white/70 mt-2">sesiones por semana</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  metrics = signal<Metrics | null>(null);
  loading = signal(true);

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.get<Metrics>('/metrics').subscribe({
      next: (data) => {
        this.metrics.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading metrics:', err);
        this.loading.set(false);
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getPackColorClass(pack: string): string {
    const classes: Record<string, string> = {
      'Básico': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      'Premium': 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300',
      'Elite': 'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300'
    };
    return classes[pack] || 'bg-gray-100 dark:bg-gray-700';
  }

  getPackPercentage(count: number): number {
    const total = this.metrics()?.subscriptionsByPack.reduce((sum, s) => sum + s.count, 0) || 1;
    return Math.round((count / total) * 100);
  }

  calculateCircleProgress(percentage: number): string {
    const circumference = 2 * Math.PI * 56;
    const progress = (percentage / 100) * circumference;
    return `${progress} ${circumference}`;
  }
}
