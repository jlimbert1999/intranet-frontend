import { HeroSlideResponse, QuickAccessResponse } from "../../../features/administration/infrastructure";

export interface HomePortalDataResponse {
  slides: HeroSlideResponse[];
  quickAccess: QuickAccessResponse[];
  communications: any[];
  documents: any[];
}
