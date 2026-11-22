import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusStateService, EnrichedBus, FilterChip } from '../../../service/bus-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-right',
  standalone: false,
  templateUrl: './right.html',
  styleUrl: './right.css'
})
export class Right implements OnInit, OnDestroy {
  buses: EnrichedBus[] = [];
  isLoading: boolean = false;
  departurevar: string = '';
  arrival: string = '';
  date: string = '';
  activeSort: string = 'departure';
  activeFilterChips: FilterChip[] = [];

  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    public busState: BusStateService
  ) {}

  getFilledSeats(busId?: string): any[] {
    const seatsMap = this.busState.seatsMap$.getValue();
    return (busId && seatsMap[busId]) || [];
  }

  handleSortChange(sortKey: string): void {
    this.busState.setSort(sortKey as any);
  }

  removeFilter(chip: FilterChip): void {
    this.busState.removeFilter(chip);
  }

  clearAllFilters(): void {
    this.busState.clearAllFilters();
  }

  selectQuickDate(offsetDays: number): void {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const dateStr = d.toISOString().split('T')[0];
    this.busState.fetchBuses(this.busState.departure, this.busState.arrival, dateStr);
  }

  ngOnInit(): void {
    this.subs.push(
      this.route.queryParams.subscribe(params => {
        const dep = params['departure'];
        const arr = params['arrival'];
        const date = params['date'];

        if (dep && arr && date) {
          if (
            dep !== this.busState.departure ||
            arr !== this.busState.arrival ||
            date !== this.busState.date ||
            this.busState.rawBuses$.getValue().length === 0
          ) {
            this.busState.fetchBuses(dep, arr, date, false);
          }
        } else if (this.busState.rawBuses$.getValue().length === 0) {
          this.busState.fetchBuses('Delhi', 'Jaipur', new Date().toISOString().split('T')[0], false);
        }
      }),

      this.busState.filteredBuses$.subscribe(buses => {
        this.buses = buses;
        this.activeFilterChips = this.busState.activeFilterChips;
      }),

      this.busState.isLoading$.subscribe(loading => {
        this.isLoading = loading;
      }),

      this.busState.rawBuses$.subscribe(() => {
        this.departurevar = this.busState.departure;
        this.arrival = this.busState.arrival;
        this.date = this.busState.date;
        this.activeSort = this.busState.activeSort;
        this.activeFilterChips = this.busState.activeFilterChips;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
