import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, forkJoin, EMPTY, map, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { HeroSlideResponse } from '../../infrastructure';
import { FileUploadService } from '../../../shared';

interface HeroSlideItem {
  id?: number;
  image?: string;
  file?: File;
  order: number;
}

interface UploadItem {
  file: File;
  order: number;
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
      .pipe(map((resp) => resp.map(({ image }) => image)));
  }

  syncDocuments(items: HeroSlideItem[]) {
    const itemsToUpload: UploadItem[] = items
      .filter((item) => item.file !== undefined)
      .map(({ file, order }) => ({ file: file as File, order }));

    const existingSlides = items
      .filter((item) => item.id && item.image)
      .map(({ id, image, order }) => ({
        id,
        image: image?.split('/').pop(), // * extrack fileName from build url,
        order,
      }));

    return this.buildUploadTask(itemsToUpload).pipe(
      map((uploaded) =>
        uploaded.map(({ fileName, order }) => ({
          image: fileName,
          order,
        }))
      ),
      map((newSlides) => [...existingSlides, ...newSlides]),
      switchMap((allSlides) => {
        return this.http.put<HeroSlideResponse[]>(this.URL, {
          slides: allSlides,
        });
      })
    );
  }

  private buildUploadTask(items: UploadItem[]) {
    return items.length > 0
      ? forkJoin(
          items.map(({ file, order }) =>
            this.fileUploadService.uploadFile(file, 'hero-section').pipe(
              map(({ fileName }) => ({ fileName, order })),
              catchError(() => EMPTY)
            )
          )
        )
      : of([]); //  * emit value;
  }
}
