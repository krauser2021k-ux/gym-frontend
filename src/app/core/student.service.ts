import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Student } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();

  private storageKey = 'gym_students';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const students = JSON.parse(stored);
        this.studentsSubject.next(students);
      } catch (e) {
        console.error('Error loading students from storage:', e);
      }
    }
  }

  private saveToStorage(students: Student[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(students));
  }

  getStudents(): Observable<Student[]> {
    return of(this.studentsSubject.value).pipe(delay(300));
  }

  getStudentById(id: string): Observable<Student | undefined> {
    const student = this.studentsSubject.value.find(s => s.id === id);
    return of(student).pipe(delay(200));
  }

  createStudent(studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Observable<Student> {
    const students = this.studentsSubject.value;

    const emailExists = students.some(s => s.email === studentData.email);
    if (emailExists) {
      return throwError(() => new Error('El email ya está registrado')).pipe(delay(300));
    }

    const newStudent: Student = {
      ...studentData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gyms: []
    };

    const updatedStudents = [...students, newStudent];
    this.studentsSubject.next(updatedStudents);
    this.saveToStorage(updatedStudents);

    return of(newStudent).pipe(delay(500));
  }

  updateStudent(id: string, studentData: Partial<Student>): Observable<Student> {
    const students = this.studentsSubject.value;
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
      return throwError(() => new Error('Alumno no encontrado')).pipe(delay(300));
    }

    const updatedStudent: Student = {
      ...students[index],
      ...studentData,
      id,
      updatedAt: new Date().toISOString()
    };

    const updatedStudents = [...students];
    updatedStudents[index] = updatedStudent;

    this.studentsSubject.next(updatedStudents);
    this.saveToStorage(updatedStudents);

    return of(updatedStudent).pipe(delay(500));
  }

  deleteStudent(id: string): Observable<void> {
    const students = this.studentsSubject.value;
    const updatedStudents = students.filter(s => s.id !== id);

    this.studentsSubject.next(updatedStudents);
    this.saveToStorage(updatedStudents);

    return of(void 0).pipe(delay(300));
  }

  uploadPhoto(file: File): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        setTimeout(() => {
          observer.next(e.target.result);
          observer.complete();
        }, 800);
      };

      reader.onerror = () => {
        observer.error(new Error('Error al leer el archivo'));
      };

      reader.readAsDataURL(file);
    });
  }

  private generateId(): string {
    return `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
