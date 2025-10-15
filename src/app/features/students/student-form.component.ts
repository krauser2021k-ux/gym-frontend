import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../core/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Nuevo Alumno</h1>
        <button (click)="goBack()"
                class="px-4 py-2 text-white/80 hover:text-white transition-colors">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      @if (errorMessage()) {
        <div class="glass rounded-lg p-4 border-l-4 border-red-400">
          <p class="text-red-400">{{ errorMessage() }}</p>
        </div>
      }

      <form [formGroup]="studentForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="glass rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Información Personal</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Nombre *
              </label>
              <input type="text"
                     formControlName="firstName"
                     class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                     placeholder="Ingrese el nombre">
              @if (isFieldInvalid('firstName')) {
                <p class="mt-1 text-sm text-red-400">El nombre es requerido</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Apellido *
              </label>
              <input type="text"
                     formControlName="lastName"
                     class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                     placeholder="Ingrese el apellido">
              @if (isFieldInvalid('lastName')) {
                <p class="mt-1 text-sm text-red-400">El apellido es requerido</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Email *
              </label>
              <input type="email"
                     formControlName="email"
                     class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                     placeholder="correo@ejemplo.com">
              @if (isFieldInvalid('email')) {
                <p class="mt-1 text-sm text-red-400">
                  @if (studentForm.get('email')?.hasError('required')) {
                    El email es requerido
                  } @else if (studentForm.get('email')?.hasError('email')) {
                    Ingrese un email válido
                  }
                </p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Teléfono *
              </label>
              <input type="tel"
                     formControlName="phone"
                     class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                     placeholder="+54 11 1234-5678">
              @if (isFieldInvalid('phone')) {
                <p class="mt-1 text-sm text-red-400">El teléfono es requerido</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Fecha de Nacimiento *
              </label>
              <input type="date"
                     formControlName="birthDate"
                     class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all">
              @if (isFieldInvalid('birthDate')) {
                <p class="mt-1 text-sm text-red-400">La fecha de nacimiento es requerida</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Sexo *
              </label>
              <select formControlName="sex"
                      class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all">
                <option value="" class="bg-gray-800">Seleccione...</option>
                <option value="M" class="bg-gray-800">Masculino</option>
                <option value="F" class="bg-gray-800">Femenino</option>
                <option value="O" class="bg-gray-800">Otro</option>
              </select>
              @if (isFieldInvalid('sex')) {
                <p class="mt-1 text-sm text-red-400">El sexo es requerido</p>
              }
            </div>
          </div>
        </div>

        <div class="glass rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Datos Físicos</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Peso (kg)
              </label>
              <input type="number"
                     formControlName="weight"
                     step="0.1"
                     class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                     placeholder="70.5">
              @if (studentForm.get('weight')?.hasError('min')) {
                <p class="mt-1 text-sm text-red-400">El peso debe ser mayor a 0</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Altura (cm)
              </label>
              <input type="number"
                     formControlName="height"
                     class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                     placeholder="175">
              @if (studentForm.get('height')?.hasError('min')) {
                <p class="mt-1 text-sm text-red-400">La altura debe ser mayor a 0</p>
              }
            </div>
          </div>
        </div>

        <div class="glass rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Foto de Perfil</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Subir Foto
              </label>
              <input type="file"
                     #fileInput
                     (change)="onFileSelected($event)"
                     accept="image/jpeg,image/png,image/webp"
                     class="hidden">
              <button type="button"
                      (click)="fileInput.click()"
                      class="px-4 py-2 glass hover:bg-white/20 text-white rounded-lg transition-all duration-200">
                Seleccionar Archivo
              </button>
              @if (selectedFileName()) {
                <p class="mt-2 text-sm text-white/70">{{ selectedFileName() }}</p>
              }
            </div>

            @if (photoPreview()) {
              <div class="flex items-center space-x-4">
                <img [src]="photoPreview()"
                     alt="Vista previa"
                     class="w-24 h-24 rounded-full object-cover border-2 border-white/20">
                <button type="button"
                        (click)="removePhoto()"
                        class="px-3 py-1 text-sm text-red-400 hover:text-red-300 transition-colors">
                  Eliminar
                </button>
              </div>
            }
          </div>
        </div>

        <div class="glass rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Información Adicional</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Notas Médicas
              </label>
              <textarea formControlName="medicalNotes"
                        rows="3"
                        class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all resize-none"
                        placeholder="Alergias, condiciones médicas, etc."></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Campo Personalizado
              </label>
              <input type="text"
                     formControlName="customField"
                     class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                     placeholder="Información adicional">
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <button type="submit"
                  [disabled]="loading() || studentForm.invalid"
                  class="flex-1 px-6 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center">
            @if (loading()) {
              <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            } @else {
              Guardar Alumno
            }
          </button>

          <button type="button"
                  (click)="goBack()"
                  [disabled]="loading()"
                  class="flex-1 px-6 py-3 glass hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  loading = signal(false);
  photoPreview = signal<string | null>(null);
  selectedFileName = signal<string | null>(null);
  selectedFile: File | null = null;
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      sex: ['', [Validators.required]],
      weight: [null, [Validators.min(0)]],
      height: [null, [Validators.min(0)]],
      medicalNotes: [''],
      customField: ['']
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.studentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage.set('Solo se permiten archivos JPG, PNG o WEBP');
      setTimeout(() => this.errorMessage.set(null), 5000);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMessage.set('El archivo no debe superar los 5MB');
      setTimeout(() => this.errorMessage.set(null), 5000);
      return;
    }

    this.selectedFile = file;
    this.selectedFileName.set(file.name);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.photoPreview.set(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.selectedFileName.set(null);
    this.photoPreview.set(null);
  }

  async onSubmit(): Promise<void> {
    if (this.studentForm.invalid) {
      Object.keys(this.studentForm.controls).forEach(key => {
        this.studentForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);

    try {
      let photoUrl: string | undefined = undefined;

      if (this.selectedFile) {
        photoUrl = await this.studentService.uploadPhoto(this.selectedFile).toPromise();
      }

      const studentData = {
        ...this.studentForm.value,
        photoUrl
      };

      this.studentService.createStudent(studentData).subscribe({
        next: (student) => {
          this.loading.set(false);
          this.router.navigate(['/students']);
        },
        error: (error) => {
          this.errorMessage.set(error.message || 'Error al registrar el alumno');
          this.loading.set(false);
        }
      });
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Error al subir la foto');
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }
}
