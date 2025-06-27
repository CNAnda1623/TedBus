import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusModel } from "../model/bus.model"
import { url } from '../config/index';
import { BookingModel } from '../model/booking.model';

@Injectable({
  providedIn: 'root'
})
export class Bus {
  private busbookapi: string = url + 'booking/'
  private apiurl: string = url + 'routes/'
  constructor(private http: HttpClient) { }
  GETBUSDETAILS(depart: string, arrival: string, date: string): Observable<Bus[]> {
    const formattedDate = date.replaceAll('/', '-');
    const fullUrl = `${this.apiurl}${depart}/${arrival}/${formattedDate}`;
    console.log("📦 Requesting:", fullUrl);
    return this.http.get<Bus[]>(url);
  }
addbusmongo(myBooking:any):Observable<BookingModel>{
  const busbook: BookingModel = {
    customerId:myBooking.customerId,
    passengerDetails:myBooking.passengerDetails,
    email:myBooking.email,
    phoneNumber:myBooking.phoneNumber,
    fare:myBooking.fare,
    status:myBooking.status,
    bookingDate:myBooking.bookingDate,
    busId:myBooking.busId,
    seats: myBooking.seats,
    departureDetails:myBooking.departureDetails,
    arrivalDetails:myBooking.arrivalDetails,
    duration:myBooking.duration,
    isBusinessTravel:myBooking.isBusinessTravel,
    isInsurance: myBooking.isInsurance ,
    isCovidDonated:myBooking.isCovidDonated
  };
  return this.http.post<BookingModel>(this.busbookapi,busbook)
}

  getbusmongo(id:string):Observable<BookingModel[]>{
    const url=`${this.busbookapi}${id}`;
    return this.http.get<BookingModel[]>(url);
  }

}
