import { HeroSlideResponse, QuickAccessResponse } from "../../../features/administration/interfaces";

export interface HomePortalDataResponse {
  slides: HeroSlideResponse[];
  quickAccess: QuickAccessResponse[];
  communications: any[];
  documents: any[];
}
