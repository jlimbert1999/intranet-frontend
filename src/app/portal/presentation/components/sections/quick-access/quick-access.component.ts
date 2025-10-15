import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortalService } from '../../../services/portal.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'quick-access',
  imports: [CommonModule],
  template: `
    <section class="py-14 bg-gradient-to-b from-sky-50 to-white">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
          Accesos Directos
        </h2>
        <p class="text-gray-500 mb-10 max-w-2xl mx-auto text-lg">
          Accede fácilmente a los principales sistemas y servicios
          institucionales
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          @for (access of quickAccessItems(); track $index) {
            <a
             
              [href]="access.url"
              target="'_blank'"
              class="group relative bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center border border-gray-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <!-- Imagen circular -->
              <div
                class="w-16 h-16 rounded-full overflow-hidden mb-4 bg-gray-100 flex items-center justify-center"
              >
                <img
                  [src]="access.image"
                  [alt]="access.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
  
              <span
                class="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center"
              >
                {{ access.name }}
              </span>
  
              <!-- Efecto de fondo hover -->
              <div
                class="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/40 rounded-2xl transition-all duration-300"
              ></div>
            </a>

          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickAccessComponent {
  quickAccessItems = toSignal(inject(PortalService).getQuickAccess(), {
    initialValue: [],
  });


}
