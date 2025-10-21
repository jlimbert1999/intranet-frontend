import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

type FileGroup = 'hero-section' | 'document' | 'quick-access' | 'communication';
type MediaType = 'image' | 'audio' | 'video' | 'document';
export interface UploadedFile {
  fileName: string;
  originalName: string;
  type: MediaType;
}

export interface UploadedPdfThumbnail {
  fileName: string;
  previewName: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor() {}
  private http = inject(HttpClient);
  private readonly URL = `${environment.baseUrl}/files`;

  getFile(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }

  uploadFile(file: File, group: FileGroup) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadedFile>(`${this.URL}/${group}`, formData);
  }

  uploadPdfThumbnail(file: File, group: FileGroup) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadedPdfThumbnail>(
      `${this.URL}/${group}`,
      formData
    );
  }
}
