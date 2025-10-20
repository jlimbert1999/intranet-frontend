import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { FileUploadService } from '../../../shared';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private http = inject(HttpClient);
  private readonly URL = `${environment.baseUrl}/communications`;
  private fileUploadService = inject(FileUploadService);

  types = toSignal(this.getTypes(), { initialValue: [] });

  constructor() {}

  getTypes() {
    return this.http.get<any[]>(`${this.URL}/types`);
  }

  crate(form: object, file: File) {
    return this.fileUploadService
      .uploadFile(file, 'communication')
      .pipe(
        switchMap(({ fileName }) =>
          this.http.post(`${this.URL}`, { ...form, file: fileName })
        )
      );
  }
}
