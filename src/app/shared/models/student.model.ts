export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  sex: 'M' | 'F' | 'O';
  weight?: number;
  height?: number;
  photoUrl?: string;
  medicalNotes?: string;
  customField?: string;
  gyms: string[];
  createdAt?: string;
  updatedAt?: string;
}
