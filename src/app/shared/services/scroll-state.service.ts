import { computed, Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ScrollStateService {
  private _restore = signal<boolean>(false);
  restore = computed(() => this._restore());

  private positions = new Map<string, number>();

  set(routeKey: string, position: number) {
    // * call method on scroll-directive  destroy
    this._restore.set(false);
    this.positions.set(routeKey, position);
  }

  get(routeKey: string): number | null {
    return this.positions.get(routeKey) ?? null;
  }

  keepScroll() {
    this._restore.set(true);
  }
}
