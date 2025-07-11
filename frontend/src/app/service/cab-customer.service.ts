import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { url } from '../config/index';

@Injectable({ providedIn: 'root' })
export class CabCustomerService {
  private apiUrl = url + 'api/cab-customer'; // backend route

  constructor(private http: HttpClient) {}

  addCabCustomer(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getCustomerById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
