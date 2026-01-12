import { HttpClient, HttpParams } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { inject, Injectable } from '@angular/core';

import { tap } from 'rxjs';

import { environment } from '../../../../environments/environment';

interface roles {
  id: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserDataSource {
  private http = inject(HttpClient);
  private readonly URL = `${environment.baseUrl}/users`;

  roles = toSignal(this.http.get<roles[]>(`${this.URL}/roles`), {
    initialValue: [],
  });

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http
      .get<{ users: any[]; total: number }>(this.URL, {
        params,
      })
      .pipe(
        tap((resp) => {
          console.log(resp);
        })
      );
  }
}
