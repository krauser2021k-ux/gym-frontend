export interface PaymentPack {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: string[];
}

export interface Payment {
  id: string;
  studentId: string;
  packId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  externalId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentPreference {
  id: string;
  checkoutUrl: string;
}

export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'mercadopago';

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface TrainerPayment {
  id: string;
  studentId: string;
  studentName: string;
  trainerId: string;
  packId: string | null;
  packName: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  description: string;
  externalId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentFilters {
  studentId?: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaymentStats {
  totalAmount: number;
  totalPayments: number;
  pendingPayments: number;
  approvedPayments: number;
}

export interface StudentSubscription {
  id: string;
  studentId: string;
  packId: string;
  packName: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  nextPaymentDate: string;
  autoRenew: boolean;
  price: number;
  currency: string;
}

export interface SavedPaymentMethod {
  id: string;
  studentId: string;
  type: 'card' | 'transfer' | 'cash' | 'mercadopago';
  label: string;
  lastFourDigits?: string;
  cardBrand?: string;
  expiryMonth?: string;
  expiryYear?: string;
  bankName?: string;
  accountNumber?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentNotification {
  id: string;
  studentId: string;
  type: 'payment_reminder' | 'payment_confirmed' | 'payment_failed' | 'subscription_renewed';
  title: string;
  message: string;
  dueDate?: string;
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface StudentPaymentHistory extends TrainerPayment {
  receiptUrl?: string;
  notes?: string;
}

export interface StudentPaymentSummary {
  currentBalance: number;
  nextPaymentAmount: number;
  nextPaymentDate: string;
  totalSpent: number;
  totalPayments: number;
  pendingAmount: number;
  accountStatus: 'up_to_date' | 'pending' | 'overdue';
  activeSince: string;
}

export interface PaymentCheckoutRequest {
  packId: string;
  amount: number;
  paymentMethodId?: string;
  autoRenew?: boolean;
}

export interface PaymentCheckoutResponse {
  id: string;
  checkoutUrl: string;
  status: PaymentStatus;
}
