import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../../service/data.service';

export interface PassengerRecord {
  name: string;
  age: string;
  gender: 'Male' | 'Female';
  seatNo: number;
}

@Component({
  selector: 'app-view-seats',
  standalone: false,
  templateUrl: './view-seats.html',
  styleUrls: ['./view-seats.css']
})
export class ViewSeats implements OnInit, OnDestroy {
  @Input() filledseats: number[] = [];
  @Input() seatprice: number = 0;
  @Input() routedetails: any;
  @Input() busid: string = '';
  @Input() busarrivaltime: number = 0;
  @Input() busdeparturetime: number = 0;
  @Input() operatorname: string = '';

  selectedseats: number[] = [];
  currentStep: number = 1; // 1: Seat Selection, 2: Passenger Details
  activeDeck: 'lower' | 'upper' = 'lower';

  // Boarding & Dropping Points
  boardingPoints = [
    { id: 'bp-1', name: 'Kashmiri Gate ISBT, Counter 12', time: '08:00' },
    { id: 'bp-2', name: 'Dhaula Kuan Metro Bus Stop', time: '08:45' }
  ];
  droppingPoints = [
    { id: 'dp-1', name: 'Sindhi Camp Central Bus Stand', time: '13:00' },
    { id: 'dp-2', name: 'Transport Nagar Bypass', time: '13:30' }
  ];
  selectedBoardingPoint = this.boardingPoints[0];
  selectedDroppingPoint = this.droppingPoints[0];
  showPointChanger = false;

  // Passengers info
  passengers: PassengerRecord[] = [];
  email: string = '';
  phone: string = '';
  tripInsurance: boolean = true;

  // Seat hold timer (8 minutes)
  holdMinutes: number = 8;
  holdSeconds: number = 0;
  timerInterval: any;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    const stored = sessionStorage.getItem('Loggedinuser');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.email) this.email = u.email;
        if (u.name) {
          // prefill first passenger name if available
          this.autofillUserName = u.name;
        }
      } catch {}
    }
    this.startHoldTimer();
  }

  autofillUserName: string = '';

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  private startHoldTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.holdSeconds > 0) {
        this.holdSeconds--;
      } else if (this.holdMinutes > 0) {
        this.holdMinutes--;
        this.holdSeconds = 59;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  get timerString(): string {
    const m = this.holdMinutes < 10 ? '0' + this.holdMinutes : this.holdMinutes;
    const s = this.holdSeconds < 10 ? '0' + this.holdSeconds : this.holdSeconds;
    return `${m}:${s}`;
  }

  generatearray(length: number): number[] {
    return Array.from({ length }, (_, index) => index + 1);
  }

  handleselectedseats(seatno: number): void {
    if (this.selectedseats.includes(seatno)) {
      this.selectedseats = this.selectedseats.filter(s => s !== seatno);
    } else {
      this.selectedseats.push(seatno);
    }
    this.syncPassengerList();
  }

  private syncPassengerList(): void {
    this.passengers = this.selectedseats.map(seatNo => {
      const existing = this.passengers.find(p => p.seatNo === seatNo);
      return existing || { name: '', age: '', gender: 'Male', seatNo };
    });
  }

  useGoogleProfile(idx: number): void {
    if (this.autofillUserName && this.passengers[idx]) {
      this.passengers[idx].name = this.autofillUserName;
    }
  }

  // Price calculations
  get baseTotal(): number {
    return this.selectedseats.length * this.seatprice;
  }

  get taxAmount(): number {
    return Math.round(this.baseTotal * 0.05); // 5% GST
  }

  get discountAmount(): number {
    return this.selectedseats.length > 0 ? 50 : 0;
  }

  get insuranceCost(): number {
    return this.tripInsurance ? this.selectedseats.length * 15 : 0;
  }

  get grandTotal(): number {
    return Math.max(0, this.baseTotal + this.taxAmount + this.insuranceCost - this.discountAmount);
  }

  goToPassengerDetails(): void {
    if (this.selectedseats.length === 0) return;
    this.syncPassengerList();
    this.currentStep = 2;
  }

  backToSeatSelection(): void {
    this.currentStep = 1;
  }

  proceedToPayment(): void {
    // Validate passengers
    for (const p of this.passengers) {
      if (!p.name || !p.age) {
        alert('Please fill name and age for all passengers.');
        return;
      }
    }
    if (!this.phone) {
      alert('Please enter your contact mobile number.');
      return;
    }

    const payload = {
      busId: this.busid,
      operatorname: this.operatorname,
      selectedseats: this.selectedseats,
      passengers: this.passengers,
      email: this.email,
      phone: this.phone,
      insurance: this.tripInsurance,
      seatprice: this.seatprice,
      totalAmount: this.grandTotal,
      boardingPoint: this.selectedBoardingPoint,
      droppingPoint: this.selectedDroppingPoint,
      departureTime: this.busdeparturetime,
      arrivalTime: this.busarrivaltime,
      routedetails: this.routedetails
    };

    sessionStorage.setItem('current_bus_booking', JSON.stringify(payload));
    this.dataService.passobj(this.passengers);
    this.dataService.sendobj(this.routedetails);

    this.router.navigate(['/payment']);
  }
}
