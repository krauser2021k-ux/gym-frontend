import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import {KeycloakService} from './core/keycloak.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    template: `
        <div [class.dark]="darkMode()" class="min-h-screen transition-colors duration-200">
            <nav class="glass dark:glass-dark shadow-lg backdrop-blur-md">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex">
                            <div class="flex-shrink-0 flex items-center">
                                <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                                <span class="ml-2 text-xl font-bold text-white">GymPro</span>
                            </div>
                            @if (isAuthenticated()) {
                                <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    @if (userRole() === 'trainer' || userRole() === 'admin') {
                                        <a routerLink="/dashboard"
                                           routerLinkActive="border-white text-white"
                                           class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                            Dashboard
                                        </a>
                                    }
                                    <a routerLink="/students"
                                       routerLinkActive="border-white text-white"
                                       class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                        Alumnos
                                    </a>
                                    <a routerLink="/exercises"
                                       routerLinkActive="border-white text-white"
                                       class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                        Ejercicios
                                    </a>
                                    @if (userRole() === 'trainer' || userRole() === 'admin') {
                                        <a routerLink="/blocks"
                                           routerLinkActive="border-white text-white"
                                           class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                            Bloques
                                        </a>
                                    }
                                    <a routerLink="/routines"
                                       routerLinkActive="border-white text-white"
                                       class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                        Rutinas
                                    </a>
                                    @if (userRole() === 'student') {
                                        <a routerLink="/my-routine"
                                           routerLinkActive="border-white text-white"
                                           class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                            Mi Rutina
                                        </a>
                                        <a routerLink="/payments"
                                           routerLinkActive="border-white text-white"
                                           class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                            Pagos
                                        </a>
                                    }
                                </div>
                            }
                        </div>
                        <div class="flex items-center space-x-4">
                            <button (click)="toggleTheme()"
                                    class="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200">
                                @if (darkMode()) {
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                    </svg>
                                } @else {
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                                    </svg>
                                }
                            </button>
                            @if (isAuthenticated()) {
                                <div class="flex items-center space-x-3">
                                    <a routerLink="/profile"
                                       class="text-sm text-white/80 hover:text-white transition-all duration-200">
                                        {{ userName() }}
                                    </a>
                                    <button (click)="logout()"
                                            class="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 glass hover:bg-white/20">
                                        Salir
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </nav>

            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <router-outlet></router-outlet>
            </main>
        </div>
    `,
    styles: [`
        :host {
            display: block;
        }
    `]
})
export class AppShellComponent {
    darkMode = signal(false);
    isAuthenticated = signal(false);
    userName = signal('');
    userRole = signal<'admin' | 'trainer' | 'student'>('student');

    constructor(private keycloakService: KeycloakService) {
        const savedTheme = localStorage.getItem('theme');
        this.darkMode.set(savedTheme === 'dark');
        const authenticated = this.keycloakService.isAuthenticated();
        this.isAuthenticated.set(authenticated);
        if (authenticated) {
            const user = this.keycloakService.getUserFromToken();
            if (user) {
                this.userName.set(`${user.firstName} ${user.lastName}`);
                this.userRole.set(user.role || 'student');
            }
        }
    }

    toggleTheme() {
        this.darkMode.update(v => !v);
        localStorage.setItem('theme', this.darkMode() ? 'dark' : 'light');
    }

    logout() {
        this.keycloakService.logout();
    }
}
