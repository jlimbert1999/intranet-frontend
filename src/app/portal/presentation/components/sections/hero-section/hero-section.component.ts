import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

import { HeroSlideResponse } from '../../../../../administration/infrastructure';

@Component({
  selector: 'hero-section',
  imports: [CarouselModule, ButtonModule],
  template: `
    <div class="py-6">
      <div
        class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4"
      >
        <div class="flex items-center gap-3 text-center md:text-left">
          <img
            src="images/icons/app.png"
            alt="Logo app"
            class="h-16 w-auto hidden md:block"
          />
          <div>
            <h1
              class="text-lg md:text-3xl font-bold text-primary-800 leading-tight"
            >
              Intranet
            </h1>
            <p class="text-xs md:text-xl text-gray-500">
              Gobierno Autónomo Municipal de Sacaba
            </p>
          </div>
        </div>
        <img
          src="images/icons/alcaldia.png"
          alt="Logo Municipio"
          class="h-20 hidden md:block"
        />
      </div>
    </div>
    <p-carousel
      [value]="slides() ?? []"
      [numVisible]="1"
      [numScroll]="1"
      circular
      [autoplayInterval]="6000"
      [contentClass]="'bg-black w-full'"
    >
      <ng-template let-slide pTemplate="item">
        <div
          class="relative h-[500px] bg-cover bg-center "
          [style.backgroundImage]="'url(' + slide.image + ')'"
        >
          <div
            class="absolute inset-0 bg-black/40 flex flex-col justify-center items-start text-white text-left px-6 md:px-16"
          >
            <h2
              class="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg max-w-xl text"
            >
              {{ slide.title }}
            </h2>
            <p class="max-w-lg text-lg md:text-2xl">{{ slide.description }}</p>
            <!-- <button pButton>Ver mas</button> -->
          </div>
        </div>
      </ng-template>
    </p-carousel>
  `,
  styles:`

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent {
  slides = input<HeroSlideResponse[]>();
}
