interface DocumentsToManageProps {
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
  originalName: string;
  fileName: string;
  fiscalYear: Date;
}

export class DocumentsToManage {
  id: number;
  section: CategoryItem;
  category: SectionItem;
  documents: DocumentItem[];

  constructor({ id, section, category, documents }: DocumentsToManageProps) {
    this.id = id;
    this.section = section;
    this.category = category;
    this.documents = documents;
  }
}
