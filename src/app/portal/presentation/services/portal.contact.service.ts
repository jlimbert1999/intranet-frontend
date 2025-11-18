import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactDirectoryResponse } from '../../infrastructure/interfaces/contact-directory.interface';
import { environment } from '../../../../environments/environment';

interface ContactParams {
  offset: number;
  limit: number;
  term?: string;
  institucionId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PortalContactService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/contacts/portal-list`;

  findAll(params: ContactParams): Observable<ContactDirectoryResponse> {
    const pageIndex = Math.floor(params.offset / params.limit) + 1;

    let httpParams = new HttpParams()
      .set('page', pageIndex.toString())
      .set('limit', params.limit.toString());

    if (params.term && params.term.trim() !== '') {
      httpParams = httpParams.set('search', params.term.trim());
    }

    if (params.institucionId && params.institucionId.trim() !== '') {
      httpParams = httpParams.set('instanceType', params.institucionId.trim());
    }

    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    return this.http.get<ContactDirectoryResponse>(this.apiUrl, {
      params: httpParams,
      headers,
    });
  }
}
