import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of, tap } from 'rxjs';

import {
  CategoriesWithSectionsResponse,
  CategoryWithTotalDocumentsResponse,
} from '../../infrastructure';
import { environment } from '../../../../environments/environment';
import { DocumentFile } from '../../domain';

interface FilterDocumentsParams {
  categoryId?: number;
  sectionId?: number;
  orderDirection?: 'DESC' | 'ASC';
  fiscalYear?: number;
  offset?: number;
  limit?: number;
  term?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  private readonly URL = `${environment.baseUrl}/portal`;
  private http = inject(HttpClient);

  categoriesWithSections = toSignal(this.getCategoriesWithSections(), {
    initialValue: [],
  });
  selectedCategoryId = signal<number | null>(null);
  sections = computed(() => {
    const id = this.selectedCategoryId();
    return id
      ? this.categoriesWithSections()
          .find((item) => item.id === id)
          ?.sectionCategories.map((item) => item.section) ?? []
      : [];
  });

  private documentsCache: Record<string, DocumentFile[]> = {};
  totalDocuments = signal(0);

  filterDocuments(filterParams?: FilterDocumentsParams) {
    const { limit = 10, offset = 0, ...props } = filterParams ?? {};

    const key = `${offset}-${limit}`;

    const isFilterMode = Object.values(props).some((item) => item !== null);

    if (!isFilterMode && this.documentsCache[key]) {
      return of(this.documentsCache[key]);
    }

    const params = new HttpParams({
      fromObject: {
        limit,
        offset,
        ...this.cleanFilterProps(props),
      },
    });
    return this.http
      .post<{ documents: any[]; total: number }>(
        `${this.URL}/documents`,
        params
      )
      .pipe(
        tap(({ documents, total }) => {
          this.documentsCache[key] = documents;
          this.totalDocuments.set(total);
        }),
        map(({ documents }) => documents)
      );
  }

  getCategoriesWithSections() {
    return this.http.get<CategoriesWithSectionsResponse[]>(
      `${this.URL}/categories-sections`
    );
  }

  private cleanFilterProps(form: object) {
    return Object.fromEntries(
      Object.entries(form || {}).filter(([_, v]) => v != null)
    );
  }
}
