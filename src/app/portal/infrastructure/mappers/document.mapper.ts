import { DocumentFile } from '../../domain/models/document.model';
import { documentResponse } from '../interfaces/document-response.interface';

export class DocumentMapper {
  static fromResponse(response: documentResponse): DocumentFile {
    return new DocumentFile({
      id: response.id,
      fileName: response.fileName,
      originalName: response.originalName,
      createdAt: new Date(response.createdAt),
    });
  }
}
