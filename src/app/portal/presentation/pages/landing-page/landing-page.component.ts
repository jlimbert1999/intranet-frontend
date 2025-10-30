import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnimateOnScroll } from 'primeng/animateonscroll';

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
    AnimateOnScroll,
    HeroSectionComponent,
    PortalLoaderComponent,
    FooterSectionComponent,
    QuickAccessSectionComponent,
    CommunicationsSectionComponent,
    ScrollRestoreDirective,
  ],
  templateUrl: './landing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @keyframes slidedown-icon {
          0% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(20px);
          }

          100% {
            transform: translateY(0);
          }
        }

        .slidedown-icon {
          animation: slidedown-icon;
          animation-duration: 3s;
          animation-iteration-count: infinite;
        }

        .box {
          background-image: radial-gradient(
            var(--primary-300),
            var(--primary-600)
          );
          border-radius: 50% !important;
          color: var(--primary-color-text);
        }
      }
    `,
  ],
})
export default class LandingPageComponent {
  private portalService = inject(PortalService);

  readonly isLoading = this.portalService.isPortalLoading;
  readonly portalData = this.portalService.portalData;
}
