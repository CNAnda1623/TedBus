import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchBar, SearchParams } from '../search-bar/search-bar';

export interface BookingOption {
  id: string;
  title: string;
  desc?: string;
  capacity?: string;
  fareRate?: string;
  icon?: string;
}

export interface BookingGroup {
  id: string;
  title: string;
  helper: string;
  icon: string;
  multiSelect: boolean;
  options: BookingOption[];
  hasStopsPicker?: boolean;
}

export interface CustomBookingConfig {
  product: 'cab' | 'custom-bus';
  title: string;
  subtitle: string;
  groups: BookingGroup[];
  basePerKm: number;
}

@Component({
  selector: 'app-custom-booking-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBar],
  templateUrl: './custom-booking-page.html',
  styleUrls: ['./custom-booking-page.css']
})
export class CustomBookingPage implements OnInit {
  @Input() config!: CustomBookingConfig;

  // Search parameters
  fromCity: string = 'Delhi';
  toCity: string = 'Jaipur';
  travelDate: string = '';
  travelTime: string = '10:00';

  // Selections state (groupId -> selected option id(s))
  singleSelections: { [groupId: string]: string } = {};
  multiSelections: { [groupId: string]: string[] } = {};

  // MultiSelectPicker for Custom Stops
  selectedStops: string[] = [];
  stopSearchTerm: string = '';
  showStopsDropdown: boolean = false;
  availableCities: string[] = [
    'Agra', 'Mathura', 'Gurgaon', 'Neemrana', 'Alwar',
    'Lonavala', 'Khandala', 'Shirdi', 'Nashik', 'Mysore',
    'Hosur', 'Salem', 'Vellore', 'Tirupati'
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const today = new Date();
    this.travelDate = today.toISOString().split('T')[0];

    // Initialize selections with first items if appropriate
    if (this.config && this.config.groups) {
      this.config.groups.forEach(group => {
        if (!group.multiSelect && group.options.length > 0) {
          this.singleSelections[group.id] = group.options[0].id;
        } else {
          this.multiSelections[group.id] = [];
        }
      });
    }
  }

  handleSearch(params: SearchParams): void {
    this.fromCity = params.from;
    this.toCity = params.to;
    this.travelDate = params.date;
    if (params.pickupTime) this.travelTime = params.pickupTime;
  }

  toggleSingleSelect(groupId: string, optionId: string): void {
    this.singleSelections[groupId] = optionId;
  }

  isSingleSelected(groupId: string, optionId: string): boolean {
    return this.singleSelections[groupId] === optionId;
  }

  toggleMultiSelect(groupId: string, optionId: string): void {
    if (!this.multiSelections[groupId]) {
      this.multiSelections[groupId] = [];
    }
    const idx = this.multiSelections[groupId].indexOf(optionId);
    if (idx > -1) {
      this.multiSelections[groupId].splice(idx, 1);
    } else {
      this.multiSelections[groupId].push(optionId);
    }
  }

  isMultiSelected(groupId: string, optionId: string): boolean {
    return this.multiSelections[groupId]?.includes(optionId) || false;
  }

  // Stops Picker
  addStop(city: string): void {
    if (!this.selectedStops.includes(city)) {
      this.selectedStops.push(city);
    }
    this.stopSearchTerm = '';
    this.showStopsDropdown = false;
  }

  removeStop(city: string): void {
    this.selectedStops = this.selectedStops.filter(c => c !== city);
  }

  get filteredCities(): string[] {
    return this.availableCities.filter(c => 
      c.toLowerCase().includes(this.stopSearchTerm.toLowerCase()) && !this.selectedStops.includes(c)
    );
  }

  // Live estimate calculation
  get estimatedDistanceKm(): number {
    return 280; // Standard Delhi-Jaipur corridor distance
  }

  get calculatedEstimate(): number {
    let rate = this.config.basePerKm;
    // Find chosen size modifier
    const sizeGroupId = this.config.product === 'cab' ? 'cab-size' : 'bus-size';
    const chosenSizeId = this.singleSelections[sizeGroupId];
    if (chosenSizeId === 'sedan' || chosenSizeId === 'minibus-20') rate *= 1.2;
    if (chosenSizeId === 'suv' || chosenSizeId === 'standard-35') rate *= 1.5;
    if (chosenSizeId === 'luxury-suv' || chosenSizeId === 'volvo-45') rate *= 1.9;

    let baseFare = this.estimatedDistanceKm * rate;
    // Add small facility fees
    const facilityGroupId = this.config.product === 'cab' ? 'facilities' : 'amenities';
    const facilities = this.multiSelections[facilityGroupId] || [];
    baseFare += facilities.length * 150;

    return Math.round(baseFare);
  }

  get isProceedReady(): boolean {
    // Check if required single-selects are picked
    for (const group of this.config.groups) {
      if (!group.multiSelect && !this.singleSelections[group.id]) {
        return false;
      }
    }
    return true;
  }

  get selectedSummaryString(): string {
    const parts: string[] = [];
    for (const group of this.config.groups) {
      if (!group.multiSelect) {
        const opt = group.options.find(o => o.id === this.singleSelections[group.id]);
        if (opt) parts.push(opt.title);
      }
    }
    return parts.join(' · ');
  }

  proceedToCheckout(): void {
    const bookingDetails = {
      product: this.config.product,
      from: this.fromCity,
      to: this.toCity,
      date: this.travelDate,
      time: this.travelTime,
      singleSelections: this.singleSelections,
      multiSelections: this.multiSelections,
      stops: this.selectedStops,
      totalFare: this.calculatedEstimate
    };

    sessionStorage.setItem('current_custom_booking', JSON.stringify(bookingDetails));
    this.router.navigate(['/payment']);
  }
}
