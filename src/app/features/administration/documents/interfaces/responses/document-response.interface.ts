export interface DocumentsToManageResponse {
  id: number;
  section: CategoryItem;
  category: SectionItem;
  documents: DocumentItem[];
}

interface CategoryItem {
  id: number;
  name: string;
}

interface SectionItem {
  id: number;
  name: string;
}

interface DocumentItem {
  id: string;
  fileName: string;
  originalName: string;
  fiscalYear: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentSectionResponse {
  id: number;
  name: string;
  isActive: boolean;
}
