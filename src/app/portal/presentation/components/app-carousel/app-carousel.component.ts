import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-carousel',
  imports: [CarouselModule, ButtonModule],
  template: `
    <p-carousel
      [value]="images()"
      [numVisible]="1"
      [numScroll]="1"
      circular
      [autoplayInterval]="6000"
      [contentClass]="'bg-black w-full'"
    >
      <ng-template let-slide pTemplate="item">
        <div
          class="relative h-[500px] bg-cover bg-center"
          [style.backgroundImage]="'url(' + slide + ')'"
        >
          <div
            class="absolute inset-0 bg-black/40 flex flex-col justify-center items-start text-white text-left px-6 md:px-16"
          >
            <h2
              class="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg max-w-xl"
            >
              Titulo
            </h2>
            <p class="max-w-lg text-lg md:text-xl">Subtitulo</p>
            <!-- <button pButton>Ver mas</button> -->
          </div>
        </div>
      </ng-template>
    </p-carousel>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCarouselComponent {
  images = input<string[]>([]);
}
