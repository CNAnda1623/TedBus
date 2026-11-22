import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Bus } from './bus.service';
import { BusModel } from '../model/bus.model';
import { RoutesModel } from '../model/routes.model';

export interface FilterChip {
  id: string;
  group: 'toggle' | 'departure' | 'arrival' | 'bustype' | 'amenity' | 'price';
  key: string;
  label: string;
}

export interface EnrichedBus extends BusModel {
  computedFare: number;
  computedSeatsLeft: number;
  computedRating: string;
  computedDurationText: string;
  isNextDay: boolean;
  hasReDeal: boolean;
  busTypeNameFormatted: string;
  departureHour: number;
  arrivalHour: number;
  departureFormatted: string;
  arrivalFormatted: string;
}

@Injectable({
  providedIn: 'root'
})
export class BusStateService {
  departure: string = 'Delhi';
  arrival: string = 'Jaipur';
  date: string = '';

  isLoading$ = new BehaviorSubject<boolean>(false);
  rawBuses$ = new BehaviorSubject<EnrichedBus[]>([]);
  filteredBuses$ = new BehaviorSubject<EnrichedBus[]>([]);
  routeDetails$ = new BehaviorSubject<RoutesModel | null>(null);
  seatsMap$ = new BehaviorSubject<{ [busId: string]: any }>({});

  activeSort: 'departure' | 'rating' | 'fare' = 'departure';

  // Filters State
  filters = {
    livetracking: false,
    reschedulable: false,
    departuretime: {
      'before 6 am': false,
      '6 am to 12 pm': false,
      '12pm to 6 pm': false,
      'after 6 pm': false
    } as { [k: string]: boolean },
    arrivaltime: {
      'before 6 am': false,
      '6 am to 12 pm': false,
      '12pm to 6 pm': false,
      'after 6 pm': false
    } as { [k: string]: boolean },
    bustype: {
      Seater: false,
      Sleeper: false,
      Ac: false,
      Nonac: false
    } as { [k: string]: boolean },
    amenities: {
      wifi: false,
      waterBottle: false,
      blankets: false,
      chargingPoint: false,
      movie: false
    } as { [k: string]: boolean },
    maxPrice: 2000
  };

  minAvailablePrice = 300;
  maxAvailablePrice = 2000;

  constructor(private busService: Bus, private router: Router, private route: ActivatedRoute) {
    const today = new Date();
    this.date = today.toISOString().split('T')[0];
  }

  fetchBuses(departure: string, arrival: string, date: string, updateUrl: boolean = true): void {
    this.departure = departure || 'Delhi';
    this.arrival = arrival || 'Jaipur';
    this.date = date || new Date().toISOString().split('T')[0];

    if (updateUrl) {
      this.syncToUrl();
    }

    this.isLoading$.next(true);

    this.busService.GETBUSDETAILS(this.departure, this.arrival, this.date).subscribe({
      next: (res: any) => {
        const raw = res.matchedBuses || [];
        const route = res.route || null;
        const seats = res.busidwithseatobj || {};

        this.routeDetails$.next(route);
        this.seatsMap$.next(seats);

        const enriched = this.enrichBuses(raw, route, seats);
        this.rawBuses$.next(enriched);
        this.updatePriceBounds(enriched);
        this.applyFiltersAndSort();
        this.isLoading$.next(false);
      },
      error: (err) => {
        console.error('Error fetching buses:', err);
        this.rawBuses$.next([]);
        this.filteredBuses$.next([]);
        this.isLoading$.next(false);
      }
    });
  }

