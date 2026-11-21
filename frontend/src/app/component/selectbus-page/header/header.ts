import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchBar, SearchParams } from '../../shared/search-bar/search-bar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SearchBar],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  @Input() resultCount: number = 0;
  @Output() searchUpdated = new EventEmitter<SearchParams>();

  departure: string = 'Delhi';
  arrival: string = 'Jaipur';
  date: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['departure']) this.departure = params['departure'];
      if (params['arrival']) this.arrival = params['arrival'];
      if (params['date']) this.date = params['date'];
      if (!this.date) {
        this.date = new Date().toISOString().split('T')[0];
      }
    });
  }

  handleSearch(params: SearchParams): void {
    this.departure = params.from;
    this.arrival = params.to;
    this.date = params.date;
    this.router.navigate(['/selectbus-page'], {
      queryParams: {
        departure: params.from,
        arrival: params.to,
        date: params.date
      }
    });
    this.searchUpdated.emit(params);
  }
}
