import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bus-box',
  templateUrl: './bus-box.html',
  styleUrls: ['./bus-box.css'],
  standalone: false,
})
export class BusBox implements OnInit {
  @Input() rating: number[] = [];
  @Input() operatorname: string = '';
  @Input() bustype: string = '';
  @Input() departuretime: string = "";
  @Input() reschedulable: number = 0;
  @Input() livetracking: number = 0;
  @Input() filledseats: any[] = [];
  @Input() routedetails: any;
  @Input() busid: string = '';

  avgrating: number = 4.2;
  totalreview: number = 18;
  seatprivce: number = 450;
  bustypename: string = '';
  busdeparturetime: number = 0;
  busarrivaltime: number = 0;

  activeTab: number = -1; // 0: Amenities, 1: Boarding & Dropping, 2: Reviews, 3: Policies, 4: View Seats

  toggleTab(index: number): void {
    this.activeTab = this.activeTab === index ? -1 : index;
  }

  toggleViewSeats(): void {
    this.activeTab = this.activeTab === 4 ? -1 : 4;
  }

  getSeatsLeft(): number {
    return Math.max(40 - (this.filledseats?.length || 0), 0);
  }

  ngOnInit(): void {
    let sum = 0;
    let count = 0;
    if (this.rating && this.rating.length > 0) {
      this.rating.forEach((item) => {
        sum += item;
        count += 1;
      });
      this.totalreview = Math.max(count * 8, 12);
      this.avgrating = Number((sum / count).toFixed(1));
    } else {
      this.totalreview = 24;
      this.avgrating = 4.3;
    }

    const bType = (this.bustype || '').toLowerCase();
    const duration = Math.floor(this.routedetails?.duration || 5);

    if (bType === 'standard') {
      this.seatprivce = Math.max(65 * duration, 380);
      this.bustypename = 'Standard A/C';
    } else if (bType === 'sleeper') {
      this.seatprivce = Math.max(110 * duration, 650);
      this.bustypename = 'A/C Sleeper (2+1)';
    } else if (bType.includes('seater')) {
      this.seatprivce = Math.max(85 * duration, 450);
      this.bustypename = 'A/C Seater';
    } else {
      this.seatprivce = Math.max(60 * duration, 320);
      this.bustypename = 'Non - A/C Seater';
    }

    const numericvalue = parseInt(this.departuretime, 10) || 21;
    this.busdeparturetime = numericvalue;
    this.busarrivaltime = (numericvalue + duration) % 24;
  }
}
