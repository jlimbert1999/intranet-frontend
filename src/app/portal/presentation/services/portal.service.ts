import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of, tap } from 'rxjs';

import {
  CategoryWithTotalDocumentsResponse,
  DocumentMapper,
  documentResponse,
} from '../../infrastructure';
import { environment } from '../../../../environments/environment';
import { DocumentFile } from '../../domain';

interface GetDocumentsByCategoryProps {
  categoryId: number;
  offset: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  private readonly URL = `${environment.baseUrl}/portal`;
  private htttp = inject(HttpClient);

  _categories = signal<CategoryWithTotalDocumentsResponse[]>([]);
  categories = computed(() => this._categories());

  private documentsCache: Record<string, DocumentFile[]> = {};

  list = signal<Record<string, CategoryWithTotalDocumentsResponse>>({});

  constructor() {
    this.getCategories();
  }

  private getCategories() {
    return this.htttp
      .get<CategoryWithTotalDocumentsResponse[]>(`${this.URL}/categories`)
      .subscribe((resp) => {
        this._categories.set(resp);
      });
  }

  getDocumentsByCategory(props: GetDocumentsByCategoryProps) {
    const { categoryId, offset, limit = 10 } = props;

    const key = `${categoryId}-${offset}-${limit}`;

    if (this.documentsCache[key]) return of(this.documentsCache[key]);

    return this.htttp
      .post<documentResponse[]>(
        `${this.URL}/category/${categoryId}/documents`,
        {}
      )
      .pipe(
        map((resp) => resp.map((item) => DocumentMapper.fromResponse(item))),
        tap((documents) => {
          this.documentsCache[key] = documents;
        })
      );
  }
}
