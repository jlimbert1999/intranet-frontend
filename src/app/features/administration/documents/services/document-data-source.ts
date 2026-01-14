import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, map, of, switchMap, tap } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { FileUploadService } from '../../../../shared';
import { DocumentsToManageMapper } from '../../infrastructure/mappers/document-category-with-documents.mapper';
import {
  CategoriesWithSectionsResponse,
  DocumentCategoryResponse,
  DocumentsToManageResponse,
} from '../../interfaces';
import { DocumentsToManage } from '../../domain';

interface GetDocumentsToManageProps {
  limit: number;
  offset: number;
  term?: string;
}

interface PageProps {
  limit?: number;
  index: number;
}

interface UploadedDocument {
  id: string;
  fileName: string;
  originalName: string;
  fiscalYear: Date;
}

interface DocumentItem {
  file: File;
  fiscalYear: Date;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentDataSource {
  private readonly URL = `${environment.baseUrl}/documents`;

  private fileUploadService = inject(FileUploadService);

  private http = inject(HttpClient);

  private cache = new Map<string, DocumentsToManage[]>();

  limit = signal<number>(10);

  index = signal<number>(0);

  offset = computed(() => this.index() * this.limit());

  term = signal<string>('');

  dataSize = signal<number>(0);

  dataSource = rxResource({
    params: () => ({
      limit: this.limit(),
      offset: this.offset(),
      term: this.term(),
    }),
    stream: ({ params: { limit, offset, term } }) => {
      return this.getDocumentsToManage({ limit, offset, term });
    },
    defaultValue: [],
  });

  setPage({ limit = 10, index: offset }: PageProps) {
    this.limit.set(limit);
    this.index.set(offset);
  }

  constructor() {}

  getCategoriesWithSections() {
    return this.http.get<CategoriesWithSectionsResponse[]>(
      `${this.URL}/categories-sections`
    );
  }

  getSections() {
    return this.http.get<DocumentCategoryResponse[]>(`${this.URL}/sections`);
  }

  getDocumentsByCategory() {
    // return this.http
    //   .get<DocumentCategoryWithDocuments[]>(this.URL)
    //   .pipe(
    //     map((resp) =>
    //       resp.map((item) =>
    //         DocumentCategoryWithDocumentsMapper.fromResponse(item)
    //       )
    //     )
    //   );
  }

  getDocumentsToManage(filter: GetDocumentsToManageProps) {
    const { term, limit, offset } = filter;

    const key = `${limit}-${offset}`;

    if (this.cache.has(key)) return of(this.cache.get(key)!);

    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http
      .get<{ items: DocumentsToManageResponse[]; total: number }>(this.URL, {
        params,
      })
      .pipe(
        map(({ items, total }) => ({
          items: items.map((item) =>
            DocumentsToManageMapper.fromResponse(item)
          ),
          total,
        })),
        tap((result) => {
          console.log(result);
          this.cache.set(key, result.items);
          this.dataSize.set(result.total);
        }),
        map((result) => result.items)
      );
  }

  syncDocuments(
    relationId: number,
    documents: DocumentItem[],
    uploadedDocuments: UploadedDocument[] = []
  ) {
    return this.buildUploadTask(documents).pipe(
      switchMap((uploadedResult) =>
        this.http.put<DocumentsToManageResponse>(
          `${this.URL}/sync/${relationId}`,
          {
            documents: [
              ...uploadedResult,
              ...uploadedDocuments.map(
                ({ originalName, fileName, id, fiscalYear }) => ({
                  //  * fileName in uploaded documents for manage no is a url
                  id,
                  fileName,
                  originalName,
                  fiscalYear: fiscalYear.getFullYear(),
                })
              ),
            ],
          }
        )
      ),
      map((resp) => DocumentsToManageMapper.fromResponse(resp)),
      tap((res) => {
        this.dataSize.update((value) => (value += 1));
        this.updateDocumentsCache(res);
      })
    );
  }

  private buildUploadTask(documents: DocumentItem[]) {
    const uploadItems = documents.map((doc) =>
      this.fileUploadService.uploadFile(doc.file, 'document').pipe(
        map(({ fileName, originalName, sizeBytes }) => ({
          fileName,
          originalName,
          sizeBytes,
          fiscalYear: doc.fiscalYear.getFullYear(),
        }))
      )
    );
    return documents.length > 0 ? forkJoin(uploadItems) : of([]);
  }

  private updateDocumentsCache(newItem: DocumentsToManage) {
    this.cache.forEach((docs) => {
      return docs.map((item) => {
        if (item.id !== newItem.id) return item;
        item.documents = newItem.documents;
        return item;
      });
    });
  }
}
