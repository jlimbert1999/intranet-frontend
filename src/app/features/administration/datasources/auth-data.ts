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
    if (remember) {
      localStorage.setItem('login', login);
    } else {
      localStorage.removeItem('login');
    }
    return this.http
      .post(`${this.URL}/login`, { login, password }, { withCredentials: true })
      .pipe(
        tap((resp) => {
          console.log(resp);
        })
      );
  }

  checkAuthStatus() {
    return this.http.get(`${this.URL}/status`, { withCredentials: true }).pipe(
      tap((resp) => console.log(resp)),
      map(() => true),
      catchError((err) => {
        console.log(err);
        return of(false);
      })
    );
  }
}
