import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, forkJoin, map, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { FileUploadService } from '../../../shared';


@Injectable({
  providedIn: 'root',
})
export class HeroSlideDataSource {
  private http = inject(HttpClient);

  // private fileUploadService = inject(FileUploadService);

  // private readonly URL = `${environment.baseUrl}/hero-slide`;

  // findAll() {
  //   return this.http.get<HeroSlideResponse[]>(this.URL);
  // }

  // getCurrentSlides() {
  //   return this.http.get<HeroSlideResponse[]>(this.URL).pipe(
  //     map((resp) =>
  //       resp.map(({ imageUrl: image, title, description, redirecttUrl }) => ({
  //         image,
  //         title,
  //         description,
  //         redirecttUrl,
  //       }))
  //     )
  //   );
  // }

  // replaceSlides(items: HeroSlidesToUpload[]) {
  //   const uploadTasks = items.map((item) => {
  //     const { imageUrl, ...props } = item;
  //     if (!item.file) {
  //       return of({
  //         title: props.title,
  //         description: props.description,
  //         redirectUrl: props.redirectUrl,
  //         image: imageUrl.split('/').pop(),
  //       });
  //     }
  //     return this.fileUploadService.uploadFile(item.file, 'hero-section').pipe(
  //       map((uploaded) => ({
  //         title: props.title,
  //         description: props.description,
  //         redirectUrl: props.redirectUrl,
  //         image: uploaded.fileName,
  //       }))
  //     );
  //   });
  //   return forkJoin(uploadTasks).pipe(
  //     switchMap((slides) => this.http.put(this.URL, { slides }))
  //   );
  // }
}
