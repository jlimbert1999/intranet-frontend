import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { PermisssionResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class RoleDataSource {
  private http = inject(HttpClient);
  private URL = `${environment.baseUrl}/roles`;

  permissions = toSignal(
    this.http.get<PermisssionResponse[]>(`${this.URL}/permissions`),
    { initialValue: [] }
  );

  constructor() {}

  create(form: object) {
    return this.http.post(this.URL, form);
  }
}
