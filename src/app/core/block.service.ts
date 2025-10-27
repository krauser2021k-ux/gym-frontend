import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BlockPreset } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  constructor(private apiService: ApiService) {}

  getBlocks(): Observable<BlockPreset[]> {
    return this.apiService.get<BlockPreset[]>('/blocks');
  }

  getBlockById(id: string): Observable<BlockPreset> {
    return this.apiService.get<BlockPreset>(`/blocks/${id}`);
  }

  createBlock(block: Partial<BlockPreset>): Observable<BlockPreset> {
    return this.apiService.post<BlockPreset>('/blocks', block);
  }

  updateBlock(id: string, block: Partial<BlockPreset>): Observable<BlockPreset> {
    return this.apiService.put<BlockPreset>(`/blocks/${id}`, block);
  }

  deleteBlock(id: string): Observable<void> {
    return this.apiService.delete<void>(`/blocks/${id}`);
  }

  duplicateBlock(id: string): Observable<BlockPreset> {
    return this.apiService.post<BlockPreset>(`/blocks/${id}/duplicate`, {});
  }
}
