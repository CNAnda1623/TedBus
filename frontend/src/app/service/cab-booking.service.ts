import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../config/index';

@Injectable({ providedIn: 'root' })
export class CabBookingService {
  constructor(private http: HttpClient) {}

  createBooking(data: any) {
    return this.http.post(`${url}api/cab-booking`, data);
  }
}
