import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, EMPTY, forkJoin, map, of, switchMap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { TutorialResponse } from '../../infrastructure';

interface TutorialProps {
  title: string;
  description: string;
  videos: VideoItem[];
  image?: File;
}

interface VideoItem {
  title: string;
  fileUrl: string;
  file?: File;
}

@Injectable({
  providedIn: 'root',
})
export class TutorialData {
  private http = inject(HttpClient);
  private readonly URL = `${environment.baseUrl}/assistance`;

  constructor() {}

  findAll() {
    return this.http.get<{ tutorials: TutorialResponse[]; total: number }>(
      `${this.URL}`
    );
  }

  create(tutorial: TutorialProps) {
    const { videos, image, ...props } = tutorial;
    return this.buildUploadTask(videos).pipe(
      switchMap((uploadedVideos) => {
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

  private buildUploadTask(items: VideoItem[], image?: File) {
    return forkJoin([
      image ? this.uploadTutorialFile(image, 'image') : of(null),
      ...items.map(({ file, title, fileUrl }) => {
        if (!file) {
          return of({
            title,
            fileName: fileUrl.split('/').pop(),
          });
        }
        return items.map((item) =>
          this.uploadTutorialFile(file, 'video').pipe(
            map(({ fileName }) => ({ title: item.title, fileName }))
          )
        );
      }),
    ]);
  }

  private uploadTutorialFile(file: File, type: 'image' | 'video') {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<{ fileName: string }>(
        `${environment.baseUrl}/files/tutorial-${type}`,
        formData
      )
      .pipe(catchError(() => EMPTY));
  }
}
