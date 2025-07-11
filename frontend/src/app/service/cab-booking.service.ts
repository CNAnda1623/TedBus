import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../config/index';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CabBookingService {
  private apiUrl = url + 'api/cab-booking';

  constructor(private http: HttpClient) {}

  createBooking(payload: any): Observable<any> {
    console.log('Payload:', payload);
    return this.http.post(this.apiUrl, payload);
  }
}
