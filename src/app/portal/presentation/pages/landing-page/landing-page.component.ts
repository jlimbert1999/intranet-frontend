import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  HeroSectionComponent,
  PortalLoaderComponent,
  FooterSectionComponent,
  QuickAccessSectionComponent,
  CommunicationsSectionComponent,
} from '../../components';
import { PortalService } from '../../services/portal.service';
import { ScrollRestoreDirective } from '../../../../shared';

@Component({
  selector: 'landing-page',
  imports: [
    HeroSectionComponent,
    PortalLoaderComponent,
    FooterSectionComponent,
    QuickAccessSectionComponent,
    CommunicationsSectionComponent,
    ScrollRestoreDirective,
  ],
  templateUrl: './landing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingPageComponent {
  private portalService = inject(PortalService);

  readonly isLoading = this.portalService.isPortalLoading;
  readonly portalData = this.portalService.portalData;
}
