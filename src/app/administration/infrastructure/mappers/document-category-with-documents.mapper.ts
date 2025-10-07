import { DocumentCategoryWithDocuments } from '../../domain';
import { DocumentCategoryWithDocumentsResponse } from '../interfaces/document-category-response.interface';

export class DocumentCategoryWithDocumentsMapper {
  static fromResponse(
    response: DocumentCategoryWithDocumentsResponse
  ): DocumentCategoryWithDocuments {
    return new DocumentCategoryWithDocuments({
      id: response.id,
      name: response.name,
      description: response.description,
      documents: response.documents,
    });
  }
}
