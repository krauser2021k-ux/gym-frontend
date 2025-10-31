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
            @if (isAuthenticated()) {
                <aside [class.w-64]="sidebarExpanded()"
                       [class.w-16]="!sidebarExpanded()"
                       class="hidden lg:flex fixed left-0 top-0 h-screen glass shadow-2xl z-50 transition-all duration-300 flex-col">

                    <div class="flex items-center justify-between p-4 border-b border-white/10">
                        <div class="flex items-center space-x-3 overflow-hidden">
                            <svg class="h-8 w-8 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                            @if (sidebarExpanded()) {
                                <span class="text-xl font-bold text-white whitespace-nowrap">GymPro</span>
                            }
                        </div>
                        <button (click)="toggleSidebar()"
                                class="hidden lg:block p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200">
                            @if (sidebarExpanded()) {
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                                </svg>
                            } @else {
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
                                </svg>
                            }
                        </button>
                    </div>

                    <nav class="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                        @if (userRole() === 'trainer' || userRole() === 'admin') {
                            <a routerLink="/dashboard"
                               (click)="closeSidebarMobile()"
                               routerLinkActive="bg-white/20 text-white"
                               [title]="!sidebarExpanded() ? 'Dashboard' : ''"
                               class="sidebar-link flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                </svg>
                                @if (sidebarExpanded()) {
                                    <span class="font-medium">Dashboard</span>
                                }
                            </a>
                        }

                        <a routerLink="/students"
                           (click)="closeSidebarMobile()"
                           routerLinkActive="bg-white/20 text-white"
                           [title]="!sidebarExpanded() ? 'Alumnos' : ''"
                           class="sidebar-link flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                            <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            @if (sidebarExpanded()) {
                                <span class="font-medium">Alumnos</span>
                            }
                        </a>

                        <a routerLink="/exercises"
                           (click)="closeSidebarMobile()"
                           routerLinkActive="bg-white/20 text-white"
                           [title]="!sidebarExpanded() ? 'Ejercicios' : ''"
                           class="sidebar-link flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                            <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/>
                            </svg>
                            @if (sidebarExpanded()) {
                                <span class="font-medium">Ejercicios</span>
                            }
                        </a>

                        @if (userRole() === 'trainer' || userRole() === 'admin') {
                            <a routerLink="/blocks"
                               (click)="closeSidebarMobile()"
                               routerLinkActive="bg-white/20 text-white"
                               [title]="!sidebarExpanded() ? 'Bloques' : ''"
                               class="sidebar-link flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                </svg>
                                @if (sidebarExpanded()) {
                                    <span class="font-medium">Bloques</span>
                                }
                            </a>
                        }

                        <a routerLink="/routines"
                           (click)="closeSidebarMobile()"
                           routerLinkActive="bg-white/20 text-white"
                           [title]="!sidebarExpanded() ? 'Rutinas' : ''"
                           class="sidebar-link flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                            <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                            </svg>
                            @if (sidebarExpanded()) {
                                <span class="font-medium">Rutinas</span>
                            }
                        </a>

                        @if (userRole() === 'trainer' || userRole() === 'admin') {
                            <a routerLink="/programs"
                               (click)="closeSidebarMobile()"
                               routerLinkActive="bg-white/20 text-white"
                               [title]="!sidebarExpanded() ? 'Programas' : ''"
                               class="sidebar-link flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                @if (sidebarExpanded()) {
                                    <span class="font-medium">Programas</span>
                                }
                            </a>

                            <a routerLink="/trainer/payment-plans"
                               (click)="closeSidebarMobile()"
                               routerLinkActive="bg-white/20 text-white"
                               [title]="!sidebarExpanded() ? 'Planes' : ''"
                               class="sidebar-link flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                </svg>
                                @if (sidebarExpanded()) {
                                    <span class="font-medium">Planes</span>
                                }
                            </a>

                            <a routerLink="/trainer/payments"
                               (click)="closeSidebarMobile()"
                               routerLinkActive="bg-white/20 text-white"
                               [title]="!sidebarExpanded() ? 'Pagos' : ''"
                               class="sidebar-link flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                @if (sidebarExpanded()) {
                                    <span class="font-medium">Pagos</span>
                                }
                            </a>
                        }

                        @if (userRole() === 'student') {
                            <a routerLink="/my-routine"
                               (click)="closeSidebarMobile()"
                               routerLinkActive="bg-white/20 text-white"
                               [title]="!sidebarExpanded() ? 'Mi Rutina' : ''"
                               class="sidebar-link flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                                </svg>
                                @if (sidebarExpanded()) {
                                    <span class="font-medium">Mi Rutina</span>
                                }
                            </a>

                            <a routerLink="/my-program"
                               (click)="closeSidebarMobile()"
                               routerLinkActive="bg-white/20 text-white"
                               [title]="!sidebarExpanded() ? 'Mi Programa' : ''"
                               class="sidebar-link flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                @if (sidebarExpanded()) {
                                    <span class="font-medium">Mi Programa</span>
                                }
                            </a>

                            <a routerLink="/student/payments/plans"
                               (click)="closeSidebarMobile()"
                               routerLinkActive="bg-white/20 text-white"
                               [title]="!sidebarExpanded() ? 'Planes' : ''"
                               class="sidebar-link flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                </svg>
                                @if (sidebarExpanded()) {
                                    <span class="font-medium">Planes</span>
                                }
                            </a>

                            <a routerLink="/student/payments/history"
                               (click)="closeSidebarMobile()"
                               routerLinkActive="bg-white/20 text-white"
                               [title]="!sidebarExpanded() ? 'Mis Pagos' : ''"
                               class="sidebar-link flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                @if (sidebarExpanded()) {
                                    <span class="font-medium">Mis Pagos</span>
                                }
                            </a>
                        }
                    </nav>

                    <div class="border-t border-white/10 p-2 space-y-1">
                        <button (click)="toggleTheme()"
                                [title]="!sidebarExpanded() ? 'Cambiar tema' : ''"
                                class="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                            <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                @if (darkMode()) {
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                } @else {
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                                }
                            </svg>
                            @if (sidebarExpanded()) {
                                <span class="font-medium">{{ darkMode() ? 'Claro' : 'Oscuro' }}</span>
                            }
                        </button>

                        <a routerLink="/profile"
                           (click)="closeSidebarMobile()"
                           [title]="!sidebarExpanded() ? userName() : ''"
                           class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                            <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            @if (sidebarExpanded()) {
                                <span class="font-medium truncate">{{ userName() }}</span>
                            }
                        </a>

                        <button (click)="logout()"
                                [title]="!sidebarExpanded() ? 'Cerrar sesión' : ''"
                                class="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                            <svg class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                            @if (sidebarExpanded()) {
                                <span class="font-medium">Salir</span>
                            }
                        </button>
                    </div>
                </aside>
            }

            <div [class.lg:ml-64]="isAuthenticated() && sidebarExpanded()"
                 [class.lg:ml-16]="isAuthenticated() && !sidebarExpanded()"
                 class="min-h-screen flex flex-col transition-all duration-300">
                <main class="flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full"
                      [class.pb-24]="isAuthenticated()">
                    <router-outlet></router-outlet>
                </main>

                <footer class="py-4 sm:py-6 border-t border-white/10 backdrop-blur-sm lg:block"
                        [class.mb-20]="isAuthenticated()">
                    <div class="px-4 sm:px-6 lg:px-8">
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

            @if (isAuthenticated()) {
                <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/10">
                    <div class="grid grid-cols-5 h-16">
                        @if (userRole() === 'trainer' || userRole() === 'admin') {
                            <a routerLink="/dashboard"
                               (click)="closeMobileMenu()"
                               routerLinkActive="text-white bg-white/20"
                               class="flex flex-col items-center justify-center text-white/70 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                </svg>
                                <span class="text-xs mt-1">Inicio</span>
                            </a>
                            <a routerLink="/students"
                               (click)="closeMobileMenu()"
                               routerLinkActive="text-white bg-white/20"
                               class="flex flex-col items-center justify-center text-white/70 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                <span class="text-xs mt-1">Alumnos</span>
                            </a>
                            <a routerLink="/exercises"
                               (click)="closeMobileMenu()"
                               routerLinkActive="text-white bg-white/20"
                               class="flex flex-col items-center justify-center text-white/70 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/>
                                </svg>
                                <span class="text-xs mt-1">Ejercicios</span>
                            </a>
                            <a routerLink="/routines"
                               (click)="closeMobileMenu()"
                               routerLinkActive="text-white bg-white/20"
                               class="flex flex-col items-center justify-center text-white/70 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                                </svg>
                                <span class="text-xs mt-1">Rutinas</span>
                            </a>
                            <button (click)="toggleMobileMenu()" [ngClass]="{'text-white bg-white/20': mobileMenuOpen()}" class="flex flex-col items-center justify-center text-white/70 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                <span class="text-xs mt-1">Más</span>
                            </button>
                        }
                        @if (userRole() === 'student') {
                            <a routerLink="/my-routine"
                               (click)="closeMobileMenu()"
                               routerLinkActive="text-white bg-white/20"
                               class="flex flex-col items-center justify-center text-white/70 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                                </svg>
                                <span class="text-xs mt-1">Mi Rutina</span>
                            </a>
                            <a routerLink="/my-program"
                               (click)="closeMobileMenu()"
                               routerLinkActive="text-white bg-white/20"
                               class="flex flex-col items-center justify-center text-white/70 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <span class="text-xs mt-1">Programa</span>
                            </a>
                            <a routerLink="/exercises"
                               (click)="closeMobileMenu()"
                               routerLinkActive="text-white bg-white/20"
                               class="flex flex-col items-center justify-center text-white/70 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/>
                                </svg>
                                <span class="text-xs mt-1">Ejercicios</span>
                            </a>
                            <a routerLink="/student/payments/plans"
                               (click)="closeMobileMenu()"
                               routerLinkActive="text-white bg-white/20"
                               class="flex flex-col items-center justify-center text-white/70 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                </svg>
                                <span class="text-xs mt-1">Planes</span>
                            </a>
                            <button (click)="toggleMobileMenu()" [ngClass]="{'text-white bg-white/20': mobileMenuOpen()}" class="flex flex-col items-center justify-center text-white/70 hover:text-white transition-all duration-200">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                <span class="text-xs mt-1">Más</span>
                            </button>
                        }
                    </div>
                </nav>

                @if (mobileMenuOpen()) {
                    <div (click)="closeMobileMenu()" class="lg:hidden fixed inset-0 bg-black/50 z-30"></div>
                    <div class="lg:hidden fixed bottom-16 left-0 right-0 z-40 glass border-t border-white/10 max-h-80 overflow-y-auto">
                        <div class="p-4 space-y-2">
                            @if (userRole() === 'trainer' || userRole() === 'admin') {
                                <a routerLink="/blocks"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                    </svg>
                                    <span class="font-medium">Bloques</span>
                                </a>

                                <a routerLink="/programs"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                    <span class="font-medium">Programas</span>
                                </a>

                                <a routerLink="/trainer/payment-plans"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                    </svg>
                                    <span class="font-medium">Planes de Pago</span>
                                </a>

                                <a routerLink="/trainer/payments"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span class="font-medium">Gestión de Pagos</span>
                                </a>
                            }

                            @if (userRole() === 'student') {
                                <a routerLink="/student/payments/history"
                                   (click)="closeMobileMenu()"
                                   routerLinkActive="bg-white/20 text-white"
                                   class="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span class="font-medium">Mis Pagos</span>
                                </a>
                            }

                            <div class="border-t border-white/10 pt-2 mt-2">
                                <button type="button" (click)="toggleTheme(); closeMobileMenu()"
                                        class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        @if (darkMode()) {
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                        } @else {
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                                        }
                                    </svg>
                                    <span class="font-medium">Tema {{ darkMode() ? 'Claro' : 'Oscuro' }}</span>
                                </button>

                                <a routerLink="/profile"
                                   (click)="closeMobileMenu()"
                                   class="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                    <span class="font-medium">{{ userName() }}</span>
                                </a>

                                <button type="button" (click)="logout()"
                                        class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                    </svg>
                                    <span class="font-medium">Cerrar Sesión</span>
                                </button>
                            </div>
                        </div>
                    </div>
                }
            }
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
    sidebarExpanded = signal(true);
    sidebarMobileOpen = signal(false);

    constructor(private keycloakService: KeycloakService) {
        const savedTheme = localStorage.getItem('theme');
        this.darkMode.set(savedTheme ? savedTheme === 'dark' : true);
        this.applyThemeToBody();

        const savedSidebarState = localStorage.getItem('sidebarExpanded');
        this.sidebarExpanded.set(savedSidebarState ? savedSidebarState === 'true' : true);

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

    toggleSidebar() {
        this.sidebarExpanded.update(v => !v);
        localStorage.setItem('sidebarExpanded', this.sidebarExpanded().toString());
    }

    toggleSidebarMobile() {
        this.sidebarMobileOpen.update(v => !v);
    }

    closeSidebarMobile() {
        this.sidebarMobileOpen.set(false);
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
