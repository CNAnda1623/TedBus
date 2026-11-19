import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  @Output() customBusClicked = new EventEmitter<void>();

  departure: string = '';
  arrival: string = '';
  date: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.departure = params['departure'] || '';
      this.arrival = params['arrival'] || '';
      this.date = params['date'] || '';
    });
  }

  onCustomBusClick(): void {
    this.customBusClicked.emit();
  }

  swapRoutes(): void {
    if (!this.departure || !this.arrival) return;
    const temp = this.departure;
    this.departure = this.arrival;
    this.arrival = temp;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { departure: this.departure, arrival: this.arrival, date: this.date },
      queryParamsHandling: 'merge'
    });
  }

  shiftDate(days: number): void {
    if (!this.date) return;
    const d = new Date(this.date);
    if (isNaN(d.getTime())) return;
    d.setDate(d.getDate() + days);
    const newDateStr = d.toISOString().split('T')[0];
    this.date = newDateStr;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { departure: this.departure, arrival: this.arrival, date: newDateStr },
      queryParamsHandling: 'merge'
    });
  }

  modifySearch(): void {
    this.router.navigate(['/']);
  }
}
