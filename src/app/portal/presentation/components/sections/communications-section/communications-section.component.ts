import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'communications-section',
  imports: [RouterModule, CommonModule, CarouselModule, ButtonModule],
  template: `
    <section class="py-16 bg-primary-700 text-white">
      <div class="container mx-auto">
        <div class="text-center mb-10 px-6">
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
          [responsiveOptions]="responsiveOptions"
        >
          <ng-template pTemplate="item" let-com>
            <a
              class="relative block m-2 overflow-hidden rounded-2xl shadow-md bg-white cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:brightness-90"
              [routerLink]="['communications', com.id]"
              >
              <div class="absolute top-2 right-2 z-10">
                <span class="text-sm font-semibold text-white bg-primary-600/90 px-2 py-1 rounded">
                  {{ com.type.name | uppercase }}
                </span>
              </div>
              <img
                [src]="com.previewUrl"
                [alt]="com.reference"
                class="w-full h-[400px] sm:h-[520px] object-contain"
              />
              <div class="bg-primary-900 p-4">
                <p class="text-lg opacity-80">
                  {{ com.publicationDate | date : 'd MMMM, y' }}
                </p>
                <h3 class="text-lg font-semibold mt-1 line-clamp-2">
                  {{ com.reference }}
                </h3>
                <p class="text-xs mt-1 opacity-90 truncate">
                  {{ com.code }}
                </p>
              </div>
            </a>
          </ng-template>
        </p-carousel>
        <div class="text-center mt-4">
           <a routerLink="communications" pButton [rounded]="true" >
             <span pButtonLabel>Ver mas comunicados</span>
             <i class="pi pi-arrow-right" pButtonIcon></i>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host ::ng-deep .p-carousel-item {
      max-width: 520px;
      margin: 0 auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunicationsSectionComponent {
  communications = input.required<any[]>();
  readonly responsiveOptions = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 },
  ];
}
