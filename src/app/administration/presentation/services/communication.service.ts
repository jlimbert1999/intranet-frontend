import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
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
      .uploadPdfThumbnail(file, 'communication')
      .pipe(
        switchMap(({ fileName, previewName }) =>
          this.http.post(`${this.URL}`, { ...form, fileName, previewName })
        )
      );
  }
}
