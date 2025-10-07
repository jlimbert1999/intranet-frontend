interface DocumentProp {
  id: string;
  fileName: string;
  originalName: string;
  createdAt: Date;
}

export class DocumentFile {
  id: string;
  fileName: string;
  originalName: string;
  createdAt: Date;
  constructor({ id, fileName, originalName, createdAt }: DocumentProp) {
    this.id = id;
    this.fileName = fileName;
    this.originalName = originalName;
    this.createdAt = createdAt;
  }
}
