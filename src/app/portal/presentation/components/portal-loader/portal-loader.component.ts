import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'portal-loader',
  imports: [ProgressSpinnerModule],
  template: `
    <div
      class="fixed inset-0 flex flex-col items-center justify-center z-50"
    >
      <p-progressSpinner
        strokeWidth="6"
        fill="transparent"
        [style]="{ width: '120px', height: '120px' }"
      />
      <p class="mt-4 text-gray-500 font-medium tracking-wide">
        Cargando contenido...
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalLoaderComponent {}
