import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBar, SearchParams } from '../../shared/search-bar/search-bar';
import { BusStateService } from '../../../service/bus-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SearchBar],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, OnDestroy {
  departure: string = 'Delhi';
  arrival: string = 'Jaipur';
  date: string = '';
  resultCount: number = 0;
  lowestFare: number | string = '';

  private subs: Subscription[] = [];

  constructor(public busState: BusStateService) {}

  ngOnInit(): void {
    this.subs.push(
      this.busState.filteredBuses$.subscribe(buses => {
        this.resultCount = buses.length;
        const lowest = this.busState.lowestFare;
        this.lowestFare = lowest !== undefined ? lowest : '—';
      }),
      this.busState.rawBuses$.subscribe(() => {
        this.departure = this.busState.departure;
        this.arrival = this.busState.arrival;
        this.date = this.busState.date;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  handleSearch(params: SearchParams): void {
    this.departure = params.from;
    this.arrival = params.to;
    this.date = params.date;
    this.busState.fetchBuses(params.from, params.to, params.date);
  }
}
