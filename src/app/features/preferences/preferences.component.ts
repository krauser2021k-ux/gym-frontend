import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../../core/local-storage.service';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-4xl">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Preferencias de UI</h1>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tema</h3>
          <div class="flex space-x-4">
            <button (click)="setTheme('light')"
                    [class.ring-2]="theme() === 'light'"
                    class="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 transition-all">
              <svg class="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Claro</p>
            </button>
            <button (click)="setTheme('dark')"
                    [class.ring-2]="theme() === 'dark'"
                    class="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 transition-all">
              <svg class="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Oscuro</p>
            </button>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Color Primario</h3>
          <div class="grid grid-cols-5 gap-3">
            @for (color of colors; track color.name) {
              <button (click)="setPrimaryColor(color.value)"
                      [class.ring-2]="primaryColor() === color.value"
                      [class.ring-offset-2]="primaryColor() === color.value"
                      class="w-full aspect-square rounded-lg transition-all hover:scale-110"
                      [style.backgroundColor]="color.value">
              </button>
            }
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Animaciones</h3>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" [(ngModel)]="animationsEnabled"
                   (change)="toggleAnimations()"
                   class="w-5 h-5 text-primary-600 rounded">
            <span class="text-gray-900 dark:text-white">Activar animaciones suaves</span>
          </label>
        </div>

        <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button (click)="resetPreferences()"
                  class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Restaurar por Defecto
          </button>
          <button (click)="savePreferences()"
                  class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
            Guardar Cambios
          </button>
        </div>
      </div>

      @if (saved()) {
        <div class="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <p class="text-green-800 dark:text-green-200">✓ Preferencias guardadas exitosamente</p>
        </div>
      }
    </div>
  `,
  styles: []
})
export class PreferencesComponent implements OnInit {
  theme = signal('light');
  primaryColor = signal('#22c55e');
  animationsEnabled = true;
  saved = signal(false);

  colors = [
    { name: 'Verde', value: '#22c55e' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Púrpura', value: '#8b5cf6' },
    { name: 'Rojo', value: '#ef4444' },
    { name: 'Naranja', value: '#f59e0b' }
  ];

  constructor(private localStorage: LocalStorageService) {}

  ngOnInit() {
    const prefs = this.localStorage.getItem<any>('ui-preferences');
    if (prefs) {
      this.theme.set(prefs.theme || 'light');
      this.primaryColor.set(prefs.primaryColor || '#22c55e');
      this.animationsEnabled = prefs.animationsEnabled !== false;
      this.applyPreferences();
    }
  }

  setTheme(theme: 'light' | 'dark') {
    this.theme.set(theme);
    this.applyPreferences();
  }

  setPrimaryColor(color: string) {
    this.primaryColor.set(color);
    this.applyPreferences();
  }

  toggleAnimations() {
    document.documentElement.style.setProperty(
      '--transition-duration',
      this.animationsEnabled ? '200ms' : '0ms'
    );
  }

  savePreferences() {
    const prefs = {
      theme: this.theme(),
      primaryColor: this.primaryColor(),
      animationsEnabled: this.animationsEnabled
    };
    this.localStorage.setItem('ui-preferences', prefs);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }

  resetPreferences() {
    this.theme.set('light');
    this.primaryColor.set('#22c55e');
    this.animationsEnabled = true;
    this.applyPreferences();
    this.localStorage.removeItem('ui-preferences');
  }

  private applyPreferences() {
    if (this.theme() === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.style.setProperty('--color-primary', this.primaryColor());
  }
}
