import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollStateService {
  private positions = new Map<string, number>();

  set(routeKey: string, position: number) {
    this.positions.set(routeKey, position);
  }

  get(routeKey: string): number | null {
    return this.positions.get(routeKey) ?? null;
  }
}
