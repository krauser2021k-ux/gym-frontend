import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  PaymentPack,
  StudentSubscription,
  StudentPaymentHistory,
  StudentPaymentSummary,
  SavedPaymentMethod,
  PaymentNotification,
  PaymentCheckoutRequest,
  PaymentCheckoutResponse
} from '../shared/models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class StudentPaymentService {
  constructor(private apiService: ApiService) {}

  getAvailablePacks(): Observable<PaymentPack[]> {
    return this.apiService.get<PaymentPack[]>('/student/payment-packs');
  }

  getMySubscription(): Observable<StudentSubscription | null> {
    return this.apiService.get<StudentSubscription | null>('/student/subscription');
  }

  getPaymentHistory(filters?: { dateFrom?: string; dateTo?: string; status?: string }): Observable<StudentPaymentHistory[]> {
    let url = '/student/payments';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.status) params.append('status', filters.status);
      if (params.toString()) {
        url += '?' + params.toString();
      }
    }
    return this.apiService.get<StudentPaymentHistory[]>(url);
  }

  getPaymentSummary(): Observable<StudentPaymentSummary> {
    return this.apiService.get<StudentPaymentSummary>('/student/payment-summary');
  }

  getSavedPaymentMethods(): Observable<SavedPaymentMethod[]> {
    return this.apiService.get<SavedPaymentMethod[]>('/student/payment-methods');
  }

  addPaymentMethod(method: Partial<SavedPaymentMethod>): Observable<SavedPaymentMethod> {
    return this.apiService.post<SavedPaymentMethod>('/student/payment-methods', method);
  }

  deletePaymentMethod(id: string): Observable<void> {
    return this.apiService.delete<void>(`/student/payment-methods/${id}`);
  }

  setDefaultPaymentMethod(id: string): Observable<void> {
    return this.apiService.put<void>(`/student/payment-methods/${id}/set-default`, {});
  }

  getNotifications(): Observable<PaymentNotification[]> {
    return this.apiService.get<PaymentNotification[]>('/student/payment-notifications');
  }

  markNotificationAsRead(id: string): Observable<void> {
    return this.apiService.put<void>(`/student/payment-notifications/${id}/mark-read`, {});
  }

  createCheckout(request: PaymentCheckoutRequest): Observable<PaymentCheckoutResponse> {
    return this.apiService.post<PaymentCheckoutResponse>('/student/checkout', request);
  }

  updateSubscription(autoRenew: boolean): Observable<StudentSubscription> {
    return this.apiService.put<StudentSubscription>('/student/subscription', { autoRenew });
  }

  cancelSubscription(): Observable<void> {
    return this.apiService.delete<void>('/student/subscription');
  }

  downloadReceipt(paymentId: string): void {
    const link = document.createElement('a');
    link.href = `/api/student/payments/${paymentId}/receipt`;
    link.download = `recibo-${paymentId}.pdf`;
    link.click();
  }

  calculateProration(currentPackId: string, newPackId: string): Observable<{ amount: number; description: string }> {
    return this.apiService.post<{ amount: number; description: string }>('/student/calculate-proration', {
      currentPackId,
      newPackId
    });
  }
}
