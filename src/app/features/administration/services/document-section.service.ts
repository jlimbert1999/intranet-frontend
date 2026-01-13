import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { DocSectionWithCategoriesResponse } from '../interfaces';

interface PaginationParams {
  limit: number;
  offset: number;
  term?: string;
}

interface PageProps {
  limit?: number;
  index: number;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentSectionService {
  private http = inject(HttpClient);

  private readonly URL = `${environment.baseUrl}/document-sections`;

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
      return this.findAll({ limit, offset, term });
    },
    defaultValue: [],
  });

  constructor() {}

  setPage({ limit = 10, index: offset }: PageProps) {
    this.limit.set(limit);
    this.index.set(offset);
  }

  findAll({ limit, offset, term }: PaginationParams) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http
      .get<{
        sections: DocSectionWithCategoriesResponse[];
        total: number;
      }>(this.URL, {
        params,
      })
      .pipe(
        tap((resp) => {
          this.dataSize.set(resp.total);
        }),
        map((resp) => resp.sections)
      );
  }

  getCategories() {
    return this.http.get<any[]>(`${this.URL}/categories`);
  }

  create(name: string, categoriesIds: number) {
    return this.http.post(this.URL, { name, categoriesIds });
  }

  update(id: number, name: string, categoriesIds: number) {
    return this.http.patch(`${this.URL}/${id}`, { name, categoriesIds });
  }
}
