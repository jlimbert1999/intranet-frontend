import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { of, tap } from 'rxjs';

interface GetCommunicationsParams {
  limit: number;
  offset: number;
  term?: string;
}
@Injectable({
  providedIn: 'root',
})
export class PortalCommunicationService {
  private readonly URL = `${environment.baseUrl}/portal/communications`;
  private http = inject(HttpClient);

  detailCache: Record<string, any> = {};

  constructor() {}

  getOne(id: string) {
    if (this.detailCache[id]) {
      return of(this.detailCache[id]);
    }
    return this.http.get(`${this.URL}/${id}`).pipe(
      tap((resp) => {
        this.detailCache[id] = resp;
      })
    );
  }

  getAll(queryParams: GetCommunicationsParams) {
    const params = new HttpParams({ fromObject: { ...queryParams } });
    return this.http.get<any[]>(this.URL);
  }
}
