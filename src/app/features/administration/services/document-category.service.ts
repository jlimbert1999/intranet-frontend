import { inject, Injectable, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { DocumentCategoryResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class DocumentCategoryService {
  private http = inject(HttpClient);

  private readonly URL = `${environment.baseUrl}/document-category`;

  resource = toSignal(this.findAll(), { initialValue: [] });
  dataSource = linkedSignal(() => this.resource());

  findAll() {
    return this.http.get<DocumentCategoryResponse[]>(this.URL);
  }

  create(name: string) {
    return this.http.post<DocumentCategoryResponse>(this.URL, { name }).pipe(
      tap((resp) => {
        this.dataSource.update((values) => [resp, ...values]);
      })
    );
  }

  update(id: number, name: string) {
    return this.http
      .patch<DocumentCategoryResponse>(`${this.URL}/${id}`, { name })
      .pipe(
        tap((resp) => {
          const index = this.dataSource().findIndex((item) => item.id === id);
          if (index !== -1) {
            this.dataSource.update((values) => {
              values[index] = resp;
              return [...values];
            });
          }
        })
      );
  }
}
