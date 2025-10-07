import { inject, Injectable, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentCategoryService {
  private http = inject(HttpClient);

  private readonly URL = `${environment.baseUrl}/document-category`;

  resource = toSignal(this.findAll(), { initialValue: [] });
  dataSource = linkedSignal(() => this.resource());

  constructor() {}

  create(name: string) {
    return this.http.post(this.URL, { name });
  }

  update(id: number, name: string) {
    return this.http.patch(`${this.URL}/${id}`, { name });
  }

  findAll() {
    return this.http.get<any[]>(this.URL);
  }
}