  private enrichBuses(buses: BusModel[], route: RoutesModel | null, seatsMap: any): EnrichedBus[] {
    const duration = route?.duration || 5;

    return buses.map((bus, idx) => {
      const bType = (bus.busType || '').toLowerCase();
      let fare = 450;
      let busTypeName = 'Standard A/C';

      if (bType === 'standard') {
        fare = Math.max(Math.round(65 * duration), 380);
        busTypeName = 'Standard A/C';
      } else if (bType === 'sleeper' || bType.includes('sleeper')) {
        fare = Math.max(Math.round(110 * duration), 650);
        busTypeName = 'A/C Sleeper (2+1)';
      } else if (bType.includes('seater')) {
        fare = Math.max(Math.round(85 * duration), 450);
        busTypeName = 'A/C Seater (2+2)';
      } else {
        fare = Math.max(Math.round(60 * duration), 320);
        busTypeName = 'Non - A/C Seater';
      }

      // Ratings calculation
      let sum = 0;
      let count = 0;
      if (Array.isArray(bus.rating) && bus.rating.length > 0) {
        bus.rating.forEach(r => { sum += r; count++; });
      }
      const ratingVal = count > 0 ? (sum / count) : 4.0;
      const formattedRating = ratingVal.toFixed(1);

      // Departure and arrival calculations
      let depHour = 8;
      let depMin = 0;
      if (bus.departureTime) {
        const parts = bus.departureTime.split(':');
        depHour = parseInt(parts[0], 10) || 8;
        depMin = parts[1] ? parseInt(parts[1], 10) : 0;
      }
      const depTotalMin = depHour * 60 + depMin;
      const durTotalMin = Math.round(duration * 60);
      const arrTotalMin = depTotalMin + durTotalMin;

      const arrHour = Math.floor(arrTotalMin / 60) % 24;
      const arrMin = arrTotalMin % 60;
      const isNextDay = arrTotalMin >= 24 * 60;

      const durHours = Math.floor(duration);
      const durMins = Math.round((duration - durHours) * 60);
      const durText = `${durHours}h ${durMins ? durMins + 'm' : '00m'}${isNextDay ? ' (+1 day)' : ''}`;

      const depStr = `${depHour.toString().padStart(2, '0')}:${depMin.toString().padStart(2, '0')}`;
      const arrStr = `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`;

      // Seat left variance
      const busIdStr = bus._id || `${idx}`;
      const seed = bus.operatorName.length + busIdStr.charCodeAt(busIdStr.length - 1);
      const bookedCount = (bus._id && seatsMap[bus._id]) ? seatsMap[bus._id].length : (seed % 15);
      const seatsLeft = Math.max(36 - bookedCount, 4);

      // reDeal only applied when deal condition met
      const hasReDeal = (idx % 3 === 0) && (fare >= 450);

      return {
        ...bus,
        computedFare: fare,
        computedSeatsLeft: seatsLeft,
        computedRating: formattedRating,
        computedDurationText: durText,
        isNextDay,
        hasReDeal,
        busTypeNameFormatted: busTypeName,
        departureHour: depHour,
        arrivalHour: arrHour,
        departureFormatted: depStr,
        arrivalFormatted: arrStr
      };
    });
  }

  private updatePriceBounds(buses: EnrichedBus[]): void {
    if (buses.length === 0) return;
    const fares = buses.map(b => b.computedFare);
    this.minAvailablePrice = Math.min(...fares);
    this.maxAvailablePrice = Math.max(...fares);
    if (!this.filters.maxPrice || this.filters.maxPrice < this.minAvailablePrice) {
      this.filters.maxPrice = this.maxAvailablePrice;
    }
  }

  setSort(sortKey: 'departure' | 'rating' | 'fare' | 'cheapest', updateUrl: boolean = true): void {
    const key = sortKey === 'cheapest' ? 'fare' : sortKey;
    this.activeSort = key;
    this.applyFiltersAndSort();
    if (updateUrl) this.syncToUrl();
  }

  setToggle(key: 'livetracking' | 'reschedulable', value: boolean): void {
    this.filters[key] = value;
    this.applyFiltersAndSort();
    this.syncToUrl();
  }

  setGroupFilter(group: 'departuretime' | 'arrivaltime' | 'bustype' | 'amenities', key: string, value: boolean): void {
    this.filters[group][key] = value;
    this.applyFiltersAndSort();
    this.syncToUrl();
  }

  setMaxPrice(val: number): void {
    this.filters.maxPrice = val;
    this.applyFiltersAndSort();
    this.syncToUrl();
  }

  clearAllFilters(): void {
    this.filters.livetracking = false;
    this.filters.reschedulable = false;
    Object.keys(this.filters.departuretime).forEach(k => this.filters.departuretime[k] = false);
    Object.keys(this.filters.arrivaltime).forEach(k => this.filters.arrivaltime[k] = false);
    Object.keys(this.filters.bustype).forEach(k => this.filters.bustype[k] = false);
    Object.keys(this.filters.amenities).forEach(k => this.filters.amenities[k] = false);
    this.filters.maxPrice = this.maxAvailablePrice;
    this.applyFiltersAndSort();
    this.syncToUrl();
  }

