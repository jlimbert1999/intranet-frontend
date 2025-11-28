import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

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
        redirectUri: 'http://localhost:3100/auth/callback',
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
}
