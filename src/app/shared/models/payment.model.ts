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
