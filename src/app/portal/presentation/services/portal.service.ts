import {
  computed,
  inject,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of, tap } from 'rxjs';

import {
  CategoriesWithSectionsResponse,
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

interface filterDocuments {
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

  categories = toSignal(this.getCategories(), { initialValue: [] });

  categoriesWithSections = toSignal(this.getCategoriesWithSections(), {
    initialValue: [],
  });
  selectedCategoryId = signal<number | null>(null);
  sections = computed(() => {
    const id = this.selectedCategoryId();
    return id
      ? this.categoriesWithSections().find((item) => item.id === id)
          ?.sectionCategories.map((item) => item.section) ?? []
      : [];
  });

  private documentsCache: Record<string, DocumentFile[]> = {};

  list = signal<Record<string, CategoryWithTotalDocumentsResponse>>({});

  constructor() {
    this.getCategories();
  }

  private getCategories() {
    return this.htttp.get<CategoryWithTotalDocumentsResponse[]>(
      `${this.URL}/categories`
    );
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

  getCategoriesWithSections() {
    return this.htttp.get<CategoriesWithSectionsResponse[]>(
      `${this.URL}/categories-sections`
    );
  }

  filterDocuments({ categoryId }: filterDocuments) {
    return this.htttp.post<any[]>(`${this.URL}/documents`, { categoryId });
  }
}
