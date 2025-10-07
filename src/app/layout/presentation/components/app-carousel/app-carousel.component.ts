import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-carousel',
  imports: [CarouselModule],
  template: `
    <div class="card">
      <p-carousel [value]="images()" [circular]="true" [autoplayInterval]="3000">
        <ng-template let-image pTemplate="item">
          <div class="w-full h-96 md:h-[400px] lg:h-[500px]">
            <img
              [src]="image"
              class="w-full h-full object-cover"
              alt="carousel image"
            />
          </div>
        </ng-template>
      </p-carousel>
    </div>
  `,
  styles: `

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCarouselComponent {
  images = input<string[]>([]);
}
