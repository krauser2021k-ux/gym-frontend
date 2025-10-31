import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KeycloakService } from '../../core/keycloak.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

interface QuickAction {
  title: string;
  icon: string;
  route: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  template: `
    @if (canAccessActions()) {
      <div class="glass rounded-lg p-6 mb-6">
        <h2 class="text-xl font-bold text-white mb-4">Accesos Rápidos</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (action of quickActions; track action.route) {
            <button
              (click)="navigateTo(action.route)"
              class="glass rounded-lg p-6 hover:bg-white/25 transition-all duration-200 flex flex-col items-center justify-center space-y-3 group">
              <div class="rounded-full p-4 transition-all duration-200 group-hover:scale-110"
                   [style.background]="action.color">
                <i [class]="action.icon + ' text-white text-3xl'"></i>
              </div>
              <div class="text-center">
                <h3 class="text-white font-semibold text-base">{{ action.title }}</h3>
                <p class="text-white/70 text-xs mt-1">{{ action.description }}</p>
              </div>
            </button>
          }
        </div>
      </div>
    }
  `,
  styles: []
})
export class QuickActionsComponent {
  private userRole = signal<string>('');

  canAccessActions = computed(() => {
    const role = this.userRole();
    return role === 'trainer' || role === 'admin';
  });

  quickActions: QuickAction[] = [
    {
      title: 'Crear Ejercicio',
      icon: 'pi pi-bolt',
      route: '/exercises/new',
      description: 'Nuevo ejercicio',
      color: 'rgba(59, 130, 246, 0.3)'
    },
    {
      title: 'Crear Bloque',
      icon: 'pi pi-th-large',
      route: '/blocks/new',
      description: 'Nuevo bloque preestablecido',
      color: 'rgba(34, 197, 94, 0.3)'
    },
    {
      title: 'Crear Rutina',
      icon: 'pi pi-file',
      route: '/routines/new',
      description: 'Nueva rutina',
      color: 'rgba(245, 158, 11, 0.3)'
    },
    {
      title: 'Crear Alumno',
      icon: 'pi pi-users',
      route: '/students/new',
      description: 'Nuevo alumno',
      color: 'rgba(139, 92, 246, 0.3)'
    }
  ];

  constructor(
    private router: Router,
    private keycloakService: KeycloakService
  ) {
    const user = this.keycloakService.getUserFromToken();
    if (user?.role) {
      this.userRole.set(user.role);
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
