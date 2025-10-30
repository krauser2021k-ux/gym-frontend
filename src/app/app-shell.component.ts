import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import {KeycloakService} from './core/keycloak.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    template: `
        <div [class.dark]="darkMode()" class="min-h-screen transition-colors duration-200 flex flex-col">
            <nav class="glass shadow-lg relative">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 flex items-center">
                                <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                                <span class="ml-2 text-xl font-bold text-white">GymPro</span>
                            </div>
                            @if (isAuthenticated()) {
                                <div class="hidden lg:ml-6 lg:flex lg:space-x-8">
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
                                    @if (userRole() === 'trainer' || userRole() === 'admin') {
                                        <a routerLink="/programs"
                                           routerLinkActive="border-white text-white"
                                           class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                            Programas
                                        </a>
                                    }
                                    @if (userRole() === 'trainer' || userRole() === 'admin') {
                                        <a routerLink="/trainer/payment-plans"
                                           routerLinkActive="border-white text-white"
                                           class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                            Planes
                                        </a>
                                        <a routerLink="/trainer/payments"
                                           routerLinkActive="border-white text-white"
                                           class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                            Pagos
                                        </a>
                                    }
                                    @if (userRole() === 'student') {
                                        <a routerLink="/my-routine"
                                           routerLinkActive="border-white text-white"
                                           class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                            Mi Rutina
                                        </a>
                                        <a routerLink="/my-program"
                                           routerLinkActive="border-white text-white"
                                           class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                            Mi Programa
                                        </a>
                                        <a routerLink="/student/payments/plans"
                                           routerLinkActive="border-white text-white"
                                           class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                            Planes
                                        </a>
                                        <a routerLink="/student/payments/history"
                                           routerLinkActive="border-white text-white"
                                           class="border-transparent text-white/70 hover:border-white/50 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                                            Mis Pagos
                                        </a>
                                    }
                                </div>
                            }
                        </div>

                        <div class="flex items-center space-x-2 sm:space-x-4">
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
                                <a routerLink="/profile"
                                   class="hidden sm:block text-sm text-white/80 hover:text-white transition-all duration-200">
                                    {{ userName() }}
                                </a>
                                <button (click)="logout()"
                                        class="hidden sm:block px-3 sm:px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 glass hover:bg-white/20">
                                    Salir
                                </button>
                                <button (click)="toggleMobileMenu()"
                                        class="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200">
                                    @if (!mobileMenuOpen()) {
                                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M4 6h16M4 12h16M4 18h16"/>
                                        </svg>
                                    } @else {
                                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    }
                                </button>
                            }
                        </div>
                    </div>
                </div>

                @if (isAuthenticated() && mobileMenuOpen()) {
                    <div class="lg:hidden glass border-t border-white/10">
                        <div class="px-2 pt-2 pb-3 space-y-1">
                            @if (userRole() === 'trainer' || userRole() === 'admin') {
                                <a routerLink="/dashboard"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="text-white/70 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">
                                    Dashboard
                                </a>
                            }
                            <a routerLink="/students"
                               (click)="closeMobileMenu()"
                               routerLinkActive="bg-white/20 text-white"
                               class="text-white/70 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">
                                Alumnos
                            </a>
                            <a routerLink="/exercises"
                               (click)="closeMobileMenu()"
                               routerLinkActive="bg-white/20 text-white"
                               class="text-white/70 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">
                                Ejercicios
                            </a>
                            @if (userRole() === 'trainer' || userRole() === 'admin') {
                                <a routerLink="/blocks"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="text-white/70 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">
                                    Bloques
                                </a>
                            }
                            <a routerLink="/routines"
                               (click)="closeMobileMenu()"
                               routerLinkActive="bg-white/20 text-white"
                               class="text-white/70 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">
                                Rutinas
                            </a>
                            @if (userRole() === 'trainer' || userRole() === 'admin') {
                                <a routerLink="/programs"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="text-white/70 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">
                                    Programas
                                </a>
                            }
                            @if (userRole() === 'trainer' || userRole() === 'admin') {
                                <a routerLink="/trainer/payment-plans"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="text-white/70 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">
                                    Planes
                                </a>
                                <a routerLink="/trainer/payments"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="text-white/70 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">
                                    Pagos
                                </a>
                            }
                            @if (userRole() === 'student') {
                                <a routerLink="/my-routine"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="text-white/70 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">
                                    Mi Rutina
                                </a>
                                <a routerLink="/my-program"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="text-white/70 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">
                                    Mi Programa
                                </a>
                                <a routerLink="/student/payments/plans"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="text-white/70 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">
                                    Planes
                                </a>
                                <a routerLink="/student/payments/history"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="text-white/70 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">
                                    Mis Pagos
                                </a>
                            }
                        </div>
                        <div class="pt-4 pb-3 border-t border-white/10">
                            <div class="px-2 space-y-1">
                                <a routerLink="/profile"
                                   (click)="closeMobileMenu()"
                                   class="flex items-center px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200">
                                    <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                    {{ userName() }}
                                </a>
                                <button (click)="logout()"
                                        class="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200">
                                    <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                    </svg>
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </nav>

            <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <router-outlet></router-outlet>
            </main>

            <footer class="py-4 sm:py-6 border-t border-white/10 backdrop-blur-sm">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center">
                        <p class="text-xs sm:text-sm text-white/60">
                            Desarrollado por
                            <a href="https://krauser.com.ar"
                               target="_blank"
                               rel="noopener noreferrer"
                               class="text-white/80 hover:text-white transition-colors duration-200 font-medium underline decoration-white/30 hover:decoration-white/60">
                                Krauser
                            </a>, todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>
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
    mobileMenuOpen = signal(false);

    constructor(private keycloakService: KeycloakService) {
        const savedTheme = localStorage.getItem('theme');
        this.darkMode.set(savedTheme ? savedTheme === 'dark' : true);
        this.applyThemeToBody();
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
        this.applyThemeToBody();
    }

    private applyThemeToBody() {
        if (this.darkMode()) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }

    toggleMobileMenu() {
        this.mobileMenuOpen.update(v => !v);
    }

    closeMobileMenu() {
        this.mobileMenuOpen.set(false);
    }

    logout() {
        this.keycloakService.logout();
    }
}
