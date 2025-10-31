import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StudentPaymentService } from '../../core/student-payment.service';
import { StudentPaymentHistory, StudentPaymentSummary } from '../../shared/models/payment.model';

@Component({
  selector: 'app-student-payment-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Historial de Pagos</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">Consulta y gestiona tus pagos realizados</p>
        </div>
        <a routerLink="/student/payments/plans"
           class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Ver Planes
        </a>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-100">Total Gastado</p>
                <p class="text-2xl font-bold mt-1">{{ formatPrice(summary().totalSpent) }}</p>
              </div>
              <div class="bg-white/20 p-3 rounded-full">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-100">Pagos Realizados</p>
                <p class="text-2xl font-bold mt-1">{{ summary().totalPayments }}</p>
              </div>
              <div class="bg-white/20 p-3 rounded-full">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-orange-100">Próximo Pago</p>
                <p class="text-2xl font-bold mt-1">{{ formatPrice(summary().nextPaymentAmount) }}</p>
                <p class="text-xs text-orange-100 mt-1">{{ formatDate(summary().nextPaymentDate) }}</p>
              </div>
              <div class="bg-white/20 p-3 rounded-full">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div [class]="getAccountStatusClass()"
               class="rounded-lg shadow-md p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-90">Estado de Cuenta</p>
                <p class="text-2xl font-bold mt-1">{{ getAccountStatusLabel() }}</p>
              </div>
              <div class="bg-white/20 p-3 rounded-full">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                     (input)="applyFilters()"
                     placeholder="Buscar por concepto o descripción..."
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            </div>
            <div class="flex flex-wrap gap-3">
              <select [(ngModel)]="statusFilter"
                      (change)="applyFilters()"
                      class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                <option value="">Todos los estados</option>
                <option value="approved">Aprobado</option>
                <option value="pending">Pendiente</option>
                <option value="rejected">Rechazado</option>
                <option value="cancelled">Cancelado</option>
              </select>
              <button (click)="clearFilters()"
                      class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Limpiar filtros
              </button>
            </div>
          </div>

          <div class="hidden lg:block overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Fecha</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Concepto</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Monto</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Método</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Estado</th>
                  <th class="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (payment of paginatedPayments(); track payment.id) {
                  <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                      {{ formatDate(payment.paymentDate) }}
                    </td>
                    <td class="py-3 px-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ payment.packName }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ payment.description }}</div>
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-900 dark:text-white font-semibold">
                      {{ formatPrice(payment.amount) }}
                    </td>
                    <td class="py-3 px-4 text-sm">
                      <span [class]="getPaymentMethodClass(payment.paymentMethod)"
                            class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ getPaymentMethodLabel(payment.paymentMethod) }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <span [class]="getStatusClass(payment.status)"
                            class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ getStatusLabel(payment.status) }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      @if (payment.status === 'approved') {
                        <button (click)="downloadReceipt(payment.id)"
                                class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                          Descargar recibo
                        </button>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="py-8 text-center text-gray-600 dark:text-gray-300">
                      No hay pagos registrados que coincidan con los filtros
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="lg:hidden space-y-4">
            @for (payment of paginatedPayments(); track payment.id) {
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ payment.packName }}</span>
                  <span [class]="getStatusClass(payment.status)"
                        class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusLabel(payment.status) }}
                  </span>
                </div>
                <div class="space-y-1">
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ payment.description }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    <span class="font-medium">Fecha:</span> {{ formatDate(payment.paymentDate) }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    <span class="font-medium">Método:</span> {{ getPaymentMethodLabel(payment.paymentMethod) }}
                  </p>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ formatPrice(payment.amount) }}
                  </p>
                  @if (payment.status === 'approved') {
                    <button (click)="downloadReceipt(payment.id)"
                            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                      Descargar
                    </button>
                  }
                </div>
              </div>
            } @empty {
              <p class="py-8 text-center text-gray-600 dark:text-gray-300">
                No hay pagos registrados que coincidan con los filtros
              </p>
            }
          </div>

          @if (totalPages() > 1) {
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div class="text-sm text-gray-600 dark:text-gray-300">
                Mostrando {{ (currentPage() - 1) * pageSize() + 1 }} - {{ Math.min(currentPage() * pageSize(), filteredPayments().length) }} de {{ filteredPayments().length }} pagos
              </div>
              <div class="flex items-center gap-2">
                <button (click)="goToPage(currentPage() - 1)"
                        [disabled]="currentPage() === 1"
                        [class.opacity-50]="currentPage() === 1"
                        [class.cursor-not-allowed]="currentPage() === 1"
                        class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:hover:bg-white dark:disabled:hover:bg-gray-700">
                  Anterior
                </button>
                @for (page of pages(); track page) {
                  @if (page === -1) {
                    <span class="px-3 py-2 text-gray-500">...</span>
                  } @else {
                    <button (click)="goToPage(page)"
                            [class.bg-blue-600]="currentPage() === page"
                            [class.text-white]="currentPage() === page"
                            [class.hover:bg-blue-700]="currentPage() === page"
                            [class.dark:bg-blue-500]="currentPage() === page"
                            [class.bg-white]="currentPage() !== page"
                            [class.dark:bg-gray-700]="currentPage() !== page"
                            [class.text-gray-700]="currentPage() !== page"
                            [class.dark:text-gray-300]="currentPage() !== page"
                            [class.hover:bg-gray-50]="currentPage() !== page"
                            [class.dark:hover:bg-gray-600]="currentPage() !== page"
                            class="px-3 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg transition-colors">
                      {{ page }}
                    </button>
                  }
                }
                <button (click)="goToPage(currentPage() + 1)"
                        [disabled]="currentPage() === totalPages()"
                        [class.opacity-50]="currentPage() === totalPages()"
                        [class.cursor-not-allowed]="currentPage() === totalPages()"
                        class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:hover:bg-white dark:disabled:hover:bg-gray-700">
                  Siguiente
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class StudentPaymentHistoryComponent implements OnInit {
  Math = Math;
  payments = signal<StudentPaymentHistory[]>([]);
  summary = signal<StudentPaymentSummary>({
    currentBalance: 0,
    nextPaymentAmount: 0,
    nextPaymentDate: '',
    totalSpent: 0,
    totalPayments: 0,
    pendingAmount: 0,
    accountStatus: 'up_to_date',
    activeSince: ''
  });
  loading = signal(true);
  searchTerm = '';
  statusFilter = '';
  currentPage = signal(1);
  pageSize = signal(10);

  filteredPayments = computed(() => {
    let result = this.payments();

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.packName.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter) {
      result = result.filter(p => p.status === this.statusFilter);
    }

    return result.sort((a, b) =>
      new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
  });

  paginatedPayments = computed(() => {
    const filtered = this.filteredPayments();
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredPayments().length / this.pageSize());
  });

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, -1, total);
      } else if (current >= total - 2) {
        pages.push(1, -1, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, -1, current - 1, current, current + 1, -1, total);
      }
    }

    return pages;
  });

  constructor(private paymentService: StudentPaymentService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    this.paymentService.getPaymentHistory().subscribe({
      next: (data) => {
        this.payments.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading payment history:', err);
        this.loading.set(false);
      }
    });

    this.paymentService.getPaymentSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
      },
      error: (err) => console.error('Error loading payment summary:', err)
    });
  }

  applyFilters() {
    this.currentPage.set(1);
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  downloadReceipt(paymentId: string) {
    this.paymentService.downloadReceipt(paymentId);
    alert('Descargando comprobante...');
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

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'approved': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      'pending': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
      'rejected': 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
      'cancelled': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    };
    return classes[status] || 'bg-gray-100 dark:bg-gray-700';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'approved': 'Aprobado',
      'pending': 'Pendiente',
      'rejected': 'Rechazado',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }

  getPaymentMethodClass(method: string): string {
    const classes: Record<string, string> = {
      'cash': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      'transfer': 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
      'card': 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300',
      'mercadopago': 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300'
    };
    return classes[method] || 'bg-gray-100 dark:bg-gray-700';
  }

  getPaymentMethodLabel(method: string): string {
    const labels: Record<string, string> = {
      'cash': 'Efectivo',
      'transfer': 'Transferencia',
      'card': 'Tarjeta',
      'mercadopago': 'MercadoPago'
    };
    return labels[method] || method;
  }

  getAccountStatusClass(): string {
    const status = this.summary().accountStatus;
    const classes: Record<string, string> = {
      'up_to_date': 'bg-gradient-to-br from-green-500 to-green-600',
      'pending': 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'overdue': 'bg-gradient-to-br from-red-500 to-red-600'
    };
    return classes[status] || 'bg-gradient-to-br from-gray-500 to-gray-600';
  }

  getAccountStatusLabel(): string {
    const status = this.summary().accountStatus;
    const labels: Record<string, string> = {
      'up_to_date': 'Al día',
      'pending': 'Pendiente',
      'overdue': 'Vencido'
    };
    return labels[status] || 'Desconocido';
  }
}
