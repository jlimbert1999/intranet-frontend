import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contacto } from '../../domain/models/contact.model'; // Asegúrate de la ruta

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/contacts'; 
  private http = inject(HttpClient); 

  getContacts(): Observable<any> {
    return this.http.get<Contacto[]>(`${this.apiUrl}/list`);
  }

  create(contactData: Partial<Contacto>): Observable<Contacto> {
    return this.http.post<Contacto>(this.apiUrl, contactData);
  }

  update(id: string, contactData: Partial<Contacto>): Observable<Contacto> {
    return this.http.put<Contacto>(`${this.apiUrl}/id/${id}`, contactData);
  }

  remove(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/id/${id}`);
  }
}