  removeFilter(chip: FilterChip): void {
    if (chip.group === 'toggle') {
      if (chip.key === 'livetracking') this.filters.livetracking = false;
      if (chip.key === 'reschedulable') this.filters.reschedulable = false;
    } else if (chip.group === 'departure') {
      this.filters.departuretime[chip.key] = false;
    } else if (chip.group === 'arrival') {
      this.filters.arrivaltime[chip.key] = false;
    } else if (chip.group === 'bustype') {
      this.filters.bustype[chip.key] = false;
    } else if (chip.group === 'amenity') {
      this.filters.amenities[chip.key] = false;
    } else if (chip.group === 'price') {
      this.filters.maxPrice = this.maxAvailablePrice;
    }
    this.applyFiltersAndSort();
    this.syncToUrl();
  }

  get activeFilterChips(): FilterChip[] {
    const chips: FilterChip[] = [];
    if (this.filters.livetracking) chips.push({ id: 'live', group: 'toggle', key: 'livetracking', label: 'Live Tracking' });
    if (this.filters.reschedulable) chips.push({ id: 'resched', group: 'toggle', key: 'reschedulable', label: 'Reschedulable' });

    Object.keys(this.filters.departuretime).forEach(k => {
      if (this.filters.departuretime[k]) {
        chips.push({ id: `dep-${k}`, group: 'departure', key: k, label: `Dep: ${this.formatTimeSlotLabel(k)}` });
      }
    });

    Object.keys(this.filters.arrivaltime).forEach(k => {
      if (this.filters.arrivaltime[k]) {
        chips.push({ id: `arr-${k}`, group: 'arrival', key: k, label: `Arr: ${this.formatTimeSlotLabel(k)}` });
      }
    });

    Object.keys(this.filters.bustype).forEach(k => {
      if (this.filters.bustype[k]) {
        chips.push({ id: `type-${k}`, group: 'bustype', key: k, label: k });
      }
    });

    Object.keys(this.filters.amenities).forEach(k => {
      if (this.filters.amenities[k]) {
        chips.push({ id: `amenity-${k}`, group: 'amenity', key: k, label: this.formatAmenityLabel(k) });
      }
    });

    if (this.filters.maxPrice < this.maxAvailablePrice) {
      chips.push({ id: 'price', group: 'price', key: 'maxPrice', label: `Under ₹${this.filters.maxPrice}` });
    }

    return chips;
  }

  private applyFiltersAndSort(): void {
    let result = [...this.rawBuses$.getValue()];

    // 1. Toggles (AND)
    if (this.filters.livetracking) {
      result = result.filter(b => b.liveTracking === 1);
    }
    if (this.filters.reschedulable) {
      result = result.filter(b => b.reschedulable === 1);
    }

    // 2. Departure Time (OR within group)
    const activeDepKeys = Object.keys(this.filters.departuretime).filter(k => this.filters.departuretime[k]);
    if (activeDepKeys.length > 0) {
      result = result.filter(b => activeDepKeys.some(slotKey => this.matchesTimeSlot(b.departureHour, slotKey)));
    }

    // 3. Arrival Time (OR within group)
    const activeArrKeys = Object.keys(this.filters.arrivaltime).filter(k => this.filters.arrivaltime[k]);
    if (activeArrKeys.length > 0) {
      result = result.filter(b => activeArrKeys.some(slotKey => this.matchesTimeSlot(b.arrivalHour, slotKey)));
    }

    // 4. Bus Type (OR within group)
    const activeTypeKeys = Object.keys(this.filters.bustype).filter(k => this.filters.bustype[k]);
    if (activeTypeKeys.length > 0) {
      result = result.filter(b => {
        const typeStr = (b.busType || '').toLowerCase();
        return activeTypeKeys.some(k => {
          const lk = k.toLowerCase();
          if (lk === 'seater') return typeStr.includes('seater');
          if (lk === 'sleeper') return typeStr.includes('sleeper');
          if (lk === 'ac') return typeStr.includes('ac') && !typeStr.includes('non');
          if (lk === 'nonac') return typeStr.includes('non');
          return false;
        });
      });
    }

    // 5. Price filter
    if (this.filters.maxPrice && this.filters.maxPrice < this.maxAvailablePrice) {
      result = result.filter(b => b.computedFare <= this.filters.maxPrice);
    }

    // Sort
    if (this.activeSort === 'departure') {
      result.sort((a, b) => a.departureHour - b.departureHour);
    } else if (this.activeSort === 'rating') {
      result.sort((a, b) => Number(b.computedRating) - Number(a.computedRating));
    } else if (this.activeSort === 'fare') {
      result.sort((a, b) => a.computedFare - b.computedFare);
    }

    this.filteredBuses$.next(result);
  }

