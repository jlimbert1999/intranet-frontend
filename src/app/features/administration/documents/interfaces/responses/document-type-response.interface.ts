export interface DocumentTypeResponse {
  id: number;
  name: string;
  subtypes: SubtypeResponse[];
}

export interface SubtypeResponse {
  id: number;
  name: string;
}
