import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'communications-section',
  imports: [CommonModule, CarouselModule, ButtonModule],
  template: `
    <section class="py-16 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white">
      <div class="container mx-auto px-6">
        <div class="text-center mb-10">
          <h2 class="text-3xl md:text-4xl font-bold mb-2">Comunicados</h2>
          <p class="text-blue-200 text-sm md:text-base max-w-2xl mx-auto">
            Mantente informado con los últimos comunicados institucionales.
          </p>
        </div>
        <p-carousel
          [value]="communications()"
          [numVisible]="3"
          [numScroll]="1"
          [circular]="true"
          [responsiveOptions]="[
            { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
            { breakpoint: '768px', numVisible: 1, numScroll: 1 }
          ]"
        >
          <ng-template pTemplate="item" let-com>
            <div class="p-4">
              <a
                [href]="com.pdfUrl"
                target="_blank"
                class="block bg-white text-gray-700 rounded-xl overflow-hidden shadow-lg mx-2 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out"
              >
                <div
                  class="relative aspect-[3/4] w-full max-h-[400px] bg-gray-100 flex justify-center items-center overflow-hidden"
                >
                  @if(com.previewUrl){
                    <img
                      [src]="com.previewUrl"
                      alt="preview"
                      class="max-h-full max-w-full object-contain transition-transform duration-300"
                    />
                  }
                  @else {
                    <div class="absolute inset-0 flex flex-col justify-center items-center text-gray-400">
                      <i class="pi pi-file-pdf mb-4 text-red-500" style="font-size: 2rem;"></i>
                      <span class="font-medium">Vista previa no disponible</span>
                    </div>
                  }
                  <span class="absolute top-3 right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md font-semibold">
                    COMUNICADO
                  </span>
                </div>

                <div class="p-4">
                  <span class="text-xs text-gray-400 block">
                    {{ com.publicationDate | date : 'longDate' }}
                  </span>
                  <h3 class="font-semibold text-lg mt-1 line-clamp-2 leading-snug">
                    {{ com.reference }} Dolore nisi amet sit ex id minim sit quis id aliquip duis deserunt.
                  </h3>

                  <p class="text-sm text-gray-500 mb-3">{{ com.code }}</p>
                </div>
              </a>
            </div>
          </ng-template>
        </p-carousel>
        <div class="text-center mt-4">
          <button
            pButton
            label="Ver más comunicados"
            [rounded]="true"
            icon="pi pi-arrow-right"
          ></button>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunicationsSectionComponent {
  communications = input.required<any[]>();
}
