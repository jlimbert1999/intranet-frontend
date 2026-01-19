import { DocumentTypeResponse } from './document-type-response.interface';

export interface DocumentSectionResponse {
  id: number;
  name: string;
  sectionDocumentTypes: SectionDocumentTypeResponse[];
}

export interface SectionDocumentTypeResponse {
  id: number;
  type: DocumentTypeResponse;
}

export interface DocumentTypeInSectionResponse {
  id: number;
  name: string;
}
