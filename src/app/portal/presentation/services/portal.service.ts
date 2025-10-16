import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, map, Observable, of, tap } from 'rxjs';

import {
  CategoriesWithSectionsResponse,
  HomePortalDataResponse,
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

interface DocumentCache {
  documents: DocumentFile[];
  total: number;
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

  private documentsCache: Record<string, DocumentCache> = {};

  private _isPortalLoading = signal<boolean>(true);
  isPortalLoading = computed(() => this._isPortalLoading());
  portalData = toSignal(
    this.http.get<HomePortalDataResponse>(`${this.URL}/home`).pipe(
      finalize(() => {
        this._isPortalLoading.set(false);
      })
    )
  );

  isDocumentSearching = signal<boolean>(false);

  filterDocuments(filterParams?: FilterDocumentsParams) {
    const { limit = 10, offset = 0, ...props } = filterParams ?? {};

    const key = `${offset}-${limit}`;

    const cleanParams = this.cleanFilterProps(props);

    const isFilterMode = Object.values(cleanParams).some((item) => item);

    if (!isFilterMode && this.documentsCache[key]) {
      return of(this.documentsCache[key]);
    }

    this.isDocumentSearching.set(true);

    return this.http
      .post<{ documents: any[]; total: number }>(`${this.URL}/documents`, {
        limit,
        offset,
        ...cleanParams,
      })
      .pipe(
        tap((resp) => {
          if (!isFilterMode) {
            this.documentsCache[key] = resp;
          }
        }),
        finalize(() => {
          this.isDocumentSearching.set(false);
        })
      );
  }

  getQuickAccess() {
    return this.http.get<any[]>(`${this.URL}/quick-access`);
  }

  getCategoriesWithSections() {
    return this.http.get<CategoriesWithSectionsResponse[]>(
      `${this.URL}/categories-sections`
    );
  }

  private cleanFilterProps(form: object) {
    return Object.fromEntries(
      Object.entries(form).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ''
      )
    );
  }
}
