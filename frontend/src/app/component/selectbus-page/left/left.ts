import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-left',
  standalone: true,
  templateUrl: './left.html',
  styleUrls: ['./left.css'],
  imports: [CommonModule, MatIconModule],
})
export class LeftComponent {
  amenityIcons: { [key: string]: string } = {
    wifi: 'fa-solid fa-wifi',
    waterBottle: 'fa-solid fa-bottle-water',
    blankets: 'fa-solid fa-blanket',
    chargingPoint: 'fa-solid fa-plug',
    movie: 'fa-solid fa-tv',
  };

  labelMap: { [key: string]: string } = {
    Ac: 'AC Bus',
    Nonac: 'Non-AC Bus',
    Seater: 'Seater',
    Sleeper: 'Sleeper',
    wifi: 'Free WiFi',
    waterBottle: 'Water Bottle',
    blankets: 'Clean Blankets',
    chargingPoint: 'Charging Point',
    movie: 'Entertainment / TV',
    'before 6 am': 'Early Morning (Before 6 AM)',
    '6 am to 12 pm': 'Morning (6 AM - 12 PM)',
    '12pm to 6 pm ': 'Afternoon (12 PM - 6 PM)',
    'after 6 pm': 'Night (After 6 PM)'
  };

  sidefiltervalues: any = {
    livetracking: false,
    reschedulable: false,
    departuretime: {
      "before 6 am": false,
      "6 am to 12 pm": false,
      "12pm to 6 pm ": false,
      "after 6 pm": false,
    },
    bustype: {
      Seater: false,
      Sleeper: false,
      Ac: false,
      Nonac: false,
    },
    arrivaltime: {
      "before 6 am": false,
      "6 am to 12 pm": false,
      "12pm to 6 pm ": false,
      "after 6 pm": false,
    },
    amenities: {
      wifi: false,
      waterBottle: false,
      blankets: false,
      chargingPoint: false,
      movie: false,
    },
  };

  getobjectkey(obj: any): string[] {
    return Object.keys(obj);
  }

  getLabel(key: string): string {
    return this.labelMap[key] || key;
  }

  handlelivetrackingclick(): void {
    this.sidefiltervalues.livetracking = !this.sidefiltervalues.livetracking;
  }

  handlerescheduleclick(): void {
    this.sidefiltervalues.reschedulable = !this.sidefiltervalues.reschedulable;
  }

  handledeparturetimeclick(event: any, name: string): void {
    this.sidefiltervalues.departuretime[name] = event.target.checked;
  }

  handlearivaltimeclick(event: any, name: string): void {
    this.sidefiltervalues.arrivaltime[name] = event.target.checked;
  }

  handlebustypeclick(event: any, name: string): void {
    this.sidefiltervalues.bustype[name] = event.target.checked;
  }

  handleamenityclick(event: any, name: string): void {
    this.sidefiltervalues.amenities[name] = event.target.checked;
  }

  timeIcons: { [key: string]: string } = {
    'before 6 am': 'wb_twilight',
    '6 am to 12 pm': 'wb_sunny',
    '12pm to 6 pm ': 'wb_sunny',
    'after 6 pm': 'nights_stay'
  };

  getActiveFilterCount(): number {
    let count = 0;
    if (this.sidefiltervalues.livetracking) count++;
    if (this.sidefiltervalues.reschedulable) count++;
    for (const k of Object.keys(this.sidefiltervalues.departuretime)) {
      if (this.sidefiltervalues.departuretime[k]) count++;
    }
    for (const k of Object.keys(this.sidefiltervalues.bustype)) {
      if (this.sidefiltervalues.bustype[k]) count++;
    }
    for (const k of Object.keys(this.sidefiltervalues.arrivaltime)) {
      if (this.sidefiltervalues.arrivaltime[k]) count++;
    }
    for (const k of Object.keys(this.sidefiltervalues.amenities)) {
      if (this.sidefiltervalues.amenities[k]) count++;
    }
    return count;
  }

  clearAll(): void {
    this.sidefiltervalues.livetracking = false;
    this.sidefiltervalues.reschedulable = false;
    for (const k of Object.keys(this.sidefiltervalues.departuretime)) this.sidefiltervalues.departuretime[k] = false;
    for (const k of Object.keys(this.sidefiltervalues.bustype)) this.sidefiltervalues.bustype[k] = false;
    for (const k of Object.keys(this.sidefiltervalues.arrivaltime)) this.sidefiltervalues.arrivaltime[k] = false;
    for (const k of Object.keys(this.sidefiltervalues.amenities)) this.sidefiltervalues.amenities[k] = false;
  }
}
