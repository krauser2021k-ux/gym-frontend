import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { Gym } from '../../shared/models';

@Component({
  selector: 'app-gyms-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Gimnasios</h1>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (gym of gyms(); track gym.id) {
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
              @if (gym.logoUrl) {
                <img [src]="gym.logoUrl" [alt]="gym.name" class="w-full h-48 object-cover">
              }
              <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ gym.name }}</h3>
                <div class="space-y-2">
                  <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ gym.address }}
                  </div>
                  <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {{ gym.phone }}
                  </div>
                  <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ gym.email }}
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class GymsListComponent implements OnInit {
  gyms = signal<Gym[]>([]);
  loading = signal(true);

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.get<Gym[]>('/gyms').subscribe({
      next: (data) => {
        this.gyms.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading gyms:', err);
        this.loading.set(false);
      }
    });
  }
}
