import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentPlanService } from '../../core/payment-plan.service';
import { PlanItemsManagerComponent } from './plan-items-manager.component';
import { PaymentPlan, PaymentPlanItem, PaymentPlanType, RecurrenceType } from '../../shared/models/payment.model';

@Component({
  selector: 'app-payment-plan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PlanItemsManagerComponent],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center gap-4">
        <button (click)="goBack()"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <svg class="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode ? 'Editar Plan' : 'Crear Nuevo Plan' }}
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1">Define los detalles y contenido del plan</p>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else {
        <form [formGroup]="planForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información Básica</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Plan <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button type="button"
                            (click)="selectPlanType('general')"
                            [class.ring-2]="planForm.get('type')?.value === 'general'"
                            [class.ring-blue-500]="planForm.get('type')?.value === 'general'"
                            class="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left">
                      <div class="flex items-center gap-2 mb-1">
                        <div class="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span class="font-semibold text-gray-900 dark:text-white">General</span>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Plan estándar reutilizable para múltiples alumnos</p>
                    </button>

                    <button type="button"
                            (click)="selectPlanType('semi_custom')"
                            [class.ring-2]="planForm.get('type')?.value === 'semi_custom'"
                            [class.ring-amber-500]="planForm.get('type')?.value === 'semi_custom'"
                            class="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-amber-500 dark:hover:border-amber-500 transition-all text-left">
                      <div class="flex items-center gap-2 mb-1">
                        <div class="h-3 w-3 rounded-full bg-amber-500"></div>
                        <span class="font-semibold text-gray-900 dark:text-white">Semipersonalizado</span>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Basado en plan general con ajustes específicos</p>
                    </button>

                    <button type="button"
                            (click)="selectPlanType('custom')"
                            [class.ring-2]="planForm.get('type')?.value === 'custom'"
                            [class.ring-green-500]="planForm.get('type')?.value === 'custom'"
                            class="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-all text-left">
                      <div class="flex items-center gap-2 mb-1">
                        <div class="h-3 w-3 rounded-full bg-green-500"></div>
                        <span class="font-semibold text-gray-900 dark:text-white">Personalizado</span>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Plan completamente flexible para casos especiales</p>
                    </button>
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Plan <span class="text-red-500">*</span>
                  </label>
                  <input type="text"
                         formControlName="name"
                         placeholder="Ej: Plan Premium Mensual"
                         class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                         [class.border-red-500]="planForm.get('name')?.invalid && planForm.get('name')?.touched">
                  @if (planForm.get('name')?.invalid && planForm.get('name')?.touched) {
                    <p class="mt-1 text-sm text-red-500">El nombre es obligatorio</p>
                  }
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción <span class="text-red-500">*</span>
                  </label>
                  <textarea formControlName="description"
                            rows="3"
                            placeholder="Describe brevemente qué incluye este plan..."
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                            [class.border-red-500]="planForm.get('description')?.invalid && planForm.get('description')?.touched"></textarea>
                  @if (planForm.get('description')?.invalid && planForm.get('description')?.touched) {
                    <p class="mt-1 text-sm text-red-500">La descripción es obligatoria</p>
                  }
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Precio Base <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                    <input type="number"
                           formControlName="basePrice"
                           placeholder="0"
                           min="0"
                           step="100"
                           class="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                           [class.border-red-500]="planForm.get('basePrice')?.invalid && planForm.get('basePrice')?.touched">
                  </div>
                  @if (planForm.get('basePrice')?.invalid && planForm.get('basePrice')?.touched) {
                    <p class="mt-1 text-sm text-red-500">El precio debe ser mayor a 0</p>
                  }
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recurrencia <span class="text-red-500">*</span>
                  </label>
                  <select formControlName="recurrence"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                    <option value="mensual">Mensual</option>
                    <option value="bimestral">Bimestral</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                    <option value="unico">Pago único</option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="flex items-center gap-2">
                    <input type="checkbox"
                           formControlName="isActive"
                           class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Plan activo (visible para asignar)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contenido del Plan</h2>
            <app-plan-items-manager
              [items]="planItems"
              (itemsChange)="onItemsChange($event)">
            </app-plan-items-manager>
          </div>

          @if (planForm.get('type')?.value === 'semi_custom' || planForm.get('type')?.value === 'custom') {
            <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div class="flex gap-3">
                <svg class="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="text-sm text-amber-800 dark:text-amber-300">
                  <p class="font-medium mb-1">Información sobre planes {{ planForm.get('type')?.value === 'semi_custom' ? 'semipersonalizados' : 'personalizados' }}</p>
                  <p>{{ planForm.get('type')?.value === 'semi_custom' ?
                    'Los recargos se aplicarán al asignar este plan a un alumno específico.' :
                    'Este plan está diseñado para casos especiales y puede tener características únicas.' }}</p>
                </div>
              </div>
            </div>
          }

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
                    [disabled]="planForm.invalid || submitting() || planItems().length === 0"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              @if (submitting()) {
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              }
              {{ submitting() ? 'Guardando...' : (isEditMode ? 'Actualizar Plan' : 'Crear Plan') }}
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: []
})
export class PaymentPlanFormComponent implements OnInit {
  planForm: FormGroup;
  planItems = signal<PaymentPlanItem[]>([]);
  loading = signal(false);
  submitting = signal(false);
  error = signal('');
  isEditMode = false;
  planId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private paymentPlanService: PaymentPlanService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.planForm = this.fb.group({
      type: ['general', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      basePrice: [0, [Validators.required, Validators.min(1)]],
      recurrence: ['mensual', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.planId = this.route.snapshot.paramMap.get('id');
    if (this.planId) {
      this.isEditMode = true;
      this.loadPlan();
    }
  }

  loadPlan() {
    this.loading.set(true);
    this.paymentPlanService.getPlanById(this.planId!).subscribe({
      next: (plan) => {
        this.planForm.patchValue({
          type: plan.type,
          name: plan.name,
          description: plan.description,
          basePrice: plan.basePrice,
          recurrence: plan.recurrence,
          isActive: plan.isActive
        });
        this.planItems.set([...plan.items]);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading plan:', err);
        this.error.set('Error al cargar el plan');
        this.loading.set(false);
      }
    });
  }

  selectPlanType(type: PaymentPlanType) {
    this.planForm.patchValue({ type });
  }

  onItemsChange(items: PaymentPlanItem[]) {
    this.planItems.set(items);
  }

  onSubmit() {
    if (this.planForm.invalid || this.planItems().length === 0) {
      this.planForm.markAllAsTouched();
      this.error.set('Por favor completa todos los campos obligatorios y agrega al menos un item');
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    const formValue = this.planForm.value;

    const durationMap: Record<RecurrenceType, number> = {
      'mensual': 30,
      'bimestral': 60,
      'trimestral': 90,
      'semestral': 180,
      'anual': 365,
      'unico': 9999
    };

    const planData: Partial<PaymentPlan> = {
      ...formValue,
      durationDays: durationMap[formValue.recurrence as RecurrenceType],
      currency: 'ARS',
      items: this.planItems()
    };

    const request = this.isEditMode
      ? this.paymentPlanService.updatePlan(this.planId!, planData)
      : this.paymentPlanService.createPlan(planData);

    request.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/trainer/payment-plans']);
      },
      error: (err) => {
        console.error('Error saving plan:', err);
        this.error.set('Ocurrió un error al guardar el plan. Por favor, intenta nuevamente.');
        this.submitting.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/trainer/payment-plans']);
  }
}
