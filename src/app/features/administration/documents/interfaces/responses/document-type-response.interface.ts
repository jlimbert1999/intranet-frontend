export interface DocumentTypeResponse {
  id: number;
  name: string;
  subtypes: SubtypeResponse[];
  isActive: boolean;
}

export interface SubtypeResponse {
  id: number;
  name: string;
  isActive: boolean;
}
