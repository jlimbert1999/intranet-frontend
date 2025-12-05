import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthData {
  URL = 'http://localhost:3000/auth';
  private http = inject(HttpClient);

  constructor() {}

  login(login: string, password: string, remember: boolean = false) {
    console.log('login');
    if (remember) {
      localStorage.setItem('login', login);
    } else {
      localStorage.removeItem('login');
    }
    const params = new HttpParams({
      fromObject: {
        clientId: 'intranet',
        redirectUri: 'http://localhost:3000/auth/callback',
        state: 'test',
      },
    });
    return this.http
      .post(
        `${this.URL}/authorize`,
        {
          login,
          password,
        },
        { params }
      )
      .pipe(
        tap((resp) => {
          console.log(resp);
        })
      );
  }

  direcLogin(form: object) {
    return this.http
      .post(`${this.URL}/login`, form, { withCredentials: true })
      .pipe(
        tap((resp) => {
          console.log(resp);
        })
      );
  }

  checkAuthStatus() {
    return this.http
      .get('http://localhost:3000/auth/test/me', { withCredentials: true })
      .pipe(
        map(() => true),
        catchError((err) => {
          // Redirigir al IdentityHub
          console.log('Not autenteciated', err);
          return of(false);
        })
      );
  }
}
