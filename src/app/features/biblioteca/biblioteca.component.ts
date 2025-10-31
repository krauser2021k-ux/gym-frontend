import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Biblioteca</h1>
      </div>

      <div class="glass rounded-lg p-2 overflow-x-auto">
        <nav class="flex gap-1 min-w-max">
          <a routerLink="/biblioteca/ejercicios"
             routerLinkActive="bg-white/30 text-white"
             class="flex-1 px-6 py-3 text-white/70 font-medium rounded-lg transition-all duration-200 hover:bg-white/20 hover:text-white text-center whitespace-nowrap">
            EJERCICIOS
          </a>
          <a routerLink="/biblioteca/bloques"
             routerLinkActive="bg-white/30 text-white"
             class="flex-1 px-6 py-3 text-white/70 font-medium rounded-lg transition-all duration-200 hover:bg-white/20 hover:text-white text-center whitespace-nowrap">
            BLOQUES
          </a>
          <a routerLink="/biblioteca/rutinas"
             routerLinkActive="bg-white/30 text-white"
             class="flex-1 px-6 py-3 text-white/70 font-medium rounded-lg transition-all duration-200 hover:bg-white/20 hover:text-white text-center whitespace-nowrap">
            RUTINAS
          </a>
          <a routerLink="/biblioteca/programas"
             routerLinkActive="bg-white/30 text-white"
             class="flex-1 px-6 py-3 text-white/70 font-medium rounded-lg transition-all duration-200 hover:bg-white/20 hover:text-white text-center whitespace-nowrap">
            PROGRAMAS
          </a>
        </nav>
      </div>

      <div class="animate-fadeIn">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `]
})
export class BibliotecaComponent {}
