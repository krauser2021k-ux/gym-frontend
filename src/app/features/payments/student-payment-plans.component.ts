import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { StudentPaymentService } from '../../core/student-payment.service';
import { PaymentPack, StudentSubscription } from '../../shared/models/payment.model';

@Component({
  selector: 'app-student-payment-plans',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Planes Disponibles</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">Elige el plan que mejor se adapte a tus objetivos</p>
      </div>

      @if (currentSubscription()) {
        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg class="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <h3 class="text-sm font-semibold text-green-900 dark:text-green-100">Plan Activo: {{ currentSubscription()!.packName }}</h3>
              <p class="text-sm text-green-700 dark:text-green-300 mt-1">
                Próxima renovación: {{ formatDate(currentSubscription()!.nextPaymentDate) }}
                @if (currentSubscription()!.autoRenew) {
                  <span class="ml-2 text-xs">(Renovación automática activada)</span>
                }
              </p>
            </div>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (pack of packs(); track pack.id) {
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                 [class.ring-2]="isCurrentPlan(pack.id)"
                 [class.ring-blue-500]="isCurrentPlan(pack.id)"
                 [class.ring-4]="pack.name === 'Pack Premium' && !isCurrentPlan(pack.id)"
                 [class.ring-orange-400]="pack.name === 'Pack Premium' && !isCurrentPlan(pack.id)">

              @if (pack.name === 'Pack Premium' && !isCurrentPlan(pack.id)) {
                <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-2 text-sm font-bold">
                  MÁS POPULAR
                </div>
              }

              @if (isCurrentPlan(pack.id)) {
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-2 text-sm font-bold">
                  TU PLAN ACTUAL
                </div>
              }

              <div class="p-6">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ pack.name }}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-6 min-h-[40px]">{{ pack.description }}</p>

                <div class="mb-6">
                  <div class="flex items-baseline gap-2">
                    <span class="text-4xl font-bold text-gray-900 dark:text-white">{{ formatPrice(pack.price) }}</span>
                    <span class="text-gray-600 dark:text-gray-300">/mes</span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ pack.duration }} días de acceso</p>
                </div>

                <ul class="space-y-3 mb-8">
                  @for (feature of pack.features; track feature) {
                    <li class="flex items-start gap-2">
                      <svg class="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span class="text-sm text-gray-700 dark:text-gray-300">{{ feature }}</span>
                    </li>
                  }
                </ul>

                @if (isCurrentPlan(pack.id)) {
                  <button
                    class="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                    disabled>
                    Plan Actual
                  </button>
                } @else {
                  <button (click)="selectPack(pack)"
                          [disabled]="processingPayment()"
                          [class.opacity-50]="processingPayment()"
                          [class.cursor-not-allowed]="processingPayment()"
                          [class.bg-gradient-to-r]="pack.name === 'Pack Premium'"
                          [class.from-orange-500]="pack.name === 'Pack Premium'"
                          [class.to-orange-600]="pack.name === 'Pack Premium'"
                          [class.hover:from-orange-600]="pack.name === 'Pack Premium'"
                          [class.hover:to-orange-700]="pack.name === 'Pack Premium'"
                          [class.bg-blue-600]="pack.name !== 'Pack Premium'"
                          [class.hover:bg-blue-700]="pack.name !== 'Pack Premium'"
                          [class.dark:bg-blue-500]="pack.name !== 'Pack Premium'"
                          [class.dark:hover:bg-blue-600]="pack.name !== 'Pack Premium'"
                          class="w-full text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2">
                    @if (processingPayment()) {
                      <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Procesando...</span>
                    } @else {
                      <span>{{ currentSubscription() ? 'Cambiar a este Plan' : 'Elegir Plan' }}</span>
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    }
                  </button>
                }
              </div>
            </div>
          }
        </div>

        <div class="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Preguntas Frecuentes
          </h2>
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-1">¿Puedo cambiar de plan en cualquier momento?</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">Sí, puedes cambiar tu plan cuando quieras. Si cambias a un plan superior, solo pagarás la diferencia prorrateada.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-1">¿Cómo funciona la renovación automática?</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">Tu plan se renovará automáticamente cada mes usando tu método de pago guardado. Puedes desactivar la renovación automática en cualquier momento desde tu historial de pagos.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-1">¿Qué métodos de pago aceptan?</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">Aceptamos tarjetas de crédito/débito, MercadoPago, transferencia bancaria y efectivo en el gimnasio.</p>
            </div>
          </div>
        </div>

        <div class="text-center">
          <a routerLink="/student/payments/history"
             class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ver mi historial de pagos
          </a>
        </div>
      }
    </div>
  `,
  styles: []
})
export class StudentPaymentPlansComponent implements OnInit {
  packs = signal<PaymentPack[]>([]);
  currentSubscription = signal<StudentSubscription | null>(null);
  loading = signal(true);
  processingPayment = signal(false);

  constructor(
    private paymentService: StudentPaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    this.paymentService.getAvailablePacks().subscribe({
      next: (packs) => {
        this.packs.set(packs);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading packs:', err);
        this.loading.set(false);
      }
    });

    this.paymentService.getMySubscription().subscribe({
      next: (subscription) => {
        this.currentSubscription.set(subscription);
      },
      error: (err) => console.error('Error loading subscription:', err)
    });
  }

  isCurrentPlan(packId: string): boolean {
    return this.currentSubscription()?.packId === packId;
  }

  selectPack(pack: PaymentPack) {
    if (this.processingPayment()) return;

    const confirmed = confirm(`¿Confirmas que deseas contratar el plan "${pack.name}" por ${this.formatPrice(pack.price)}/mes?`);
    if (!confirmed) return;

    this.processingPayment.set(true);

    this.paymentService.createCheckout({
      packId: pack.id,
      amount: pack.price,
      autoRenew: true
    }).subscribe({
      next: (response) => {
        window.open(response.checkoutUrl, '_blank');

        setTimeout(() => {
          this.processingPayment.set(false);
          const success = confirm('¿Se completó el pago exitosamente?');
          if (success) {
            alert('¡Pago confirmado! Tu plan ha sido activado.');
            this.loadData();
          }
        }, 3000);
      },
      error: (err) => {
        console.error('Error creating checkout:', err);
        alert('Hubo un error al procesar el pago. Por favor intenta nuevamente.');
        this.processingPayment.set(false);
      }
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
      month: 'long',
      day: 'numeric'
    });
  }
}
