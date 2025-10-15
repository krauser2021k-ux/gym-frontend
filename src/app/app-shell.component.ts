import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import {KeycloakService} from './core/keycloak.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    template: `
        <div [class.dark]="darkMode()" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <nav class="bg-white dark:bg-gray-800 shadow-lg">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex">
                            <div class="flex-shrink-0 flex items-center">
                                <svg class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                                <span class="ml-2 text-xl font-bold text-gray-900 dark:text-white">GymPro</span>
                            </div>
                            @if (isAuthenticated()) {
                                <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    @if (userRole() === 'trainer' || userRole() === 'admin') {
                                        <a routerLink="/dashboard"
                                           routerLinkActive="border-primary-500 text-gray-900 dark:text-white"
                                           class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                            Dashboard
                                        </a>
                                    }
                                    <a routerLink="/students"
                                       routerLinkActive="border-primary-500 text-gray-900 dark:text-white"
                                       class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                        Alumnos
                                    </a>
                                    <a routerLink="/exercises"
                                       routerLinkActive="border-primary-500 text-gray-900 dark:text-white"
                                       class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                        Ejercicios
                                    </a>
                                    @if (userRole() === 'trainer' || userRole() === 'admin') {
                                        <a routerLink="/blocks"
                                           routerLinkActive="border-primary-500 text-gray-900 dark:text-white"
                                           class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                            Bloques
                                        </a>
                                    }
                                    <a routerLink="/routines"
                                       routerLinkActive="border-primary-500 text-gray-900 dark:text-white"
                                       class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                        Rutinas
                                    </a>
                                    @if (userRole() === 'student') {
                                        <a routerLink="/my-routine"
                                           routerLinkActive="border-primary-500 text-gray-900 dark:text-white"
                                           class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                            Mi Rutina
                                        </a>
                                        <a routerLink="/payments"
                                           routerLinkActive="border-primary-500 text-gray-900 dark:text-white"
                                           class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                            Pagos
                                        </a>
                                    }
                                </div>
                            }
                        </div>
                        <div class="flex items-center space-x-4">
                            <button (click)="toggleTheme()"
                                    class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
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
                                       class="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        {{ userName() }}
                                    </a>
                                    <button (click)="logout()"
                                            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
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
