import { inject, Injectable, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { DocumentSectionResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class DocumentSectionDataSource {
  private http = inject(HttpClient);

  private readonly URL = `${environment.baseUrl}/document-sections`;

  resource = toSignal(this.http.get<DocumentSectionResponse[]>(this.URL), {
    initialValue: [],
  });
  dataSource = linkedSignal(() => this.resource());

  constructor() {}

  create(form: object) {
    return this.http
      .post<DocumentSectionResponse>(this.URL, form)
      .pipe(tap((resp) => this.addItem(resp)));
  }

  update(id: number, form: object) {
    return this.http
      .patch<DocumentSectionResponse>(`${this.URL}/${id}`, form)
      .pipe(tap((resp) => this.addItem(resp)));
  }

  getDocumentTypes() {
    return this.http.get<any[]>(`${this.URL}/doc-types`);
  }

  private addItem(newItem: DocumentSectionResponse) {
    const index = this.dataSource().findIndex((item) => item.id === newItem.id);
    if (index !== -1) {
      this.dataSource.update((values) => {
        values[index] = newItem;
        return [...values];
      });
    } else {
      this.dataSource.update((values) => [newItem, ...values]);
    }
  }
}
