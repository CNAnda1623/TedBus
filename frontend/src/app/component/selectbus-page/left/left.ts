import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BusStateService } from '../../../service/bus-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-left',
  standalone: true,
  templateUrl: './left.html',
  styleUrls: ['./left.css'],
  imports: [CommonModule, FormsModule, MatIconModule],
})
export class LeftComponent implements OnInit, OnDestroy {
  timeSlots = [
    { key: 'before 6 am', label: 'Before 6 AM', icon: 'wb_twilight' },
    { key: '6 am to 12 pm', label: '6 AM - 12 PM', icon: 'wb_sunny' },
    { key: '12pm to 6 pm', label: '12 PM - 6 PM', icon: 'wb_sunny' },
    { key: 'after 6 pm', label: 'After 6 PM', icon: 'nights_stay' }
  ];

  busTypes = [
    { key: 'Seater', label: 'Seater' },
    { key: 'Sleeper', label: 'Sleeper' },
    { key: 'Ac', label: 'AC' },
    { key: 'Nonac', label: 'Non-AC' }
  ];

  amenities = [
    { key: 'wifi', label: 'Free WiFi', icon: 'fa-solid fa-wifi' },
    { key: 'waterBottle', label: 'Water Bottle', icon: 'fa-solid fa-bottle-water' },
    { key: 'blankets', label: 'Clean Blankets', icon: 'fa-solid fa-bed' },
    { key: 'chargingPoint', label: 'Charging Point', icon: 'fa-solid fa-plug' },
    { key: 'movie', label: 'TV / Screen', icon: 'fa-solid fa-tv' }
  ];

  sliderPrice: number = 2000;
  private debounceTimer: any;
  private subs: Subscription[] = [];

  constructor(public busState: BusStateService) {}

  ngOnInit(): void {
    this.subs.push(
      this.busState.rawBuses$.subscribe(() => {
        this.sliderPrice = this.busState.filters.maxPrice;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }

  toggleLiveTracking(): void {
    this.busState.setToggle('livetracking', !this.busState.filters.livetracking);
  }

  toggleReschedulable(): void {
    this.busState.setToggle('reschedulable', !this.busState.filters.reschedulable);
  }

  onDepartureTimeChange(key: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.busState.setGroupFilter('departuretime', key, checked);
  }

  onArrivalTimeChange(key: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.busState.setGroupFilter('arrivaltime', key, checked);
  }

  onBusTypeChange(key: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.busState.setGroupFilter('bustype', key, checked);
  }

  onAmenityChange(key: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.busState.setGroupFilter('amenities', key, checked);
  }

  onPriceChange(val: number): void {
    this.sliderPrice = val;
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.busState.setMaxPrice(this.sliderPrice);
    }, 200);
  }

  clearAll(): void {
    this.busState.clearAllFilters();
    this.sliderPrice = this.busState.maxAvailablePrice;
  }

  get activeCount(): number {
    return this.busState.activeFilterChips.length;
  }
}
