import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../config/index';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CabBookingService {
  constructor(private http: HttpClient) {}

  createBooking(data: any) : Observable<any> {
    console.log('Payload:', data);
    return this.http.post(`${url}api/cab-booking`, data);
  }
}
