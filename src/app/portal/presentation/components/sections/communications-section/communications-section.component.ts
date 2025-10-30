import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AnimateOnScroll } from 'primeng/animateonscroll';
import { CarouselModule } from 'primeng/carousel';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'communications-section',
  imports: [
    RouterModule,
    CommonModule,
    CarouselModule,
    ButtonModule,
    AnimateOnScroll,
  ],
  template: `
    <section class="py-20  bg-gradient-to-b from-primary-600 via-primary-700 to-primary-900 text-white">
      <div class="max-w-7xl mx-auto px-2"  pAnimateOnScroll
            enterClass="animate-enter fade-in-10 slide-in-from-t-20 animate-duration-1000"
            threshold="0.1"
            leaveClass="animate-leave fade-out-0">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-3">Comunicados</h2>
          <p class="text-primary-100 text-sm md:text-base max-w-2xl mx-auto">
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
              class="relative block m-2 overflow-hidden rounded-2xl shadow-lg bg-white cursor-pointer
                 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              [routerLink]="['/communications', com.id]"
            >
              <div class="absolute top-2 right-2 z-20">
                <span
                  class="text-xs font-semibold text-white bg-primary-600/90 px-2 py-1 rounded-md shadow-sm"
                >
                  {{ com.type.name }}
                </span>
              </div>

              <div class="relative">
                <img
                  [src]="com.previewUrl"
                  [alt]="com.reference"
                  class="w-full h-[420px] sm:h-[520px] object-cover object-top bg-surface-100"
                />
                <div
                  class="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent backdrop-blur-[2px]"
                >
                  <p class="text-sm text-white mb-1">
                    {{ com.publicationDate | date : 'd MMMM, y' }}
                  </p>
                  <h3
                    class="text-lg font-semibold leading-snug text-white line-clamp-2"
                  >
                    {{ com.reference }}
                  </h3>
                  <p class="text-xs opacity-80 text-white truncate">
                    Cite: {{ com.code }}
                  </p>
                </div>
              </div>
            </a>
          </ng-template>
        </p-carousel>
        <div class="text-center mt-10">
          <a routerLink="communications" pButton [rounded]="true">
            <span pButtonLabel>Ver mas comunicados</span>
            <i class="pi pi-arrow-right" pButtonIcon></i>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: `
    /*:host ::ng-deep .p-carousel-item {
      max-width: 520px;
      margin: 0 auto;
    }*/
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunicationsSectionComponent {
  communications = input.required<any[]>();
  readonly responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '1199px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
}
