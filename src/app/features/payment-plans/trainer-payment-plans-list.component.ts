import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentPlanService } from '../../core/payment-plan.service';
import { PaymentPlan, PaymentPlanType } from '../../shared/models/payment.model';

@Component({
  selector: 'app-trainer-payment-plans-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Planes de Pago</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">Gestiona tus planes y asignaciones</p>
        </div>
        <button (click)="createPlan()"
                class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Crear Plan
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Planes</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ plans().length }}</p>
              </div>
              <div class="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Planes Activos</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ activePlans() }}</p>
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
                <p class="text-sm text-gray-600 dark:text-gray-400">Ver Asignaciones</p>
                <button (click)="viewAssignments()"
                        class="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1">
                  Gestionar alumnos
                </button>
              </div>
              <div class="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
                <svg class="h-6 w-6 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
                     placeholder="Buscar planes..."
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            </div>
            <div class="flex flex-wrap gap-3">
              <select [(ngModel)]="filterType"
                      (change)="applySearch()"
                      class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                <option value="">Todos los tipos</option>
                <option value="general">Generales</option>
                <option value="semi_custom">Semipersonalizados</option>
                <option value="custom">Personalizados</option>
              </select>
              <button (click)="clearFilters()"
                      class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Limpiar filtros
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (plan of filteredPlans(); track plan.id) {
              <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
                   [class.opacity-50]="!plan.isActive">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ plan.name }}</h3>
                      @if (!plan.isActive) {
                        <span class="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                          Inactivo
                        </span>
                      }
                    </div>
                    <span [class]="getPlanTypeClass(plan.type)"
                          class="text-xs font-medium px-2 py-1 rounded-full">
                      {{ getPlanTypeLabel(plan.type) }}
                    </span>
                  </div>
                  <button (click)="toggleExpanded(plan.id)"
                          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    <svg class="h-5 w-5" [class.rotate-180]="expandedPlanId() === plan.id"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{{ plan.description }}</p>

                <div class="space-y-2 mb-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Precio:</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ formatPrice(plan.basePrice) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Recurrencia:</span>
                    <span class="text-gray-900 dark:text-white">{{ getRecurrenceLabel(plan.recurrence) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Items:</span>
                    <span class="text-gray-900 dark:text-white">{{ plan.items.length }}</span>
                  </div>
                </div>

                @if (expandedPlanId() === plan.id) {
                  <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <p class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Items incluidos:</p>
                    <ul class="space-y-1">
                      @for (item of plan.items.slice(0, 5); track item.id) {
                        <li class="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <svg class="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{{ item.description }}</span>
                        </li>
                      }
                      @if (plan.items.length > 5) {
                        <li class="text-xs text-gray-500 dark:text-gray-500 italic">
                          Y {{ plan.items.length - 5 }} más...
                        </li>
                      }
                    </ul>
                  </div>
                }

                <div class="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button (click)="editPlan(plan.id)"
                          class="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors">
                    Editar
                  </button>
                  <button (click)="duplicatePlan(plan.id)"
                          class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button (click)="deletePlan(plan.id)"
                          class="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            } @empty {
              <div class="col-span-full py-12 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="mt-4 text-gray-600 dark:text-gray-300">No hay planes creados</p>
                <button (click)="createPlan()"
                        class="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors">
                  Crear tu primer plan
                </button>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class TrainerPaymentPlansListComponent implements OnInit {
  plans = signal<PaymentPlan[]>([]);
  loading = signal(true);
  searchTerm = '';
  filterType = '';
  expandedPlanId = signal<string | null>(null);

  filteredPlans = computed(() => {
    let result = this.plans();

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    if (this.filterType) {
      result = result.filter(p => p.type === this.filterType);
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  activePlans = computed(() => this.plans().filter(p => p.isActive).length);

  constructor(
    private paymentPlanService: PaymentPlanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.loading.set(true);
    this.paymentPlanService.getTrainerPlans().subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading plans:', err);
        this.loading.set(false);
      }
    });
  }

  applySearch() {
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterType = '';
  }

  toggleExpanded(planId: string) {
    this.expandedPlanId.set(this.expandedPlanId() === planId ? null : planId);
  }

  createPlan() {
    this.router.navigate(['/trainer/payment-plans/new']);
  }

  editPlan(id: string) {
    this.router.navigate(['/trainer/payment-plans/edit', id]);
  }

  duplicatePlan(id: string) {
    if (confirm('¿Deseas duplicar este plan?')) {
      this.paymentPlanService.duplicatePlan(id).subscribe({
        next: () => {
          this.loadPlans();
        },
        error: (err) => console.error('Error duplicating plan:', err)
      });
    }
  }

  deletePlan(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este plan?')) {
      this.paymentPlanService.deletePlan(id).subscribe({
        next: () => {
          this.loadPlans();
        },
        error: (err) => console.error('Error deleting plan:', err)
      });
    }
  }

  viewAssignments() {
    this.router.navigate(['/trainer/students/plans-overview']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  }

  getPlanTypeLabel(type: PaymentPlanType): string {
    const labels: Record<PaymentPlanType, string> = {
      'general': 'General',
      'semi_custom': 'Semipersonalizado',
      'custom': 'Personalizado'
    };
    return labels[type];
  }

  getPlanTypeClass(type: PaymentPlanType): string {
    const classes: Record<PaymentPlanType, string> = {
      'general': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      'semi_custom': 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
      'custom': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
    };
    return classes[type];
  }

  getRecurrenceLabel(recurrence: string): string {
    const labels: Record<string, string> = {
      'mensual': 'Mensual',
      'bimestral': 'Bimestral',
      'trimestral': 'Trimestral',
      'semestral': 'Semestral',
      'anual': 'Anual',
      'unico': 'Pago único'
    };
    return labels[recurrence] || recurrence;
  }
}
