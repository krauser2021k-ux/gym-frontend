import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Block } from '../../shared/models';

@Component({
  selector: 'app-blocks-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Bloques Preestablecidos</h1>
        <button (click)="createBlock()"
                class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200">
          Crear Bloque
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (block of blocks(); track block.id) {
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ block.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ block.description }}</p>
                </div>
                <span class="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                  {{ block.exercises.length }} ejercicios
                </span>
              </div>

              <div class="space-y-2 mb-4">
                @for (ex of block.exercises.slice(0, 3); track ex.order) {
                  <div class="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <span class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium mr-2">
                      {{ ex.order }}
                    </span>
                    <span>{{ ex.sets }} x {{ ex.reps }}</span>
                  </div>
                }
                @if (block.exercises.length > 3) {
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    + {{ block.exercises.length - 3 }} más
                  </div>
                }
              </div>

              <div class="flex space-x-2">
                <button (click)="editBlock(block.id)"
                        class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors font-medium text-sm">
                  Editar
                </button>
                <button (click)="duplicateBlock(block.id)"
                        class="flex-1 px-4 py-2 bg-primary-50 dark:bg-primary-900 hover:bg-primary-100 dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-lg transition-colors font-medium text-sm">
                  Duplicar
                </button>
                <button (click)="deleteBlock(block.id)"
                        class="px-4 py-2 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg transition-colors font-medium text-sm">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class BlocksListComponent implements OnInit {
  blocks = signal<any[]>([]);
  loading = signal(true);

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBlocks();
  }

  loadBlocks() {
    this.apiService.get<any[]>('/blocks').subscribe({
      next: (data) => {
        this.blocks.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading blocks:', err);
        this.loading.set(false);
      }
    });
  }

  createBlock() {
    console.log('Create block');
  }

  editBlock(id: string) {
    console.log('Edit block:', id);
  }

  duplicateBlock(id: string) {
    this.apiService.post(`/blocks/${id}/duplicate`, {}).subscribe({
      next: () => {
        this.loadBlocks();
      },
      error: (err) => console.error('Error duplicating block:', err)
    });
  }

  deleteBlock(id: string) {
    if (confirm('¿Estás seguro de eliminar este bloque?')) {
      this.apiService.delete(`/blocks/${id}`).subscribe({
        next: () => {
          this.loadBlocks();
        },
        error: (err) => console.error('Error deleting block:', err)
      });
    }
  }
}
