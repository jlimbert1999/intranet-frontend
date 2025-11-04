import {
  HeroSlideResponse,
  QuickAccessResponse,
} from '../../../administration/infrastructure';

export interface HomePortalDataResponse {
  slides: HeroSlideResponse[];
  quickAccess: QuickAccessResponse[];
  communications: any[];
  documents: any[];
}