  matchesTimeSlot(hour: number, slot: string): boolean {
    const s = slot.toLowerCase().trim();
    if (s.includes('before 6')) return hour < 6;
    if (s.includes('6 am to 12')) return hour >= 6 && hour < 12;
    if (s.includes('12pm to 6') || s.includes('12 pm to 6')) return hour >= 12 && hour < 18;
    if (s.includes('after 6')) return hour >= 18;
    return true;
  }

  formatTimeSlotLabel(slot: string): string {
    const s = slot.toLowerCase().trim();
    if (s.includes('before 6')) return 'Before 6 AM';
    if (s.includes('6 am to 12')) return '6 AM - 12 PM';
    if (s.includes('12pm to 6') || s.includes('12 pm to 6')) return '12 PM - 6 PM';
    if (s.includes('after 6')) return 'After 6 PM';
    return slot;
  }

  formatAmenityLabel(key: string): string {
    const map: any = {
      wifi: 'Free WiFi',
      waterBottle: 'Water Bottle',
      blankets: 'Clean Blankets',
      chargingPoint: 'Charging Point',
      movie: 'TV'
    };
    return map[key] || key;
  }

  // Count helper for Left sidebar options
  getLiveCount(group: string, key?: string): number {
    const raw = this.rawBuses$.getValue();
    if (group === 'livetracking') {
      return raw.filter(b => b.liveTracking === 1).length;
    }
    if (group === 'reschedulable') {
      return raw.filter(b => b.reschedulable === 1).length;
    }
    if (group === 'departuretime' && key) {
      return raw.filter(b => this.matchesTimeSlot(b.departureHour, key)).length;
    }
    if (group === 'arrivaltime' && key) {
      return raw.filter(b => this.matchesTimeSlot(b.arrivalHour, key)).length;
    }
    if (group === 'bustype' && key) {
      const lk = key.toLowerCase();
      return raw.filter(b => {
        const typeStr = (b.busType || '').toLowerCase();
        if (lk === 'seater') return typeStr.includes('seater');
        if (lk === 'sleeper') return typeStr.includes('sleeper');
        if (lk === 'ac') return typeStr.includes('ac') && !typeStr.includes('non');
        if (lk === 'nonac') return typeStr.includes('non');
        return false;
      }).length;
    }
    return 0;
  }

  get lowestFare(): number | undefined {
    const current = this.filteredBuses$.getValue();
    if (current.length === 0) return undefined;
    return Math.min(...current.map(b => b.computedFare));
  }

  syncToUrl(): void {
    const qp: Params = {
      departure: this.departure,
      arrival: this.arrival,
      date: this.date,
      sort: this.activeSort
    };
    if (this.filters.livetracking) qp['liveTracking'] = '1';
    if (this.filters.reschedulable) qp['reschedulable'] = '1';
    if (this.filters.maxPrice < this.maxAvailablePrice) qp['maxPrice'] = this.filters.maxPrice;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: qp,
      queryParamsHandling: 'merge'
    });
  }

  syncFromUrl(params: Params): void {
    if (params['departure']) this.departure = params['departure'];
    if (params['arrival']) this.arrival = params['arrival'];
    if (params['date']) this.date = params['date'];
    if (params['sort']) this.activeSort = params['sort'];
    if (params['liveTracking'] === '1') this.filters.livetracking = true;
    if (params['reschedulable'] === '1') this.filters.reschedulable = true;
    if (params['maxPrice']) this.filters.maxPrice = Number(params['maxPrice']);
  }
}
