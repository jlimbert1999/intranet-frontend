import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, forkJoin, EMPTY, map, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { FileUploadService } from '../../../shared';
import { HeroSlideResponse } from '../interfaces';

interface HeroSlideItem {
  imageUrl: string;
  order: number;
  localImage: {
    preview: string;
    file: File;
  };
  title?: string;
  description?: string;
  redirectUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HeroSlideDataSource {
  private http = inject(HttpClient);

  private fileUploadService = inject(FileUploadService);

  private readonly URL = `${environment.baseUrl}/hero-slide`;

  findAll() {
    return this.http.get<HeroSlideResponse[]>(this.URL);
  }

  getCurrentSlides() {
    return this.http.get<HeroSlideResponse[]>(this.URL).pipe(
      map((resp) =>
        resp.map(({ imageUrl: image, title, description, redirecttUrl }) => ({
          image,
          title,
          description,
          redirecttUrl,
        }))
      )
    );
  }

  replaceSlides(items: HeroSlideItem[]) {
    const existingSlides = items
      .filter((item) => item.imageUrl)
      .map(({ imageUrl, ...props }) => ({
        image: imageUrl?.split('/').pop(), // * extrack fileName from build url,
        ...props,
      }));

    return this.buildUploadTask(items).pipe(
      map((newSlides) => [...existingSlides, ...newSlides]), // TODO replace order
      switchMap((allSlides) => {
        return this.http.put<HeroSlideResponse[]>(this.URL, {
          slides: allSlides,
        });
      })
    );
  }

  //   map((newSlides) => {
  //   const newMap = new Map(newSlides.map(s => [s.order, s]));
  //   return items.map(item => {
  //     if (item.localImage) {
  //       return newMap.get(item.order)!;
  //     }
  //     return {
  //       image: item.imageUrl?.split('/').pop(),
  //       title: item.title,
  //       description: item.description,
  //       redirectUrl: item.redirectUrl,
  //       order: item.order,
  //     };
  //   });
  // })

  private buildUploadTask(items: HeroSlideItem[]) {
    const itemsToUpload = items
      .filter((item) => item.localImage !== undefined)
      .map(({ localImage, ...props }) => ({
        file: localImage.file,
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
