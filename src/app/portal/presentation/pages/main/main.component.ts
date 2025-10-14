import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { AppCarouselComponent } from '../../components';
import { HeroSlideService } from '../../../../administration/presentation/services';



@Component({
  selector: 'app-main',
  imports: [AppCarouselComponent, RouterModule],
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainComponent {
  private heroSlideService = inject(HeroSlideService);

  slides = toSignal(this.heroSlideService.getCurrentSlides(), {
    initialValue: [],
  });
}
