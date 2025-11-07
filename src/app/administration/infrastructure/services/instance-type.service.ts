import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, switchMap, tap } from 'rxjs';
import { InstanceType } from '../../domain/models/contact.model'; 

@Injectable({
 providedIn: 'root'
})
export class InstanceTypeService {
 private apiUrl = 'http://localhost:3000/instance-types'; 
 private http = inject(HttpClient); 
 
 private reloadTrigger = new BehaviorSubject<boolean>(true);

 getAll(): Observable<InstanceType[]> {
  return this.reloadTrigger.pipe(
   switchMap(() => {
    return this.http.get<InstanceType[]>(this.apiUrl);
   })
  );
 }

 create(name: string): Observable<InstanceType> {
  return this.http.post<InstanceType>(this.apiUrl, { name });
 }
 
 reload() {
  this.reloadTrigger.next(true);
 }
}