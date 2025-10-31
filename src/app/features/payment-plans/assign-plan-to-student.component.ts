import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentPlanService } from '../../core/payment-plan.service';
import { StudentService } from '../../core/student.service';
import { PlanItemsManagerComponent } from './plan-items-manager.component';
import { PaymentPlan, PaymentPlanItem, PlanSurcharge } from '../../shared/models/payment.model';
import { Student } from '../../shared/models/student.model';

@Component({
  selector: 'app-assign-plan-to-student',
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
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Asignar Plan a Alumno</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1">Selecciona un plan y personalízalo según sea necesario</p>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else {
        <form [formGroup]="assignForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Información de Asignación</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alumno <span class="text-red-500">*</span>
                </label>
                <select formControlName="studentId"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        [class.border-red-500]="assignForm.get('studentId')?.invalid && assignForm.get('studentId')?.touched">
                  <option value="">Selecciona un alumno</option>
                  @for (student of students(); track student.id) {
                    <option [value]="student.id">{{ student.firstName }} {{ student.lastName }}</option>
                  }
                </select>
                @if (assignForm.get('studentId')?.invalid && assignForm.get('studentId')?.touched) {
                  <p class="mt-1 text-sm text-red-500">Debes seleccionar un alumno</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plan Base <span class="text-red-500">*</span>
                </label>
                <select formControlName="planId"
                        (change)="onPlanSelected()"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        [class.border-red-500]="assignForm.get('planId')?.invalid && assignForm.get('planId')?.touched">
                  <option value="">Selecciona un plan</option>
                  @for (plan of plans(); track plan.id) {
                    <option [value]="plan.id">{{ plan.name }} - {{ formatPrice(plan.basePrice) }}</option>
                  }
                </select>
                @if (assignForm.get('planId')?.invalid && assignForm.get('planId')?.touched) {
                  <p class="mt-1 text-sm text-red-500">Debes seleccionar un plan</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha de Inicio <span class="text-red-500">*</span>
                </label>
                <input type="date"
                       formControlName="startDate"
                       class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                       [class.border-red-500]="assignForm.get('startDate')?.invalid && assignForm.get('startDate')?.touched">
                @if (assignForm.get('startDate')?.invalid && assignForm.get('startDate')?.touched) {
                  <p class="mt-1 text-sm text-red-500">La fecha de inicio es obligatoria</p>
                }
              </div>
            </div>
          </div>

          @if (selectedPlan()) {
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Items del Plan</h2>
              <app-plan-items-manager
                [items]="customItems"
                (itemsChange)="onItemsChange($event)">
              </app-plan-items-manager>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recargos (Opcionales)</h2>
                <button type="button"
                        (click)="addSurcharge()"
                        class="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar Recargo
                </button>
              </div>

              <div formArrayName="surcharges" class="space-y-3">
                @for (surcharge of surcharges.controls; track $index) {
                  <div [formGroupName]="$index" class="flex gap-3 items-start p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div class="flex-1">
                      <input type="text"
                             formControlName="reason"
                             placeholder="Motivo del recargo"
                             class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-2">
                      <div class="flex items-center gap-2">
                        <input type="number"
                               formControlName="percentage"
                               placeholder="0"
                               min="-100"
                               max="100"
                               step="1"
                               class="w-24 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                        <span class="text-sm text-gray-600 dark:text-gray-400">%</span>
                        <span class="text-xs text-gray-500 dark:text-gray-500">(positivo para recargo, negativo para descuento)</span>
                      </div>
                    </div>
                    <button type="button"
                            (click)="removeSurcharge($index)"
                            class="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                }
              </div>

              @if (surcharges.length === 0) {
                <div class="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
                  No hay recargos aplicados. Haz clic en "Agregar Recargo" para incluir uno.
                </div>
              }
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notas Adicionales</h2>
              <textarea formControlName="notes"
                        rows="3"
                        placeholder="Información adicional sobre este plan asignado..."
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"></textarea>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumen de Asignación</h3>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Plan seleccionado:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedPlan()?.name }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Precio base:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatPrice(selectedPlan()!.basePrice) }}</span>
                </div>
                @if (surcharges.length > 0) {
                  @for (surcharge of surcharges.controls; track $index) {
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">{{ surcharge.value.reason || 'Recargo' }}:</span>
                      <span [class]="surcharge.value.percentage >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
                            class="font-medium">
                        {{ surcharge.value.percentage > 0 ? '+' : '' }}{{ surcharge.value.percentage }}%
                        ({{ formatPrice(calculateSurchargeAmount(surcharge.value.percentage)) }})
                      </span>
                    </div>
                  }
                }
                <div class="pt-2 mt-2 border-t border-blue-200 dark:border-blue-800 flex justify-between">
                  <span class="font-semibold text-gray-900 dark:text-white">Precio final:</span>
                  <span class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ formatPrice(calculatedFinalPrice()) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Recurrencia:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ getRecurrenceLabel(selectedPlan()!.recurrence) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Items incluidos:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ customItems().length }}</span>
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
                    [disabled]="assignForm.invalid || !selectedPlan() || submitting()"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              @if (submitting()) {
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              }
              {{ submitting() ? 'Asignando...' : 'Asignar Plan' }}
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: []
})
export class AssignPlanToStudentComponent implements OnInit {
  assignForm: FormGroup;
  students = signal<Student[]>([]);
  plans = signal<PaymentPlan[]>([]);
  selectedPlan = signal<PaymentPlan | null>(null);
  customItems = signal<PaymentPlanItem[]>([]);
  loading = signal(true);
  submitting = signal(false);
  error = signal('');

  calculatedFinalPrice = computed(() => {
    const plan = this.selectedPlan();
    if (!plan) return 0;

    let finalPrice = plan.basePrice;
    this.surcharges.controls.forEach(control => {
      const percentage = control.value.percentage || 0;
      finalPrice += (plan.basePrice * percentage) / 100;
    });

    return Math.round(finalPrice);
  });

  get surcharges() {
    return this.assignForm.get('surcharges') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private paymentPlanService: PaymentPlanService,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.assignForm = this.fb.group({
      studentId: ['', Validators.required],
      planId: ['', Validators.required],
      startDate: [new Date().toISOString().split('T')[0], Validators.required],
      surcharges: this.fb.array([]),
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadData();

    const studentId = this.route.snapshot.queryParamMap.get('studentId');
    if (studentId) {
      this.assignForm.patchValue({ studentId });
    }
  }

  loadData() {
    this.loading.set(true);

    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.students.set(students);
      },
      error: (err) => console.error('Error loading students:', err)
    });

    this.paymentPlanService.getTrainerPlans().subscribe({
      next: (plans) => {
        this.plans.set(plans.filter(p => p.isActive));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading plans:', err);
        this.loading.set(false);
      }
    });
  }

  onPlanSelected() {
    const planId = this.assignForm.get('planId')?.value;
    const plan = this.plans().find(p => p.id === planId);

    if (plan) {
      this.selectedPlan.set(plan);
      this.customItems.set([...plan.items]);
    } else {
      this.selectedPlan.set(null);
      this.customItems.set([]);
    }
  }

  onItemsChange(items: PaymentPlanItem[]) {
    this.customItems.set(items);
  }

  addSurcharge() {
    const surchargeGroup = this.fb.group({
      reason: ['', Validators.required],
      percentage: [0, [Validators.required, Validators.min(-100), Validators.max(100)]]
    });
    this.surcharges.push(surchargeGroup);
  }

  removeSurcharge(index: number) {
    this.surcharges.removeAt(index);
  }

  calculateSurchargeAmount(percentage: number): number {
    const plan = this.selectedPlan();
    if (!plan) return 0;
    return Math.round((plan.basePrice * percentage) / 100);
  }

  onSubmit() {
    if (this.assignForm.invalid || !this.selectedPlan()) {
      this.assignForm.markAllAsTouched();
      this.error.set('Por favor completa todos los campos obligatorios');
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    const formValue = this.assignForm.value;

    const surcharges: PlanSurcharge[] = formValue.surcharges.map((s: any, index: number) => ({
      id: `surcharge-${Date.now()}-${index}`,
      reason: s.reason,
      percentage: s.percentage
    }));

    const request = {
      studentId: formValue.studentId,
      planId: formValue.planId,
      startDate: formValue.startDate,
      customItems: this.customItems(),
      surcharges: surcharges,
      notes: formValue.notes
    };

    this.paymentPlanService.assignPlanToStudent(request).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/trainer/students/plans-overview']);
      },
      error: (err) => {
        console.error('Error assigning plan:', err);
        this.error.set('Ocurrió un error al asignar el plan. Por favor, intenta nuevamente.');
        this.submitting.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/trainer/payment-plans']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
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
