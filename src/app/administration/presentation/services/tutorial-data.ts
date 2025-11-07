import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, EMPTY, forkJoin, map, of, switchMap } from 'rxjs';

import { environment } from '../../../../environments/environment';

interface VideoItem {
  title: string;
  fileName: string;
  thumbnailName: string;
  description?: string;
  file?: File;
}

interface TutorialProps {
  title: string;
  description: string;
  videos: VideoItem[];
}

@Injectable({
  providedIn: 'root',
})
export class TutorialData {
  private http = inject(HttpClient);
  private readonly URL = `${environment.baseUrl}/assistance`;

  constructor() {}

  findAll() {
    return this.http.get<{ tutorials: any[]; total: number }>(`${this.URL}`);
  }

  create(tutorial: TutorialProps) {
    const { videos, ...props } = tutorial;
    return this.buildUploadTask(videos).pipe(
      switchMap((uploadedVideos) => {
        console.log({ ...props, videos: uploadedVideos });
        return this.http.post(`${this.URL}`, {
          ...props,
          videos: uploadedVideos,
        });
      })
    );
  }

  update(id: string, tutorial: TutorialProps) {
    const { videos, ...props } = tutorial;
    return this.buildUploadTask(videos).pipe(
      switchMap((uploadedVideos) =>
        this.http.patch(`${this.URL}/${id}`, {
          ...props,
          videos: uploadedVideos,
        })
      )
    );
  }

  private buildUploadTask(items: VideoItem[]) {
    return forkJoin([
      ...items.map((item) => {
        if (!item.file) return of(item);
        const formData = new FormData();
        formData.append('file', item.file);
        return this.http
          .post<{ fileName: string; previewName: string }>(
            `${environment.baseUrl}/files/tutorial`,
            formData
          )
          .pipe(
            map(({ fileName, previewName }) => ({
              ...item,
              fileName,
              previewName,
            })),
            catchError(() => EMPTY)
          );
      }),
    ]);
  }
}
