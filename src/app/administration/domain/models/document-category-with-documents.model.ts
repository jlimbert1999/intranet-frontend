interface DocumentCategoryWithDocumentsModel {
  id: number;
  name: string;
  description: string | null;
  documents: DocumentItem[];
}

interface DocumentItem {
  id: string;
  originalName: string;
  fileName: string;
}

export class DocumentCategoryWithDocuments {
  id: number;
  name: string;
  description: string | null;
  documents: DocumentItem[];

  constructor({ id, name, description, documents }: DocumentCategoryWithDocumentsModel) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.documents = documents;
  }
}
