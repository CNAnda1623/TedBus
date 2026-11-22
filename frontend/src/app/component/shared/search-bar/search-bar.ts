import { Component, Input, Output, EventEmitter, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DatePicker } from '../date-picker/date-picker';
import { TimePicker } from '../time-picker/time-picker';
import { CustomSelect, SelectOption } from '../custom-select/custom-select';

export type ProductType = 'bus' | 'cab' | 'train' | 'custom-bus';

export interface SearchParams {
  product: ProductType;
  from: string;
  fromCode?: string;
  to: string;
  toCode?: string;
  date: string;
  pickupTime?: string;
  trainClass?: string;
  quota?: string;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePicker, TimePicker, CustomSelect],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBar implements OnInit {
  @Input() product: ProductType = 'bus';
  @Input() compact: boolean = false;
  @Input() showProductTabs: boolean = false;
  @Input() showRecentSearches: boolean = false;
  @Input() showQuickDateChips: boolean = false;
  @Input() resultCount?: number;
  @Input() lowestFare?: number | string;
  @Input() initialParams?: Partial<SearchParams>;

  @Output() search = new EventEmitter<SearchParams>();
  @Output() modify = new EventEmitter<void>();

  isExpanded: boolean = false;
  isSwapRotated: boolean = false;

  from: string = 'Delhi';
  to: string = 'Jaipur';
  date: string = '';
  minDate: string = '';
  pickupTime: string = '10:00 AM';
  trainClass: string = '3A - 3 Tier AC';
  quota: string = 'General';

  popularCities: string[] = [
    'Delhi', 'Jaipur', 'Mumbai', 'Pune', 'Bangalore', 'Chennai',
    'Hyderabad', 'Ahmedabad', 'Goa', 'Shimla', 'Manali', 'Agra', 'Chandigarh'
  ];

  trainClasses: SelectOption[] = [
    { code: 'All Classes', label: 'All Classes', desc: 'Show all coaches' },
    { code: '1A - First AC', label: '1A', desc: 'First AC (Coupe & Cabin)' },
    { code: '2A - 2 Tier AC', label: '2A', desc: '2 Tier AC Sleeper' },
    { code: '3A - 3 Tier AC', label: '3A', desc: '3 Tier AC Sleeper' },
    { code: 'SL - Sleeper', label: 'SL', desc: 'Sleeper Class (Non-AC)' },
    { code: 'CC - Chair Car', label: 'CC', desc: 'AC Executive Chair Car' },
    { code: '2S - Second Seating', label: '2S', desc: 'Second Seating' }
  ];

  trainQuotas: SelectOption[] = [
    { code: 'General', label: 'General', desc: 'Standard reservation quota' },
    { code: 'Tatkal', label: 'Tatkal', desc: 'Opens 1 day prior' },
    { code: 'Ladies', label: 'Ladies', desc: 'Reserved for female solo/groups' },
    { code: 'Senior Citizen', label: 'Senior Citizen', desc: 'Lower berth quota' }
  ];

  recentSearches: { from: string; to: string; date: string; product: ProductType }[] = [];

  showFromDropdown: boolean = false;
  showToDropdown: boolean = false;

  constructor(public router: Router, private elRef: ElementRef) {}

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.date = this.minDate;

    if (this.initialParams) {
      if (this.initialParams.from) this.from = this.initialParams.from;
      if (this.initialParams.to) this.to = this.initialParams.to;
      if (this.initialParams.date) this.date = this.initialParams.date;
      if (this.initialParams.pickupTime) this.pickupTime = this.initialParams.pickupTime;
      if (this.initialParams.trainClass) this.trainClass = this.initialParams.trainClass;
      if (this.initialParams.quota) this.quota = this.initialParams.quota;
    }

    this.loadRecentSearches();
  }

  get formattedNavigatorDate(): string {
    if (!this.date) return 'Select Date';
    try {
      const d = new Date(this.date + 'T00:00:00');
      return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return this.date;
    }
  }

  get displayLowestFare(): string {
    if (this.lowestFare !== undefined && this.lowestFare !== null && this.lowestFare !== '') {
      return `from ₹${this.lowestFare}`;
    }
    return '';
  }

  prevDay(): void {
    const current = new Date(this.date + 'T00:00:00');
    current.setDate(current.getDate() - 1);
    const newDateStr = current.toISOString().split('T')[0];
    if (newDateStr >= this.minDate) {
      this.date = newDateStr;
      this.onSearch();
    }
  }

  nextDay(): void {
    const current = new Date(this.date + 'T00:00:00');
    current.setDate(current.getDate() + 1);
    this.date = current.toISOString().split('T')[0];
    this.onSearch();
  }

  onDateChanged(newDate: string): void {
    this.date = newDate;
    if (this.compact && !this.isExpanded) {
      this.onSearch();
    }
  }

  swapFromTo(): void {
    this.isSwapRotated = !this.isSwapRotated;
    const temp = this.from;
    this.from = this.to;
    this.to = temp;
  }

  selectFrom(city: string): void {
    this.from = city;
    this.showFromDropdown = false;
  }

  selectTo(city: string): void {
    this.to = city;
    this.showToDropdown = false;
  }

  toggleModify(): void {
    this.isExpanded = !this.isExpanded;
    this.modify.emit();
  }

  cancelModify(): void {
    this.isExpanded = false;
  }

  switchProduct(type: ProductType): void {
    this.product = type;
  }

  setQuickDateChip(offsetDays: number): void {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    this.date = d.toISOString().split('T')[0];
  }

  onSearch(): void {
    this.saveRecentSearch();
    const params: SearchParams = {
      product: this.product,
      from: this.from,
      to: this.to,
      date: this.date,
      pickupTime: this.pickupTime,
      trainClass: this.trainClass,
      quota: this.quota
    };

    this.search.emit(params);
    this.isExpanded = false;

    // Navigate to target route if called from landing page
    if (this.router.url === '/' || this.router.url.startsWith('/landing-page')) {
      if (this.product === 'bus') {
        this.router.navigate(['/selectbus-page'], {
          queryParams: { departure: this.from, arrival: this.to, date: this.date }
        });
      } else if (this.product === 'train') {
        this.router.navigate(['/trains'], {
          queryParams: { from: this.from, to: this.to, date: this.date, class: this.trainClass, quota: this.quota }
        });
      } else if (this.product === 'cab') {
        this.router.navigate(['/cab-book']);
      } else if (this.product === 'custom-bus') {
        this.router.navigate(['/custom-bus']);
      }
    }
  }

  private loadRecentSearches(): void {
    try {
      const data = localStorage.getItem('tedbus_recent_searches');
      if (data) {
        this.recentSearches = JSON.parse(data).slice(0, 4);
      }
    } catch {}
  }

  private saveRecentSearch(): void {
    try {
      const entry = { from: this.from, to: this.to, date: this.date, product: this.product };
      const filtered = this.recentSearches.filter(s => !(s.from === this.from && s.to === this.to && s.product === this.product));
      filtered.unshift(entry);
      this.recentSearches = filtered.slice(0, 4);
      localStorage.setItem('tedbus_recent_searches', JSON.stringify(this.recentSearches));
    } catch {}
  }

  applyRecent(search: { from: string; to: string; date: string; product: ProductType }): void {
    this.from = search.from;
    this.to = search.to;
    this.date = search.date >= this.minDate ? search.date : this.minDate;
    this.product = search.product;
    this.onSearch();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.showFromDropdown = false;
      this.showToDropdown = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.showFromDropdown = false;
    this.showToDropdown = false;
    if (this.isExpanded) {
      this.cancelModify();
    }
  }
}
