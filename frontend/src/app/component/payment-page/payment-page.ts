import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { HttpClient } from '@angular/common/http';
import { Bus } from '../../service/bus.service';

@Component({
  selector: 'app-payment-page',
  standalone: false,
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.css'
})
export class PaymentPage implements OnInit {
  passseatarray: any[] = [];
  passfare: number = 0;
  routedetails: any = [];
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
  switch (type) {
    case 'Micro': return 5000;
    case 'Sedan': return 6000;
    case 'SUV': return 8000;
    case 'Tempo Traveller': return 12000;
    default: return 0;
  }
}

formatTime(time: string): string {
  const hour = parseInt(time, 10);
  const formatted = hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  return formatted;
}

calculateDropTime(time: string): string {
  const pickupHour = parseInt(time, 10);
  const dropHour = (pickupHour + 5) % 24;
  return dropHour > 12 ? `${dropHour - 12} PM` : `${dropHour} AM`;
}

testApiEndpoints() {
  console.log("API test button clicked");
}


getDroppingTime(time: string, format: string): string {
  if (!time || !format) return 'N/A';

  let hour = parseInt(time, 10);
  if (isNaN(hour)) return 'N/A';

  hour += 5;

  if (format === 'PM' && hour < 12) hour += 12;
  if (hour >= 24) hour -= 24;

  const displayHour = hour > 12 ? hour - 12 : hour;
  const displayFormat = hour >= 12 ? 'PM' : 'AM';

  return `${displayHour} ${displayFormat}`;
}


  ngOnInit(): void {
    const currentRoute = this.router.url;
    console.log('Current Route:', currentRoute);

    this.bookingdate = new Date().toISOString().split('T')[0];

    if (currentRoute.includes('cab-booking-form')) {
      this.isCabBooking = true;
      this.fetchLatestCabData();
    } else {
      this.fetchBusBookingData();
    }

    this.route.params.subscribe(params => {
      this.passseatarray = params['selectedseat'];
      this.email = params['passemail'];
      this.phonenumber = params['passphn'];
      this.isbusinesstravel = params['passisbuisness'];
      this.isinsurance = params['passinsurance'];
      this.passfare = params['seatprice'];
      this.busid = params['busid'];
      this.busarrivaltime = params['busarrivaltime'];
      this.busdeparturetime = params['busdeparturetime'];
      this.iscoviddonated = params['passiscoviddonate'];
      this.operatorname = params['operatorname'];
      this.getloggedinuser();
    });

    this.dataservice.currentdata.subscribe((data: any) => {
      this.routedetails = data;
    });

    this.dataservice.passdata.subscribe((data: any) => {
      this.passengerdetails = data;
    });
  }

  getloggedinuser(): any {
    const loggedinuserjson = sessionStorage.getItem("Loggedinuser");
    if (loggedinuserjson) {
      this.customerId = JSON.parse(loggedinuserjson);
    } else {
      alert("Please login to continue");
    }
    return null;
  }

  fetchLatestCabData(): void {
    console.log('Fetching latest cab data...'); // Debug log
    this.http.get<any>('http://localhost:3000/cabcustomers/latest').subscribe({
      next: (customer) => {
        console.log('Fetched cab customer:', customer); // Debug log
        this.cabCustomer = customer;
      },
      error: (err) => {
        console.error('Error fetching latest cab customer:', err);
      }
    });

    this.http.get<any>('http://localhost:3000/cabbookings/latest').subscribe({
      next: (booking) => {
        console.log('Fetched cab booking:', booking); // Debug log
        this.cabBooking = booking;
      },
      error: (err) => {
        console.error('Error fetching latest cab booking:', err);
      }
    });
  }

  fetchBusBookingData(): void {
    // Placeholder: If you need to fetch extra bus-related info
  }

  makepayment(): void {
    if (this.isCabBooking) {
      this.makeCabPayment();
    } else {
      this.makeBusPayment();
    }
  }

  makeBusPayment(): void {
    const myBooking: any = {
      customerId: this.customerId._id,
      passengerDetails: this.passengerdetails,
      email: this.customerId.email,
      phoneNumber: this.phonenumber,
      fare: this.passfare,
      status: "upcoming",
      busId: this.busid,
      seats: this.passseatarray,
      bookingDate: this.bookingdate,
      departureDetails: {
        city: this.routedetails.departureLocation.name,
        time: this.busdeparturetime,
        date: this.bookingdate
      },
      arrivalDetails: {
        city: this.routedetails.arrivalLocation.name,
        time: this.busarrivaltime,
        date: this.bookingdate
      },
      duration: this.routedetails.duration,
      isBusinessTravel: this.isbusinesstravel,
      isInsurance: this.isinsurance,
      isCovidDonated: this.iscoviddonated
    };

    this.busservice.addbusmongo(myBooking).subscribe({
      next: (response: any) => {
        console.log('Bus booking success', response);
      },
      error: (error: any) => {
        console.error('Bus booking failed', error);
      }
    });
  }

  makeCabPayment(): void {
    if (!this.cabCustomer || !this.cabBooking) {
      console.error("Missing cab data.");
      return;
    }

    const cabPaymentData = {
      cabCustomerId: this.cabCustomer._id,
      cabBookingId: this.cabBooking._id,
      email: this.cabCustomer.email,
      phoneNumber: this.cabCustomer.phoneNumber,
      fare: this.cabBooking.totalFare,
      status: "upcoming",
      bookingDate: this.bookingdate
    };

    this.http.post<any>('http://localhost:3000/cabpayment', cabPaymentData).subscribe({
      next: (res) => {
        console.log('Cab payment success', res);
      },
      error: (err) => {
        console.error('Cab payment failed', err);
      }
    });
  }
}
