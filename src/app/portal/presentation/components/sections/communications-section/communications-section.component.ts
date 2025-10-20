import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'communications-section',
  imports: [CommonModule, CarouselModule],
  template: `
    <section
      class="py-12 bg-gradient-to-b from-blue-900 to-blue-800 text-white"
    >
      <div class="container mx-auto px-6">
        <div
          class="flex flex-col md:flex-row justify-between items-center mb-6"
        >
          <div>
            <h2 class="text-3xl font-bold mb-2">Comunicados</h2>
            <p class="text-blue-200 max-w-md">
              Mantente informado con los últimos comunicados institucionales.
            </p>
          </div>
          <button
            pButton
            label="Ver todos"
            class="p-button-rounded p-button-success mt-4 md:mt-0"
            routerLink="/comunicados"
          ></button>
        </div>

        <p-carousel
          [value]="comunicados"
          [numVisible]="3"
          [numScroll]="1"
          [circular]="true"
          [responsiveOptions]="[
            { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
            { breakpoint: '768px', numVisible: 1, numScroll: 1 }
          ]"
        >
          <ng-template pTemplate="item" let-com>
            <a
              [href]="com.pdfUrl"
              target="_blank"
              class="block bg-white text-gray-700 rounded-xl overflow-hidden shadow-lg mx-2 hover:shadow-2xl transition "
            >
              <!-- Miniatura PDF o placeholder -->
              <div
                class="relative h-64 bg-gray-100 flex justify-center items-center"
              >
                <img
                  *ngIf="com.previewImage"
                  [src]="com.previewImage"
                  alt="preview"
                  class="h-full w-full object-cover"
                />
                <div
                  *ngIf="!com.previewImage"
                  class="absolute inset-0 flex flex-col justify-center items-center text-gray-400"
                >
                  <i class="pi pi-file-pdf text-6xl mb-2 text-red-500"></i>
                  <span class="text-sm font-medium"
                    >Vista previa no disponible</span
                  >
                </div>
                <span
                  class="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full"
                  >COMUNICADO</span
                >
              </div>

              <div class="p-4">
                <span class="text-xs text-gray-400 block">{{
                  com.date | date : 'longDate'
                }}</span>
                <h3 class="font-semibold text-lg mt-1 line-clamp-2">
                  {{ com.title }}
                </h3>
                <p class="text-sm text-gray-500 mb-3">{{ com.code }}</p>
              </div>
            </a>
          </ng-template>
        </p-carousel>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunicationsSectionComponent {
  comunicados = [
    { date: new Date(), title: 'Ejemplo1 ', pdfUrl: '', code: 'ci-29023-22' },
    { date: new Date(), title: 'Ejemplo1 ', pdfUrl: '', code: 'ci-29023-22' },
    { date: new Date(), title: 'Ejemplo1 ', pdfUrl: '', code: 'ci-29023-22' },
    { date: new Date(), title: 'Ejemplo1 ', pdfUrl: '', code: 'ci-29023-22' },
    { date: new Date(), title: 'Ejemplo1 ', pdfUrl: '', code: 'ci-29023-22' },
  ];
}
