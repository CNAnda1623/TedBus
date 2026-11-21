import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBar implements OnInit {
  @Input() product: ProductType = 'bus';
  @Input() compact: boolean = false;
  @Input() showProductTabs: boolean = false;
  @Input() showRecentSearches: boolean = false;
  @Input() resultCount?: number;
  @Input() initialParams?: Partial<SearchParams>;

  @Output() search = new EventEmitter<SearchParams>();
  @Output() modify = new EventEmitter<void>();

  isExpanded: boolean = false;

  from: string = 'Delhi';
  to: string = 'Jaipur';
  date: string = '';
  minDate: string = '';
  pickupTime: string = '10:00';
  trainClass: string = 'All Classes';
  quota: string = 'General';

  // Autocomplete city / station suggestions
  popularCities: string[] = [
    'Delhi', 'Jaipur', 'Mumbai', 'Pune', 'Bangalore', 'Chennai',
    'Hyderabad', 'Ahmedabad', 'Goa', 'Shimla', 'Manali', 'Agra', 'Chandigarh'
  ];

  trainStations: { name: string; code: string }[] = [
    { name: 'New Delhi', code: 'NDLS' },
    { name: 'Jaipur Junction', code: 'JP' },
    { name: 'Mumbai Central', code: 'MMCT' },
    { name: 'KSR Bengaluru', code: 'SBC' },
    { name: 'Chennai Central', code: 'MAS' },
    { name: 'Secunderabad', code: 'SC' },
    { name: 'Ahmedabad Junction', code: 'ADI' },
    { name: 'Hazrat Nizamuddin', code: 'NZM' },
    { name: 'Pune Junction', code: 'PUNE' }
  ];

  trainClasses = ['All Classes', '1A - First AC', '2A - 2 Tier AC', '3A - 3 Tier AC', 'SL - Sleeper', 'CC - Chair Car'];
  trainQuotas = ['General', 'Tatkal', 'Ladies', 'Senior Citizen'];

  recentSearches: { from: string; to: string; date: string; product: ProductType }[] = [];

  showFromDropdown: boolean = false;
  showToDropdown: boolean = false;

  constructor(public router: Router) {}

  ngOnInit(): void {
    // Current date in YYYY-MM-DD
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

  setToday(): void {
    this.date = this.minDate;
  }

  setTomorrow(): void {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    this.date = d.toISOString().split('T')[0];
  }

  prevDay(): void {
    const current = new Date(this.date);
    current.setDate(current.getDate() - 1);
    const newDateStr = current.toISOString().split('T')[0];
    if (newDateStr >= this.minDate) {
      this.date = newDateStr;
      this.onSearch();
    }
  }

  nextDay(): void {
    const current = new Date(this.date);
    current.setDate(current.getDate() + 1);
    this.date = current.toISOString().split('T')[0];
    this.onSearch();
  }

  swapFromTo(): void {
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

  switchProduct(newProduct: ProductType): void {
    this.product = newProduct;
    if (newProduct === 'custom-bus') {
      this.router.navigate(['/custom-bus']);
    } else if (newProduct === 'bus') {
      this.router.navigate(['/landing-page']);
    } else if (newProduct === 'cab') {
      this.router.navigate(['/cab-book']);
    } else if (newProduct === 'train') {
      this.router.navigate(['/trains']);
    }
  }

  toggleModify(): void {
    this.isExpanded = !this.isExpanded;
    this.modify.emit();
  }

  onSearch(): void {
    const params: SearchParams = {
      product: this.product,
      from: this.from,
      to: this.to,
      date: this.date,
      pickupTime: this.pickupTime,
      trainClass: this.trainClass,
      quota: this.quota
    };

    this.saveRecentSearch();
    this.search.emit(params);

    if (!this.compact) {
      if (this.product === 'bus') {
        this.router.navigate(['/selectbus-page'], {
          queryParams: { from: this.from, to: this.to, date: this.date }
        });
      } else if (this.product === 'cab') {
        this.router.navigate(['/cab-book'], {
          queryParams: { from: this.from, to: this.to, date: this.date, time: this.pickupTime }
        });
      } else if (this.product === 'train') {
        this.router.navigate(['/trains'], {
          queryParams: { from: this.from, to: this.to, date: this.date, class: this.trainClass, quota: this.quota }
        });
      } else if (this.product === 'custom-bus') {
        this.router.navigate(['/custom-bus'], {
          queryParams: { from: this.from, to: this.to, date: this.date }
        });
      }
    } else {
      this.isExpanded = false;
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
}
