import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, forkJoin, EMPTY, map, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { HeroSlideResponse } from '../../infrastructure';
import { FileUploadService } from '../../../shared';

interface HeroSlideItem {
  id?: number;
  image: string;
  order: number;
  file?: File;
  title?: string;
  description?: string;
  redirectUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HeroSlideService {
  private http = inject(HttpClient);

  private fileUploadService = inject(FileUploadService);

  private readonly URL = `${environment.baseUrl}/hero-slide`;

  findAll() {
    return this.http.get<HeroSlideResponse[]>(this.URL);
  }

  getCurrentSlides() {
    return this.http
      .get<HeroSlideResponse[]>(this.URL)
      .pipe(
        map((resp) =>
          resp.map(({ image, title, description, redirecttUrl }) => ({
            image,
            title,
            description,
            redirecttUrl,
          }))
        )
      );
  }

  syncDocuments(items: HeroSlideItem[]) {
    const existingSlides = items
      .filter(
        (item) => item.id && item.image && !item.image.startsWith('blob:')
      )
      .map(({ image, ...props }) => ({
        image: image?.split('/').pop(), // * extrack fileName from build url,
        ...props,
      }));

    return this.buildUploadTask(items).pipe(
      map((newSlides) => [...existingSlides, ...newSlides]),
      switchMap((allSlides) => {
        return this.http.put<HeroSlideResponse[]>(this.URL, {
          slides: allSlides,
        });
      })
    );
  }

  private buildUploadTask(items: HeroSlideItem[]) {
    const itemsToUpload = items
      .filter((item) => item.file !== undefined)
      .map(({ file, ...props }) => ({
        file: file as File,
        ...props,
      }));

    return itemsToUpload.length > 0
      ? forkJoin(
          itemsToUpload.map((item) =>
            this.fileUploadService.uploadFile(item.file, 'hero-section').pipe(
              map(({ fileName }) => ({
                image: fileName,
                title: item.title,
                order: item.order,
                description: item.description,
                redirectUrl: item.redirectUrl,
              })),
              catchError(() => EMPTY)
            )
          )
        )
      : of([]); //  * emit value;
  }
}
