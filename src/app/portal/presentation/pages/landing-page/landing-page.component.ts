import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  HeroSectionComponent,
  PortalLoaderComponent,
  FooterSectionComponent,
  QuickAccessSectionComponent,
} from '../../components';
import { PortalService } from '../../services/portal.service';

@Component({
  selector: 'landing-page',
  imports: [
    PortalLoaderComponent,
    HeroSectionComponent,
    QuickAccessSectionComponent,
    FooterSectionComponent,
  ],
  templateUrl: './landing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingPageComponent {
  private portalService = inject(PortalService);

  readonly isLoading = this.portalService.isPortalLoading;
  readonly portalData = this.portalService.portalData;
}
