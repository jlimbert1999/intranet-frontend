import {
  HttpClient,
  HttpErrorResponse,
  type HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Subject, switchMap, take, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

let isRefreshing = false;
const refreshSubject = new Subject<void>();

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);

  return next(req).pipe(
    // catchError((error: HttpErrorResponse) => {
    //   console.log(error);
    //   if (error.status !== 401) {
    //     return throwError(() => error);
    //   }

    //   // Evitar loop con el refresh
    //   if (req.url.includes('/auth/refresh')) {
    //     return throwError(() => error);
    //   }

    //   if (isRefreshing) {
    //     return refreshSubject.pipe(
    //       take(1),
    //       switchMap(() => next(req))
    //     );
    //   }

    //   isRefreshing = true;
    //   console.log('front client, start refresh');
    //   return http
    //     .post(
    //       `${environment.baseUrl}/auth/refresh`,
    //       {},
    //       { withCredentials: true }
    //     )
    //     .pipe(
    //       switchMap(() => {
    //         isRefreshing = false;
    //         refreshSubject.next();
    //         return next(req);
    //       }),
    //       catchError((refreshError) => {
    //         isRefreshing = false;
    //         return throwError(() => refreshError);
    //       })
    //     );
    // })
  );
};
