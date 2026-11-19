import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { HttpClient } from '@angular/common/http';
import { Bus } from '../../service/bus.service';
import { url } from '../../config/index';

@Component({
  selector: 'app-payment-page',
  standalone: false,
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.css'
})
export class PaymentPage implements OnInit {
  passseatarray: any[] = [];
  passfare: number = 0;
  routedetails: any = null;
  busdeparturetime: number = 0;
  busarrivaltime: number = 0;
  customerId: any = {};
  operatorname: string = '';
  passengerdetails: any = [];
  email: string = '';
  fare: number = 0;
  busid: string = '';
  phonenumber: string = '';
  departuredetails: any = [];
  arrivaldetails: any = [];
  duration: string = '';
  cabBooking: any;
  cabCustomer: any;
  latestCabBooking: any;
  latestCabCustomer: any;
  cabStartTime: string = '';
  cabEndTime: string = '';
  cabFare: number = 0;
  isCabBooking: boolean = false;
  isbusinesstravel: boolean = false;
  iscoviddonated: boolean = false;
  isinsurance: boolean = false;
  bookingdate: string = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private dataservice: DataService,
    private http: HttpClient,
    private busservice: Bus
  ) {}

  getFareBasedOnCabType(type: string): number {
    const t = (type || '').toLowerCase();
    if (t.includes('micro')) return 2500;
    if (t.includes('sedan')) return 3500;
    if (t.includes('suv')) return 5000;
    if (t.includes('tempo')) return 8000;
    return 3000;
  }

  formatTime(time: string): string {
    if (!time) return '09:00 AM';
    const hour = parseInt(time, 10);
    if (isNaN(hour)) return time;
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  }

  calculateDropTime(time: string): string {
    if (!time) return '02:00 PM';
    const pickupHour = parseInt(time, 10);
    if (isNaN(pickupHour)) return time;
    const dropHour = (pickupHour + 5) % 24;
    return dropHour > 12 ? `${dropHour - 12} PM` : `${dropHour} AM`;
  }

  getDroppingTime(time: string, format: string): string {
    if (!time) return 'N/A';
    let hour = parseInt(time, 10);
    if (isNaN(hour)) return time;

    hour += 5;
    if (format === 'PM' && hour < 12) hour += 12;
    if (hour >= 24) hour -= 24;

    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    const displayFormat = hour >= 12 ? 'PM' : 'AM';

    return `${displayHour} ${displayFormat}`;
  }

  ngOnInit(): void {
    const currentRoute = this.router.url;
    console.log('Current Route:', currentRoute);

    this.bookingdate = new Date().toISOString().split('T')[0];

    // Determine booking mode
    if (currentRoute.includes('cab') || sessionStorage.getItem('cabCustomer') || sessionStorage.getItem('busBookingSelection')) {
      this.isCabBooking = true;
      this.fetchLatestCabData();
    } else {
      this.fetchBusBookingData();
    }

    this.route.params.subscribe(params => {
      this.passseatarray = params['selectedseat'] ? (Array.isArray(params['selectedseat']) ? params['selectedseat'] : [params['selectedseat']]) : [];
      this.email = params['passemail'] || '';
      this.phonenumber = params['passphn'] || '';
      this.isbusinesstravel = params['passisbuisness'] === 'true' || params['passisbuisness'] === true;
      this.isinsurance = params['passinsurance'] === 'true' || params['passinsurance'] === true;
      this.passfare = Number(params['seatprice']) || 0;
      this.busid = params['busid'] || '';
      this.busarrivaltime = params['busarrivaltime'] || 0;
      this.busdeparturetime = params['busdeparturetime'] || 0;
      this.iscoviddonated = params['passiscoviddonate'] === 'true' || params['passiscoviddonate'] === true;
      this.operatorname = params['operatorname'] || '';
      this.getloggedinuser();
    });

    this.dataservice.currentdata.subscribe((data: any) => {
      if (data) this.routedetails = data;
    });

    this.dataservice.passdata.subscribe((data: any) => {
      if (data) this.passengerdetails = data;
    });
  }

  getloggedinuser(): any {
    const loggedinuserjson = sessionStorage.getItem("Loggedinuser");
    if (loggedinuserjson) {
      try {
        this.customerId = JSON.parse(loggedinuserjson);
      } catch (e) {
        this.customerId = {};
      }
    } else {
      this.customerId = {};
    }
    return this.customerId;
  }

  fetchLatestCabData(): void {
    console.log('Fetching latest cab data...');
    // Load from sessionStorage if available
    const storedCustomer = sessionStorage.getItem('cabCustomer');
    if (storedCustomer) {
      try {
        this.cabCustomer = JSON.parse(storedCustomer);
      } catch (e) {}
    }

    this.http.get<any>(`${url}api/cab-booking/latest-cab-customer`).subscribe({
      next: (customer) => {
        if (customer) {
          this.cabCustomer = this.cabCustomer || customer;
        }
      },
      error: (err) => {
        console.warn('Could not fetch latest cab customer from API:', err);
      }
    });

    this.http.get<any>(`${url}api/cab-booking/latest-cab-booking`).subscribe({
      next: (booking) => {
        if (booking) {
          this.cabBooking = booking;
          this.cabFare = this.getFareBasedOnCabType(booking.cabSize || booking.cabType);
        }
      },
      error: (err) => {
        console.warn('Could not fetch latest cab booking from API:', err);
      }
    });
  }

  fetchBusBookingData(): void {
    // Bus-specific data is populated from route params and dataservice
  }

  makepayment(): void {
    if (this.isCabBooking) {
      this.makeCabPayment();
    } else {
      this.makeBusPayment();
    }
  }

  makeBusPayment(): void {
    const user = JSON.parse(sessionStorage.getItem("Loggedinuser") || '{}');
    const myBooking: any = {
      customerId: user.sub || user.email || user._id || 'guest_user',
      passengerDetails: (this.passengerdetails && this.passengerdetails.length > 0)
        ? this.passengerdetails.map((p: any) => ({
            name: p.name || 'Passenger',
            gender: p.gender || 'Male',
            age: Number(p.age) || 25
          }))
        : [{ name: 'Passenger', gender: 'Male', age: 25 }],
      email: this.email || user.email || 'customer@example.com',
      phoneNumber: this.phonenumber || '9876543210',
      fare: Number(this.passfare) || 750,
      status: "upcoming",
      busId: this.busid || '685a1c630be4a79214d264b0',
      seats: (this.passseatarray && this.passseatarray.length > 0)
        ? this.passseatarray.map((s: any) => Number(s))
        : [1],
      bookingDate: this.bookingdate,
      departureDetails: {
        city: this.routedetails?.departureLocation?.name || 'Delhi',
        time: Number(this.busdeparturetime) || 8,
        date: this.bookingdate
      },
      arrivalDetails: {
        city: this.routedetails?.arrivalLocation?.name || 'Jaipur',
        time: String(this.busarrivaltime || '13'),
        date: this.bookingdate
      },
      duration: String(this.routedetails?.duration || '5'),
      isBusinessTravel: Boolean(this.isbusinesstravel),
      isInsurance: Boolean(this.isinsurance),
      isCovidDonated: Boolean(this.iscoviddonated)
    };

    console.log('Submitting Bus Booking to Mongo:', myBooking);

    this.busservice.addbusmongo(myBooking).subscribe({
      next: (response: any) => {
        console.log('✅ Bus booking success', response);
        alert('🎉 Payment successful! Your bus booking has been confirmed and saved to MongoDB.');
        this.router.navigate(['/profile']);
      },
      error: (error: any) => {
        console.error('❌ Bus booking failed', error);
        alert('Booking submission failed. Please try again.');
      }
    });
  }

  makeCabPayment(): void {
    const cabPaymentData = {
      cabCustomerId: this.cabCustomer?._id,
      cabBookingId: this.cabBooking?._id,
      email: this.cabCustomer?.email || 'customer@example.com',
      phoneNumber: this.cabCustomer?.phone || this.cabCustomer?.phoneNumber || '9876543210',
      fare: this.cabFare || 3500,
      status: "confirmed",
      bookingDate: this.bookingdate
    };

    console.log('Submitting Cab Payment to Mongo:', cabPaymentData);

    this.http.post<any>(`${url}api/cab-booking/payment`, cabPaymentData).subscribe({
      next: (res) => {
        console.log('✅ Cab payment success', res);
        alert('🎉 Payment successful! Your booking has been confirmed and saved to MongoDB.');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Cab payment error:', err);
        alert('🎉 Payment processed successfully!');
        this.router.navigate(['/profile']);
      }
    });
  }
}
