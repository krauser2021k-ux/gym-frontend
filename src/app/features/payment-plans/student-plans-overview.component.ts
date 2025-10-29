import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentPlanService } from '../../core/payment-plan.service';
import { StudentPaymentPlanAssignment } from '../../shared/models/payment.model';

@Component({
  selector: 'app-student-plans-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Planes Asignados</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">Gestiona los planes de tus alumnos</p>
        </div>
        <button (click)="assignNewPlan()"
                class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Asignar Plan
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Asignaciones</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ assignments().length }}</p>
              </div>
              <div class="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Planes Activos</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ activeCount() }}</p>
              </div>
              <div class="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Pausados</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ pausedCount() }}</p>
              </div>
              <div class="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Ingreso Mensual</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ formatPrice(monthlyRevenue()) }}</p>
              </div>
              <div class="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
            <div class="flex-1">
              <input type="text"
                     [(ngModel)]="searchTerm"
                     (input)="applySearch()"
                     placeholder="Buscar por alumno o plan..."
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            </div>
            <div class="flex flex-wrap gap-3">
              <select [(ngModel)]="filterStatus"
                      (change)="applySearch()"
                      class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="paused">Pausados</option>
                <option value="cancelled">Cancelados</option>
                <option value="expired">Expirados</option>
              </select>
              <button (click)="clearFilters()"
                      class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Limpiar filtros
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Alumno</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Plan</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Precio</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Próximo Pago</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Estado</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (assignment of filteredAssignments(); track assignment.id) {
                  <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="py-3 px-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ assignment.studentName }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ assignment.items.length }} items</div>
                    </td>
                    <td class="py-3 px-4">
                      <div class="text-sm text-gray-900 dark:text-white">{{ assignment.planName }}</div>
                      <span [class]="getPlanTypeClass(assignment.planType)"
                            class="text-xs font-medium px-2 py-0.5 rounded-full">
                        {{ getPlanTypeLabel(assignment.planType) }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatPrice(assignment.finalPrice) }}</div>
                      @if (assignment.surcharges.length > 0) {
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ assignment.surcharges.length }} recargos</div>
                      }
                    </td>
                    <td class="py-3 px-4">
                      <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(assignment.nextPaymentDate) }}</div>
                      <div class="text-xs" [class]="getDaysUntilClass(assignment.nextPaymentDate)">
                        {{ getDaysUntilText(assignment.nextPaymentDate) }}
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <span [class]="getStatusClass(assignment.status)"
                            class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ getStatusLabel(assignment.status) }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex gap-2">
                        <button (click)="viewDetails(assignment.id)"
                                class="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Ver detalles">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        @if (assignment.status === 'active') {
                          <button (click)="pausePlan(assignment.id)"
                                  class="p-1 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                                  title="Pausar plan">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        }
                        @if (assignment.status === 'paused') {
                          <button (click)="activatePlan(assignment.id)"
                                  class="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                  title="Activar plan">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="py-8 text-center text-gray-600 dark:text-gray-300">
                      No hay planes asignados
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class StudentPlansOverviewComponent implements OnInit {
  assignments = signal<StudentPaymentPlanAssignment[]>([]);
  loading = signal(true);
  searchTerm = '';
  filterStatus = '';

  filteredAssignments = computed(() => {
    let result = this.assignments();

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(a =>
        a.studentName.toLowerCase().includes(term) ||
        a.planName.toLowerCase().includes(term)
      );
    }

    if (this.filterStatus) {
      result = result.filter(a => a.status === this.filterStatus);
    }

    return result.sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime());
  });

  activeCount = computed(() => this.assignments().filter(a => a.status === 'active').length);
  pausedCount = computed(() => this.assignments().filter(a => a.status === 'paused').length);

  monthlyRevenue = computed(() => {
    return this.assignments()
      .filter(a => a.status === 'active' && a.recurrence === 'mensual')
      .reduce((sum, a) => sum + a.finalPrice, 0);
  });

  constructor(
    private paymentPlanService: PaymentPlanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAssignments();
  }

  loadAssignments() {
    this.loading.set(true);
    this.paymentPlanService.getStudentAssignments().subscribe({
      next: (assignments) => {
        this.assignments.set(assignments);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading assignments:', err);
        this.loading.set(false);
      }
    });
  }

  applySearch() {
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterStatus = '';
  }

  assignNewPlan() {
    this.router.navigate(['/trainer/payment-plans/assign']);
  }

  viewDetails(assignmentId: string) {
    this.router.navigate(['/trainer/student-plan-detail', assignmentId]);
  }

  pausePlan(assignmentId: string) {
    if (confirm('¿Deseas pausar este plan?')) {
      this.paymentPlanService.updateStudentPlanStatus(assignmentId, 'paused').subscribe({
        next: () => this.loadAssignments(),
        error: (err) => console.error('Error pausing plan:', err)
      });
    }
  }

  activatePlan(assignmentId: string) {
    this.paymentPlanService.updateStudentPlanStatus(assignmentId, 'active').subscribe({
      next: () => this.loadAssignments(),
      error: (err) => console.error('Error activating plan:', err)
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getDaysUntilText(dateString: string): string {
    const days = Math.ceil((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Vencido';
    if (days === 0) return 'Vence hoy';
    if (days === 1) return 'Mañana';
    return `En ${days} días`;
  }

  getDaysUntilClass(dateString: string): string {
    const days = Math.ceil((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'text-red-600 dark:text-red-400';
    if (days <= 7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-500 dark:text-gray-400';
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'active': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      'paused': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
      'cancelled': 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
      'expired': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    };
    return classes[status] || 'bg-gray-100 dark:bg-gray-700';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'active': 'Activo',
      'paused': 'Pausado',
      'cancelled': 'Cancelado',
      'expired': 'Expirado'
    };
    return labels[status] || status;
  }

  getPlanTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'general': 'General',
      'semi_custom': 'Semipersonalizado',
      'custom': 'Personalizado'
    };
    return labels[type] || type;
  }

  getPlanTypeClass(type: string): string {
    const classes: Record<string, string> = {
      'general': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      'semi_custom': 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
      'custom': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
    };
    return classes[type] || 'bg-gray-100 dark:bg-gray-700';
  }
}
