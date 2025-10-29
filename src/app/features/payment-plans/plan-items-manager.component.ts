import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentPlanItem, ItemCategory } from '../../shared/models/payment.model';
import { PaymentPlanService } from '../../core/payment-plan.service';

@Component({
  selector: 'app-plan-items-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Items del Plan</h3>
        <button (click)="toggleAddMode()"
                type="button"
                class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Agregar Item
        </button>
      </div>

      @if (addingItem()) {
        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3 border-2 border-blue-500">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoría
              </label>
              <select [(ngModel)]="newItem.category"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm">
                <option value="acceso">Acceso</option>
                <option value="clases">Clases</option>
                <option value="seguimiento">Seguimiento</option>
                <option value="nutricion">Nutrición</option>
                <option value="extras">Extras</option>
              </select>
            </div>
            <div class="flex items-end">
              <button (click)="showLibrary = !showLibrary"
                      type="button"
                      class="w-full px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                {{ showLibrary ? 'Ocultar' : 'Ver' }} Biblioteca
              </button>
            </div>
          </div>

          @if (showLibrary) {
            <div class="bg-white dark:bg-gray-800 rounded-lg p-3 max-h-40 overflow-y-auto">
              <p class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Items sugeridos en {{ getCategoryLabel(newItem.category) }}:
              </p>
              <div class="space-y-1">
                @for (suggestion of getSuggestions(newItem.category); track suggestion) {
                  <button (click)="useSuggestion(suggestion)"
                          type="button"
                          class="w-full text-left px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    {{ suggestion }}
                  </button>
                }
              </div>
            </div>
          }

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <input type="text"
                   [(ngModel)]="newItem.description"
                   placeholder="Ej: Acceso ilimitado al gimnasio"
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm">
          </div>

          <div class="flex gap-2">
            <button (click)="addItem()"
                    type="button"
                    [disabled]="!newItem.description.trim()"
                    class="flex-1 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Agregar
            </button>
            <button (click)="cancelAdd()"
                    type="button"
                    class="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      }

      @if (items().length === 0) {
        <div class="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">No hay items agregados</p>
          <p class="text-xs text-gray-500 dark:text-gray-500">Haz clic en "Agregar Item" para comenzar</p>
        </div>
      } @else {
        <div class="space-y-2">
          @for (item of itemsByCategory(); track $index) {
            @if (item.isCategory) {
              <div class="flex items-center gap-2 mt-4 first:mt-0">
                <span [class]="getCategoryColorClass(item.category!)"
                      class="h-1 w-8 rounded"></span>
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ getCategoryLabel(item.category!) }}
                </h4>
              </div>
            } @else {
              <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div [class]="getCategoryIconBg(item.item!.category)"
                     class="p-2 rounded-lg flex-shrink-0">
                  <svg class="h-4 w-4" [class]="getCategoryIconColor(item.item!.category)"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900 dark:text-white truncate">
                    {{ item.item!.description }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getCategoryLabel(item.item!.category) }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button (click)="moveUp($index)"
                          type="button"
                          [disabled]="!canMoveUp($index)"
                          class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button (click)="moveDown($index)"
                          type="button"
                          [disabled]="!canMoveDown($index)"
                          class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button (click)="removeItem($index)"
                          type="button"
                          class="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            }
          }
        </div>

        <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Total de items: <span class="font-semibold text-gray-900 dark:text-white">{{ items().length }}</span>
          </p>
        </div>
      }
    </div>
  `,
  styles: []
})
export class PlanItemsManagerComponent implements OnInit {
  @Input() items = signal<PaymentPlanItem[]>([]);
  @Output() itemsChange = new EventEmitter<PaymentPlanItem[]>();

  addingItem = signal(false);
  showLibrary = false;
  itemsLibrary = signal<Record<string, string[]>>({});

  newItem: { category: ItemCategory; description: string } = {
    category: 'acceso',
    description: ''
  };

  constructor(private paymentPlanService: PaymentPlanService) {}

  ngOnInit() {
    this.paymentPlanService.getItemsLibrary().subscribe({
      next: (library) => {
        this.itemsLibrary.set(library);
      },
      error: (err) => console.error('Error loading items library:', err)
    });
  }

  itemsByCategory() {
    const categories: ItemCategory[] = ['acceso', 'clases', 'seguimiento', 'nutricion', 'extras'];
    const result: Array<{ isCategory: boolean; category?: ItemCategory; item?: PaymentPlanItem }> = [];

    categories.forEach(category => {
      const categoryItems = this.items().filter(item => item.category === category);
      if (categoryItems.length > 0) {
        result.push({ isCategory: true, category });
        categoryItems.forEach(item => {
          result.push({ isCategory: false, item });
        });
      }
    });

    return result;
  }

  toggleAddMode() {
    this.addingItem.set(!this.addingItem());
    this.showLibrary = false;
    this.newItem = {
      category: 'acceso',
      description: ''
    };
  }

  addItem() {
    if (!this.newItem.description.trim()) return;

    const newItemObj: PaymentPlanItem = {
      id: `item-${Date.now()}`,
      description: this.newItem.description.trim(),
      included: true,
      category: this.newItem.category,
      order: this.items().length + 1
    };

    const updatedItems = [...this.items(), newItemObj];
    this.items.set(updatedItems);
    this.itemsChange.emit(updatedItems);
    this.cancelAdd();
  }

  cancelAdd() {
    this.addingItem.set(false);
    this.showLibrary = false;
    this.newItem = {
      category: 'acceso',
      description: ''
    };
  }

  removeItem(displayIndex: number) {
    const displayed = this.itemsByCategory();
    const itemToRemove = displayed[displayIndex].item;
    if (!itemToRemove) return;

    const updatedItems = this.items().filter(i => i.id !== itemToRemove.id);
    this.items.set(updatedItems);
    this.itemsChange.emit(updatedItems);
  }

  moveUp(displayIndex: number) {
    const displayed = this.itemsByCategory();
    const currentItem = displayed[displayIndex].item;
    if (!currentItem || !this.canMoveUp(displayIndex)) return;

    let prevItemIndex = displayIndex - 1;
    while (prevItemIndex >= 0 && displayed[prevItemIndex].isCategory) {
      prevItemIndex--;
    }

    if (prevItemIndex >= 0) {
      const prevItem = displayed[prevItemIndex].item!;
      const items = [...this.items()];
      const currentIdx = items.findIndex(i => i.id === currentItem.id);
      const prevIdx = items.findIndex(i => i.id === prevItem.id);

      [items[currentIdx], items[prevIdx]] = [items[prevIdx], items[currentIdx]];

      this.items.set(items);
      this.itemsChange.emit(items);
    }
  }

  moveDown(displayIndex: number) {
    const displayed = this.itemsByCategory();
    const currentItem = displayed[displayIndex].item;
    if (!currentItem || !this.canMoveDown(displayIndex)) return;

    let nextItemIndex = displayIndex + 1;
    while (nextItemIndex < displayed.length && displayed[nextItemIndex].isCategory) {
      nextItemIndex++;
    }

    if (nextItemIndex < displayed.length) {
      const nextItem = displayed[nextItemIndex].item!;
      const items = [...this.items()];
      const currentIdx = items.findIndex(i => i.id === currentItem.id);
      const nextIdx = items.findIndex(i => i.id === nextItem.id);

      [items[currentIdx], items[nextIdx]] = [items[nextIdx], items[currentIdx]];

      this.items.set(items);
      this.itemsChange.emit(items);
    }
  }

  canMoveUp(displayIndex: number): boolean {
    const displayed = this.itemsByCategory();
    if (displayed[displayIndex].isCategory) return false;

    for (let i = displayIndex - 1; i >= 0; i--) {
      if (!displayed[i].isCategory) return true;
    }
    return false;
  }

  canMoveDown(displayIndex: number): boolean {
    const displayed = this.itemsByCategory();
    if (displayed[displayIndex].isCategory) return false;

    for (let i = displayIndex + 1; i < displayed.length; i++) {
      if (!displayed[i].isCategory) return true;
    }
    return false;
  }

  getSuggestions(category: ItemCategory): string[] {
    return this.itemsLibrary()[category] || [];
  }

  useSuggestion(suggestion: string) {
    this.newItem.description = suggestion;
  }

  getCategoryLabel(category: ItemCategory): string {
    const labels: Record<ItemCategory, string> = {
      'acceso': 'Acceso',
      'clases': 'Clases',
      'seguimiento': 'Seguimiento',
      'nutricion': 'Nutrición',
      'extras': 'Extras'
    };
    return labels[category];
  }

  getCategoryColorClass(category: ItemCategory): string {
    const classes: Record<ItemCategory, string> = {
      'acceso': 'bg-blue-500',
      'clases': 'bg-green-500',
      'seguimiento': 'bg-amber-500',
      'nutricion': 'bg-red-500',
      'extras': 'bg-gray-500'
    };
    return classes[category];
  }

  getCategoryIconBg(category: ItemCategory): string {
    const classes: Record<ItemCategory, string> = {
      'acceso': 'bg-blue-100 dark:bg-blue-900',
      'clases': 'bg-green-100 dark:bg-green-900',
      'seguimiento': 'bg-amber-100 dark:bg-amber-900',
      'nutricion': 'bg-red-100 dark:bg-red-900',
      'extras': 'bg-gray-100 dark:bg-gray-700'
    };
    return classes[category];
  }

  getCategoryIconColor(category: ItemCategory): string {
    const classes: Record<ItemCategory, string> = {
      'acceso': 'text-blue-600 dark:text-blue-300',
      'clases': 'text-green-600 dark:text-green-300',
      'seguimiento': 'text-amber-600 dark:text-amber-300',
      'nutricion': 'text-red-600 dark:text-red-300',
      'extras': 'text-gray-600 dark:text-gray-300'
    };
    return classes[category];
  }
}
