export interface DocumentsToManageResponse {
  id: number;
  section: CategoryItem;
  category: SectionItem;
  documents: DocumentItem[];
}

interface CategoryItem {
  id: number;
  name: string;
  description: null;
}

interface SectionItem {
  id: number;
  name: string;
  description: null;
}

interface DocumentItem {
  id: string;
  fileName: string;
  originalName: string;
  createdAt: Date;
  updatedAt: Date;
}
