import { inject, Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiBreakpointObserver {
  private breakpointObserver = inject(BreakpointObserver);

  isMobile = toSignal(
    this.breakpointObserver
      .observe(['(max-width: 640px)'])
      .pipe(map((r) => r.matches)),
    { initialValue: false }
  );
}
