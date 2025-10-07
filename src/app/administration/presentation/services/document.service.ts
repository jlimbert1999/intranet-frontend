import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, map, of, switchMap, tap } from 'rxjs';

import {
  CategoriesWithSectionsResponse,
  DocumentsToManageResponse,
  documentCategoryResponse,
} from '../../infrastructure';
import { environment } from '../../../../environments/environment';
import { FileUploadService } from '../../../shared';

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
}

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly URL = `${environment.baseUrl}/documents`;

  private fileUploadService = inject(FileUploadService);

  private http = inject(HttpClient);

  private cache = new Map<string, DocumentsToManageResponse[]>();

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
    return this.http.get<documentCategoryResponse[]>(`${this.URL}/sections`);
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
        tap((resp) => {
          console.log(resp);
          this.cache.set(key, resp.items);
          this.dataSize.set(resp.total);
        }),
        map(({ items }) => items)
      );
  }

  syncDocuments(
    relationId: number,
    files: File[],
    uploadedDocuments: UploadedDocument[] = []
  ) {
    return this.buildUploadTask(files).pipe(
      switchMap((uploadedFiles) =>
        this.http.put<DocumentsToManageResponse>(
          `${this.URL}/sync/${relationId}`,
          {
            documents: [
              ...uploadedFiles.map(({ originalName, fileName }) => ({
                originalName,
                fileName,
              })),
              ...uploadedDocuments.map(({ originalName, fileName, id }) => ({
                //  * fileName in uploaded documents for manage no is a url
                id,
                fileName,
                originalName,
              })),
            ],
          }
        )
      ),
      tap((res) => {
        this.dataSize.update((value) => (value += 1));
        this.updateDocumentsCache(res);
      })
    );
  }

  private buildUploadTask(files: File[]) {
    return files.length > 0
      ? forkJoin(
          files.map((file) =>
            this.fileUploadService.uploadFile(file, 'document')
          )
        )
      : of([]);
  }

  private updateDocumentsCache(newItem: DocumentsToManageResponse) {
    this.cache.forEach((docs) => {
      return docs.map((item) => {
        if (item.id !== newItem.id) return item;
        item.documents = newItem.documents;
        return item;
      });
    });
  }
}
