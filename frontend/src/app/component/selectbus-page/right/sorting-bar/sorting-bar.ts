import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sorting-bar',
  standalone: false,
  templateUrl: './sorting-bar.html',
  styleUrl: './sorting-bar.css'
})
export class SortingBar {
  @Input() busCount: number = 0;
  @Input() departure: string = '';
  @Input() arrival: string = '';
  @Input() activeSort: string = 'departure';
  @Output() sortChange = new EventEmitter<string>();

  sortOptions = [
    { key: 'departure', label: 'Earliest', icon: 'schedule' },
    { key: 'rating', label: 'Top Rated', icon: 'star' },
    { key: 'cheapest', label: 'Cheapest', icon: 'savings' }
  ];

  selectSort(key: string): void {
    this.activeSort = key;
    this.sortChange.emit(key);
  }
}
