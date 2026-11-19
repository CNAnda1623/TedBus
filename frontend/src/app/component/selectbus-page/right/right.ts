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
export class Right implements OnInit {
  matchedbus: BusModel[] = [];
  routes: RoutesModel[] = [];
  seats: { [key: string]: any } = {};

  departurevar: string = '';
  arrival: string = '';
  date: string = '';
  activeSort: string = 'departure';

  constructor(private route: ActivatedRoute, private busservice: Bus) {}

  getkeys(): string[] {
    return Object.keys(this.seats);
  }

  getFilledSeats(busId?: string): any[] {
    return (busId && this.seats[busId]) || [];
  }

  handleSortChange(sortKey: any): void {
    this.activeSort = typeof sortKey === 'string' ? sortKey : (sortKey?.target?.value || 'departure');
    if (this.activeSort === 'departure') {
      this.matchedbus.sort((a, b) => (a.departureTime || '').localeCompare(b.departureTime || ''));
    } else if (this.activeSort === 'rating') {
      this.matchedbus.sort((a, b) => {
        const ratingA = Array.isArray(a.rating) ? a.rating.reduce((s, r) => s + r, 0) / (a.rating.length || 1) : (Number(a.rating) || 0);
        const ratingB = Array.isArray(b.rating) ? b.rating.reduce((s, r) => s + r, 0) / (b.rating.length || 1) : (Number(b.rating) || 0);
        return ratingB - ratingA;
      });
    }
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
            this.handleSortChange(this.activeSort);
          },
          error: (err) => {
            console.error('Failed to load buses:', err);
          }
        });
      }
    });
  }
}
