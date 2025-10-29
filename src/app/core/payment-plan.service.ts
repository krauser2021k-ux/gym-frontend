import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import {
  PaymentPlan,
  StudentPaymentPlanAssignment,
  AssignPlanRequest,
  PaymentPlanStats,
  PaymentPlanItem
} from '../shared/models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentPlanService {
  constructor(private apiService: ApiService) {}

  getTrainerPlans(): Observable<PaymentPlan[]> {
    return this.apiService.get<PaymentPlan[]>('/trainer/payment-plans');
  }

  getPlanById(id: string): Observable<PaymentPlan> {
    return this.apiService.get<PaymentPlan>(`/trainer/payment-plans/${id}`);
  }

  createPlan(plan: Partial<PaymentPlan>): Observable<PaymentPlan> {
    return this.apiService.post<PaymentPlan>('/trainer/payment-plans', plan);
  }

  updatePlan(id: string, plan: Partial<PaymentPlan>): Observable<PaymentPlan> {
    return this.apiService.put<PaymentPlan>(`/trainer/payment-plans/${id}`, plan);
  }

  deletePlan(id: string): Observable<void> {
    return this.apiService.delete<void>(`/trainer/payment-plans/${id}`);
  }

  duplicatePlan(id: string): Observable<PaymentPlan> {
    return this.apiService.post<PaymentPlan>(`/trainer/payment-plans/${id}/duplicate`, {});
  }

  getStudentAssignments(): Observable<StudentPaymentPlanAssignment[]> {
    return this.apiService.get<StudentPaymentPlanAssignment[]>('/trainer/student-plan-assignments');
  }

  getStudentActivePlan(studentId: string): Observable<StudentPaymentPlanAssignment | null> {
    return this.apiService.get<StudentPaymentPlanAssignment | null>(`/students/${studentId}/payment-plan`);
  }

  assignPlanToStudent(request: AssignPlanRequest): Observable<StudentPaymentPlanAssignment> {
    return this.apiService.post<StudentPaymentPlanAssignment>('/trainer/payment-plans/assign', request);
  }

  updateStudentPlanStatus(assignmentId: string, status: 'active' | 'paused' | 'cancelled' | 'expired'): Observable<StudentPaymentPlanAssignment> {
    return this.apiService.put<StudentPaymentPlanAssignment>(
      `/trainer/student-plan-assignments/${assignmentId}/status`,
      { status }
    );
  }

  updateStudentPlanItems(assignmentId: string, items: PaymentPlanItem[]): Observable<StudentPaymentPlanAssignment> {
    return this.apiService.put<StudentPaymentPlanAssignment>(
      `/trainer/student-plan-assignments/${assignmentId}/items`,
      { items }
    );
  }

  getItemsLibrary(): Observable<Record<string, string[]>> {
    return this.apiService.get<any[]>('/payment-plan-items/library').pipe(
      map(library => {
        const result: Record<string, string[]> = {};
        library.forEach(cat => {
          result[cat.category] = cat.items;
        });
        return result;
      })
    );
  }

  getPlanStats(): Observable<PaymentPlanStats> {
    return this.apiService.get<PaymentPlanStats>('/trainer/payment-plans/stats');
  }

  calculateFinalPrice(basePrice: number, surcharges: { percentage: number }[]): number {
    let finalPrice = basePrice;
    surcharges.forEach(surcharge => {
      finalPrice += (basePrice * surcharge.percentage) / 100;
    });
    return Math.round(finalPrice);
  }

  calculateNextPaymentDate(startDate: string, recurrence: string): string {
    const date = new Date(startDate);

    switch (recurrence) {
      case 'mensual':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'bimestral':
        date.setMonth(date.getMonth() + 2);
        break;
      case 'trimestral':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'semestral':
        date.setMonth(date.getMonth() + 6);
        break;
      case 'anual':
        date.setFullYear(date.getFullYear() + 1);
        break;
      case 'unico':
        date.setFullYear(date.getFullYear() + 10);
        break;
    }

    return date.toISOString().split('T')[0];
  }
}
