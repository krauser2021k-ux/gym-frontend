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
