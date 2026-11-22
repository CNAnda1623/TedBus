import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EnrichedBus } from '../../../../service/bus-state.service';

@Component({
  selector: 'app-bus-box',
  templateUrl: './bus-box.html',
  styleUrls: ['./bus-box.css'],
  standalone: false,
})
export class BusBox implements OnInit, OnChanges {
  @Input() bus?: EnrichedBus;
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
  formattedRating: string = '4.2';
  totalreview: number = 18;
  seatprivce: number = 450;
  bustypename: string = '';
  busdeparturetime: string = '08:00';
  busarrivaltime: string = '13:00';
  durationText: string = '5h 00m';
  isNextDay: boolean = false;
  hasReDeal: boolean = false;
  seatsLeft: number = 24;

  activeTab: number = -1; // 0: Amenities, 1: Boarding & Dropping, 2: Reviews, 3: Policies, 4: View Seats

  toggleTab(index: number): void {
    this.activeTab = this.activeTab === index ? -1 : index;
  }

  toggleViewSeats(): void {
    this.activeTab = this.activeTab === 4 ? -1 : 4;
  }

  getSeatsLeft(): number {
    return this.seatsLeft;
  }

  get boardingPoint2Time(): string {
    const parts = (this.busdeparturetime || '08:00').split(':');
    const h = (parseInt(parts[0], 10) + 1) % 24;
    return `${h < 10 ? '0' + h : h}:${parts[1] || '00'}`;
  }

  get droppingPoint2Time(): string {
    const parts = (this.busarrivaltime || '13:00').split(':');
    const h = (parseInt(parts[0], 10) + 1) % 24;
    return `${h < 10 ? '0' + h : h}:${parts[1] || '00'}`;
  }

  ngOnInit(): void {
    this.initBusData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initBusData();
  }

  private initBusData(): void {
    if (this.bus) {
      this.operatorname = this.bus.operatorName || this.operatorname;
      this.bustypename = this.bus.busTypeNameFormatted || this.bustypename;
      this.formattedRating = this.bus.computedRating || '4.0';
      this.avgrating = parseFloat(this.formattedRating) || 4.0;
      this.seatprivce = this.bus.computedFare || 450;
      this.seatsLeft = this.bus.computedSeatsLeft !== undefined ? this.bus.computedSeatsLeft : 24;
      this.hasReDeal = !!this.bus.hasReDeal;
      this.durationText = this.bus.computedDurationText || '5h 00m';
      this.isNextDay = !!this.bus.isNextDay;
      this.busdeparturetime = this.bus.departureFormatted || (this.bus.departureTime || '08:00');
      this.busarrivaltime = this.bus.arrivalFormatted || '13:00';
      this.livetracking = this.bus.liveTracking !== undefined ? this.bus.liveTracking : this.livetracking;
      this.reschedulable = this.bus.reschedulable !== undefined ? this.bus.reschedulable : this.reschedulable;
      this.busid = this.bus._id || this.busid;
      this.totalreview = Math.max((this.operatorname.length || 6) * 3 + 12, 14);
      return;
    }

    let sum = 0;
    let count = 0;
    if (this.rating && this.rating.length > 0) {
      this.rating.forEach((item) => {
        sum += item;
        count += 1;
      });
      this.totalreview = Math.max(count * 8, 12);
      this.avgrating = Number((sum / count).toFixed(1));
      this.formattedRating = this.avgrating.toFixed(1);
    } else {
      this.totalreview = 24;
      this.avgrating = 4.3;
      this.formattedRating = '4.3';
    }

    const bType = (this.bustype || '').toLowerCase();
    const duration = Math.floor(this.routedetails?.duration || 5);

    if (bType === 'standard') {
      this.seatprivce = Math.max(65 * duration, 380);
      this.bustypename = 'Standard A/C';
    } else if (bType === 'sleeper' || bType.includes('sleeper')) {
      this.seatprivce = Math.max(110 * duration, 650);
      this.bustypename = 'A/C Sleeper (2+1)';
    } else if (bType.includes('seater')) {
      this.seatprivce = Math.max(85 * duration, 450);
      this.bustypename = 'A/C Seater';
    } else {
      this.seatprivce = Math.max(60 * duration, 320);
      this.bustypename = 'Non - A/C Seater';
    }

    const numericvalue = parseInt(this.departuretime, 10) || 8;
    this.busdeparturetime = `${numericvalue < 10 ? '0' + numericvalue : numericvalue}:00`;
    const arrVal = (numericvalue + duration) % 24;
    this.busarrivaltime = `${arrVal < 10 ? '0' + arrVal : arrVal}:00`;
    this.isNextDay = (numericvalue + duration) >= 24;
    this.durationText = `${duration}h 00m${this.isNextDay ? ' (+1 day)' : ''}`;
    this.seatsLeft = Math.max(36 - (this.filledseats?.length || 0), 4);
  }
}
