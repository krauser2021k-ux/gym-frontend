import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';

interface PaymentPack {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: string[];
}

@Component({
  selector: 'app-payments-checkout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Planes y Pagos</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">Elige el plan que mejor se adapte a tus necesidades</p>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (pack of packs(); track pack.id) {
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden"
                 [class.ring-2]="pack.name === 'Pack Premium'"
                 [class.ring-primary-600]="pack.name === 'Pack Premium'">
              @if (pack.name === 'Pack Premium') {
                <div class="bg-primary-600 text-white text-center py-2 text-sm font-semibold">
                  MÁS POPULAR
                </div>
              }
              <div class="p-6">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ pack.name }}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">{{ pack.description }}</p>

                <div class="mb-6">
                  <span class="text-4xl font-bold text-gray-900 dark:text-white">{{ formatPrice(pack.price) }}</span>
                  <span class="text-gray-600 dark:text-gray-300 ml-2">/mes</span>
                </div>

                <ul class="space-y-3 mb-6">
                  @for (feature of pack.features; track feature) {
                    <li class="flex items-start">
                      <svg class="h-5 w-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span class="text-sm text-gray-600 dark:text-gray-300">{{ feature }}</span>
                    </li>
                  }
                </ul>

                <button (click)="selectPack(pack)"
                        [class.bg-primary-600]="pack.name === 'Pack Premium'"
                        [class.hover:bg-primary-700]="pack.name === 'Pack Premium'"
                        [class.bg-gray-900]="pack.name !== 'Pack Premium'"
                        [class.hover:bg-gray-800]="pack.name !== 'Pack Premium'"
                        [class.dark:bg-primary-500]="pack.name === 'Pack Premium'"
                        [class.dark:hover:bg-primary-600]="pack.name === 'Pack Premium'"
                        [class.dark:bg-gray-700]="pack.name !== 'Pack Premium'"
                        [class.dark:hover:bg-gray-600]="pack.name !== 'Pack Premium'"
                        class="w-full text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg">
                  Elegir Plan
                </button>
              </div>
            </div>
          }
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Historial de Pagos</h2>

          @if (paymentHistory().length > 0) {
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Fecha</th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Plan</th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Monto</th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (payment of paymentHistory(); track payment.id) {
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                      <td class="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                        {{ formatDate(payment.createdAt) }}
                      </td>
                      <td class="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {{ payment.packName }}
                      </td>
                      <td class="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                        {{ formatPrice(payment.amount) }}
                      </td>
                      <td class="py-3 px-4">
                        <span [class]="getStatusClass(payment.status)"
                              class="px-2 py-1 text-xs font-medium rounded-full">
                          {{ getStatusLabel(payment.status) }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <p class="text-gray-600 dark:text-gray-300 text-center py-8">No hay pagos registrados</p>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class PaymentsCheckoutComponent implements OnInit {
  packs = signal<PaymentPack[]>([]);
  paymentHistory = signal<any[]>([]);
  loading = signal(true);

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.apiService.get<PaymentPack[]>('/payments/packs').subscribe({
      next: (data) => {
        this.packs.set(data);
        this.loading.set(false);
      },
      error: (err) => console.error('Error loading packs:', err)
    });

    this.apiService.get<any[]>('/payments/history').subscribe({
      next: (data) => {
        this.paymentHistory.set(data);
      },
      error: (err) => console.error('Error loading payment history:', err)
    });
  }

  selectPack(pack: PaymentPack) {
    this.apiService.post<{ id: string; checkoutUrl: string }>('/payments/create', {
      packId: pack.id,
      amount: pack.price
    }).subscribe({
      next: (response) => {
        window.open(response.checkoutUrl, '_blank');
        setTimeout(() => {
          alert('Pago confirmado (simulado)');
          this.ngOnInit();
        }, 3000);
      },
      error: (err) => console.error('Error creating payment:', err)
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

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'approved': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      'pending': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
      'rejected': 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
    };
    return classes[status] || 'bg-gray-100 dark:bg-gray-700';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'approved': 'Aprobado',
      'pending': 'Pendiente',
      'rejected': 'Rechazado'
    };
    return labels[status] || status;
  }
}
