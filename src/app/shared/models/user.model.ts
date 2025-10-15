export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'trainer' | 'student';
  phone?: string;
  birthDate?: string;
  sex?: 'M' | 'F' | 'O';
  weight?: number;
  height?: number;
  photoUrl?: string;
  medicalNotes?: string;
  customField?: string;
  gyms?: string[];
}
