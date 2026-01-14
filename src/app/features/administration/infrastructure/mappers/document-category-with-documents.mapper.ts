import { DocumentsToManage } from '../../domain';
import { DocumentsToManageResponse } from '../../documents/interfaces/responses/document-response.interface';

export class DocumentsToManageMapper {
  static fromResponse(response: DocumentsToManageResponse): DocumentsToManage {
    return new DocumentsToManage({
      id: response.id,
      section: response.section,
      category: response.category,
      documents: response.documents.map((item) => ({
        ...item,
        fiscalYear: new Date(item.fiscalYear, 0, 1),
      })),
    });
  }
}
