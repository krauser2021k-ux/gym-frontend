import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { PaymentMethod, PaymentStatus, PaymentPack } from '../../shared/models/payment.model';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-trainer-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="flex items-center gap-4">
        <button (click)="goBack()"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <svg class="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Registrar Pago</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1">Ingresa los datos del pago recibido</p>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else {
        <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alumno <span class="text-red-500">*</span>
              </label>
              <select formControlName="studentId"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      [class.border-red-500]="paymentForm.get('studentId')?.invalid && paymentForm.get('studentId')?.touched">
                <option value="">Selecciona un alumno</option>
                @for (student of students(); track student.id) {
                  <option [value]="student.id">{{ student.firstName }} {{ student.lastName }}</option>
                }
              </select>
              @if (paymentForm.get('studentId')?.invalid && paymentForm.get('studentId')?.touched) {
                <p class="mt-1 text-sm text-red-500">El alumno es obligatorio</p>
              }
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pack/Servicio
              </label>
              <select formControlName="packId"
                      (change)="onPackChange()"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                <option value="">Servicio personalizado</option>
                @for (pack of packs(); track pack.id) {
                  <option [value]="pack.id">{{ pack.name }} - {{ formatPrice(pack.price) }}</option>
                }
              </select>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Selecciona un pack o deja vacío para servicio personalizado</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Pack/Servicio <span class="text-red-500">*</span>
              </label>
              <input type="text"
                     formControlName="packName"
                     placeholder="Ej: Pack Premium, Clase particular, etc."
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                     [class.border-red-500]="paymentForm.get('packName')?.invalid && paymentForm.get('packName')?.touched">
              @if (paymentForm.get('packName')?.invalid && paymentForm.get('packName')?.touched) {
                <p class="mt-1 text-sm text-red-500">El nombre es obligatorio</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                <input type="number"
                       formControlName="amount"
                       placeholder="0"
                       min="0"
                       step="100"
                       class="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                       [class.border-red-500]="paymentForm.get('amount')?.invalid && paymentForm.get('amount')?.touched">
              </div>
              @if (paymentForm.get('amount')?.invalid && paymentForm.get('amount')?.touched) {
                <p class="mt-1 text-sm text-red-500">El monto debe ser mayor a 0</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Pago <span class="text-red-500">*</span>
              </label>
              <input type="date"
                     formControlName="paymentDate"
                     [max]="maxDate"
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                     [class.border-red-500]="paymentForm.get('paymentDate')?.invalid && paymentForm.get('paymentDate')?.touched">
              @if (paymentForm.get('paymentDate')?.invalid && paymentForm.get('paymentDate')?.touched) {
                <p class="mt-1 text-sm text-red-500">La fecha es obligatoria y no puede ser futura</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Método de Pago <span class="text-red-500">*</span>
              </label>
              <select formControlName="paymentMethod"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      [class.border-red-500]="paymentForm.get('paymentMethod')?.invalid && paymentForm.get('paymentMethod')?.touched">
                <option value="">Selecciona un método</option>
                <option value="cash">Efectivo</option>
                <option value="transfer">Transferencia</option>
                <option value="card">Tarjeta</option>
                <option value="mercadopago">MercadoPago</option>
              </select>
              @if (paymentForm.get('paymentMethod')?.invalid && paymentForm.get('paymentMethod')?.touched) {
                <p class="mt-1 text-sm text-red-500">El método de pago es obligatorio</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado <span class="text-red-500">*</span>
              </label>
              <select formControlName="status"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      [class.border-red-500]="paymentForm.get('status')?.invalid && paymentForm.get('status')?.touched">
                <option value="">Selecciona un estado</option>
                <option value="approved">Aprobado</option>
                <option value="pending">Pendiente</option>
                <option value="rejected">Rechazado</option>
                <option value="cancelled">Cancelado</option>
              </select>
              @if (paymentForm.get('status')?.invalid && paymentForm.get('status')?.touched) {
                <p class="mt-1 text-sm text-red-500">El estado es obligatorio</p>
              }
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción / Notas
              </label>
              <textarea formControlName="description"
                        rows="3"
                        placeholder="Información adicional sobre el pago..."
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"></textarea>
            </div>
          </div>

          @if (error()) {
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="ml-3 text-sm text-red-700 dark:text-red-300">{{ error() }}</p>
              </div>
            </div>
          }

          <div class="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button"
                    (click)="goBack()"
                    class="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium">
              Cancelar
            </button>
            <button type="submit"
                    [disabled]="paymentForm.invalid || submitting()"
                    class="px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              @if (submitting()) {
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              }
              {{ submitting() ? 'Guardando...' : 'Registrar Pago' }}
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: []
})
export class TrainerPaymentFormComponent implements OnInit {
  paymentForm: FormGroup;
  students = signal<Student[]>([]);
  packs = signal<PaymentPack[]>([]);
  loading = signal(true);
  submitting = signal(false);
  error = signal('');
  maxDate = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      studentId: ['', Validators.required],
      packId: [''],
      packName: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      paymentDate: [new Date().toISOString().split('T')[0], Validators.required],
      paymentMethod: ['', Validators.required],
      status: ['approved', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    this.apiService.get<Student[]>('/students').subscribe({
      next: (students) => {
        this.students.set(students);
      },
      error: (err) => console.error('Error loading students:', err)
    });

    this.apiService.get<PaymentPack[]>('/payments/packs').subscribe({
      next: (packs) => {
        this.packs.set(packs);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading packs:', err);
        this.loading.set(false);
      }
    });
  }

  onPackChange() {
    const packId = this.paymentForm.get('packId')?.value;
    if (packId) {
      const selectedPack = this.packs().find(p => p.id === packId);
      if (selectedPack) {
        this.paymentForm.patchValue({
          packName: selectedPack.name,
          amount: selectedPack.price
        });
      }
    } else {
      this.paymentForm.patchValue({
        packName: '',
        amount: 0
      });
    }
  }

  onSubmit() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    const studentId = this.paymentForm.get('studentId')?.value;
    const student = this.students().find(s => s.id === studentId);

    const formValue = this.paymentForm.value;
    const payload = {
      studentId: formValue.studentId,
      studentName: student ? `${student.firstName} ${student.lastName}` : '',
      packId: formValue.packId || null,
      packName: formValue.packName,
      amount: formValue.amount,
      currency: 'ARS',
      paymentDate: formValue.paymentDate,
      paymentMethod: formValue.paymentMethod,
      status: formValue.status,
      description: formValue.description
    };

    this.apiService.post('/trainer/payments', payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/trainer/payments']);
      },
      error: (err) => {
        console.error('Error creating payment:', err);
        this.error.set('Ocurrió un error al registrar el pago. Por favor, intenta nuevamente.');
        this.submitting.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/trainer/payments']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  }
}
