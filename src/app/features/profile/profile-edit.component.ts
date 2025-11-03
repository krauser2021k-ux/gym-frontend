import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { User } from '../../shared/models';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <h1 class="text-2xl sm:text-3xl font-bold">Mi Perfil</h1>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      } @else if (user()) {
        <form (ngSubmit)="saveProfile()" class="space-y-6">
          <div class="glass rounded-lg p-6">
            <div class="flex flex-col sm:flex-row items-center sm:space-x-6 gap-4 sm:gap-0 mb-6">
              @if (user()!.photoUrl) {
                <img [src]="user()!.photoUrl" alt="Foto de perfil"
                     class="w-24 h-24 rounded-full object-cover">
              } @else {
                <div class="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center">
                  <span class="text-3xl font-bold text-white">
                    {{ user()!.firstName?.charAt(0) }}{{ user()!.lastName?.charAt(0) }}
                  </span>
                </div>
              }
              <div>
                <h2 class="text-xl font-semibold text-slate-900 dark:text-white">
                  {{ user()!.firstName }} {{ user()!.lastName }}
                </h2>
                <p class="text-slate-700 dark:text-white/80">{{ user()!.email }}</p>
                <p class="text-sm text-slate-600 dark:text-white/70">{{ getRoleLabel(user()!.role) }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-white/90 mb-1">
                  Nombre
                </label>
                <input type="text" [(ngModel)]="user()!.firstName" name="firstName"
                       class="w-full px-4 py-2 border border-slate-300 dark:border-white/30 rounded-lg text-slate-900 dark:text-white bg-white/80 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50 placeholder-slate-500 dark:placeholder-white/50">
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-white/90 mb-1">
                  Apellido
                </label>
                <input type="text" [(ngModel)]="user()!.lastName" name="lastName"
                       class="w-full px-4 py-2 border border-slate-300 dark:border-white/30 rounded-lg text-slate-900 dark:text-white bg-white/80 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50 placeholder-slate-500 dark:placeholder-white/50">
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-white/90 mb-1">
                  Teléfono
                </label>
                <input type="tel" [(ngModel)]="user()!.phone" name="phone"
                       class="w-full px-4 py-2 border border-slate-300 dark:border-white/30 rounded-lg text-slate-900 dark:text-white bg-white/80 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50 placeholder-slate-500 dark:placeholder-white/50">
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-white/90 mb-1">
                  Fecha de Nacimiento
                </label>
                <input type="date" [(ngModel)]="user()!.birthDate" name="birthDate"
                       class="w-full px-4 py-2 border border-slate-300 dark:border-white/30 rounded-lg text-slate-900 dark:text-white bg-white/80 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50 placeholder-slate-500 dark:placeholder-white/50">
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-white/90 mb-1">
                  Peso (kg)
                </label>
                <input type="number" [(ngModel)]="user()!.weight" name="weight" step="0.1"
                       class="w-full px-4 py-2 border border-slate-300 dark:border-white/30 rounded-lg text-slate-900 dark:text-white bg-white/80 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50 placeholder-slate-500 dark:placeholder-white/50">
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-white/90 mb-1">
                  Altura (cm)
                </label>
                <input type="number" [(ngModel)]="user()!.height" name="height"
                       class="w-full px-4 py-2 border border-slate-300 dark:border-white/30 rounded-lg text-slate-900 dark:text-white bg-white/80 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50 placeholder-slate-500 dark:placeholder-white/50">
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-slate-700 dark:text-white/90 mb-1">
                  Notas Médicas
                </label>
                <textarea [(ngModel)]="user()!.medicalNotes" name="medicalNotes" rows="3"
                          class="w-full px-4 py-2 border border-slate-300 dark:border-white/30 rounded-lg text-slate-900 dark:text-white bg-white/80 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50 placeholder-slate-500 dark:placeholder-white/50"></textarea>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-slate-700 dark:text-white/90 mb-1">
                  Observaciones
                </label>
                <textarea [(ngModel)]="user()!.customField" name="customField" rows="2"
                          class="w-full px-4 py-2 border border-slate-300 dark:border-white/30 rounded-lg text-slate-900 dark:text-white bg-white/80 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50 placeholder-slate-500 dark:placeholder-white/50"></textarea>
              </div>
            </div>

            <div class="flex justify-end space-x-4 mt-6">
              <button type="button" (click)="cancel()"
                      class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" [disabled]="saving()"
                      class="btn-primary disabled:opacity-50">
                {{ saving() ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </div>
        </form>
      }
    </div>
  `,
  styles: []
})
export class ProfileEditComponent implements OnInit {
  user = signal<Partial<User> | null>(null);
  loading = signal(true);
  saving = signal(false);

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.get<Partial<User>>('/me').subscribe({
      next: (data) => {
        this.user.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.loading.set(false);
      }
    });
  }

  saveProfile() {
    this.saving.set(true);
    this.apiService.put('/me', this.user()).subscribe({
      next: () => {
        this.saving.set(false);
        alert('Perfil actualizado correctamente');
      },
      error: (err) => {
        console.error('Error saving profile:', err);
        this.saving.set(false);
        alert('Error al guardar el perfil');
      }
    });
  }

  cancel() {
    this.ngOnInit();
  }

  getRoleLabel(role?: string): string {
    const labels: Record<string, string> = {
      'admin': 'Administrador',
      'trainer': 'Entrenador',
      'student': 'Alumno'
    };
    return labels[role || 'student'] || role || '';
  }
}
