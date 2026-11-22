import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-route-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './route-builder.html',
  styleUrls: ['./route-builder.css']
})
export class RouteBuilder implements OnInit {
  @Input() stops: string[] = ['Delhi', 'Jaipur'];
  @Output() stopsChange = new EventEmitter<string[]>();
  @Output() routeStringChange = new EventEmitter<string>();

  seededCities = [
    'Delhi', 'Jaipur', 'Chandigarh', 'Manali', 'Shimla', 'Agra', 'Mumbai',
    'Pune', 'Bangalore', 'Goa', 'Udaipur', 'Rishikesh', 'Haridwar', 'Dehradun',
    'Amritsar', 'Varanasi', 'Lucknow', 'Ahmedabad', 'Hyderabad', 'Chennai'
  ];

  activeDropdownIndex: number = -1;

  ngOnInit(): void {
    if (!this.stops || this.stops.length < 2) {
      this.stops = ['Delhi', 'Jaipur'];
    }
    this.emitChange();
  }

  get routePreview(): string {
    return this.stops.filter(s => s && s.trim().length > 0).join(' → ');
  }

  addViaStop(): void {
    if (this.stops.length >= 8) return;
    // Insert before the last stop (Destination)
    const dest = this.stops.pop() || 'Jaipur';
    this.stops.push('');
    this.stops.push(dest);
    this.activeDropdownIndex = this.stops.length - 2;
    this.emitChange();
  }

  removeStop(index: number): void {
    if (this.stops.length <= 2) return; // Must keep origin and destination
    this.stops.splice(index, 1);
    this.activeDropdownIndex = -1;
    this.emitChange();
  }

  moveUp(index: number): void {
    if (index <= 0) return;
    const temp = this.stops[index];
    this.stops[index] = this.stops[index - 1];
    this.stops[index - 1] = temp;
    this.emitChange();
  }

  moveDown(index: number): void {
    if (index >= this.stops.length - 1) return;
    const temp = this.stops[index];
    this.stops[index] = this.stops[index + 1];
    this.stops[index + 1] = temp;
    this.emitChange();
  }

  selectCity(index: number, city: string): void {
    this.stops[index] = city;
    this.activeDropdownIndex = -1;
    this.emitChange();
  }

  getFilteredCities(input: string): string[] {
    if (!input) return this.seededCities.slice(0, 6);
    const q = input.toLowerCase();
    const matches = this.seededCities.filter(c => c.toLowerCase().includes(q));
    return matches.length > 0 ? matches.slice(0, 6) : [input];
  }

  emitChange(): void {
    this.stopsChange.emit([...this.stops]);
    this.routeStringChange.emit(this.routePreview);
  }
}
