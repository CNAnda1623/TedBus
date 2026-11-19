import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bus } from '../../../service/bus.service';
import { BusModel } from '../../../model/bus.model';
import { RoutesModel } from '../../../model/routes.model';

@Component({
  selector: 'app-right',
  standalone: false,
  templateUrl: './right.html',
  styleUrl: './right.css'
})
export class Right implements OnInit{
  matchedbus:BusModel[]=[]
  routes:RoutesModel[]=[]
  seats:{[key:string]:any}={}


  departurevar:string=''
  arrival:string=''
  date:string=''

  constructor(private route:ActivatedRoute,private busservice:Bus){}

  getkeys(){
    return Object.keys(this.seats);
  }

  getFilledSeats(busId?: string): any[] {
    return (busId && this.seats[busId]) || [];
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.departurevar = params['departure'] || '';
      this.arrival = params['arrival'] || '';
      this.date = params['date'] || '';

      if (this.departurevar && this.arrival && this.date) {
        this.busservice.GETBUSDETAILS(this.departurevar, this.arrival, this.date).subscribe({
          next: (response: any) => {
            this.matchedbus = response.matchedBuses || [];
            this.routes = response.route || null;
            this.seats = response.busidwithseatobj || {};
          },
          error: (err) => {
            console.error('Failed to load buses:', err);
          }
        });
      }
    });
  }

}


