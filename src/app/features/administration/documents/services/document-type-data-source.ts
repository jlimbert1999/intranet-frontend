import { inject, Injectable, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { DocumentTypeResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeDataSource {
  private http = inject(HttpClient);

  private readonly URL = `${environment.baseUrl}/document-type`;

  resource = toSignal(this.http.get<DocumentTypeResponse[]>(this.URL), {
    initialValue: [],
  });
  dataSource = linkedSignal(() => this.resource());

  create(form: object) {
    return this.http.post<DocumentTypeResponse>(this.URL, form).pipe(
      tap((resp) => {
        this.addItem(resp);
      })
    );
  }

  update(id: number, form: object) {
    return this.http
      .patch<DocumentTypeResponse>(`${this.URL}/${id}`, form)
      .pipe(
        tap((resp) => {
          this.addItem(resp);
        })
      );
  }

  private addItem(newItem: DocumentTypeResponse) {
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
