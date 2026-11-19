import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CabCustomerService } from '../../../../service/cab-customer.service';
import { HttpClient } from '@angular/common/http';
import { url } from '../../../../config/index';

@Component({
  selector: 'app-cab-booking-form',
  standalone: false,
  templateUrl: './cab-booking-form.html',
  styleUrl: './cab-booking-form.css'
})
export class CabBookingForm {
  constructor(
    private cabCustomerService: CabCustomerService,
    private router: Router,
    private http: HttpClient
  ) {}

  @Output() close = new EventEmitter<void>();

  isBusBooking: boolean = false;
  busBookingSelection: any = null;

  ngOnInit(): void {
    const busBookingData = sessionStorage.getItem('busBookingSelection');
    if (busBookingData) {
      this.isBusBooking = true;
      this.busBookingSelection = JSON.parse(busBookingData);
    }
  }

  cabDetails = {
    name: '',
    gender: '',
    age: null,
    time: '',
    timeFormat: 'AM',
    email: '',
    phone: '',
    insurance: false,
    business: false,
    whatsappUpdates: false
  };

  closeForm() {
    this.close.emit();
    if (this.router.url.includes('cab-booking-form')) {
      window.history.back();
    }
  }

  submitForm() {
    if (!this.cabDetails.name || !this.cabDetails.email || !this.cabDetails.phone) {
      alert('Please enter Name, Email, and Phone number.');
      return;
    }

    console.log('Form Submitted:', this.cabDetails);

    const payload: any = {
      ...this.cabDetails
    };

    // If user came from bus customization, add bus options
    if (this.isBusBooking) {
      payload.busOptions = this.busBookingSelection;
    }

    // Set endpoint based on source
    const endpoint = this.isBusBooking
      ? `${url}api/custom-bus-customer`
      : `${url}api/cab-customer`;

    // Use HttpClient directly instead of service for dual route logic
    this.http.post(endpoint, payload).subscribe({
      next: (res: any) => {
        console.log('Customer Saved:', res);
        sessionStorage.setItem('cabCustomer', JSON.stringify(res.savedCustomer || res));

        this.router.navigate(['/cab-payment']);
      },
      error: err => {
        console.error('Failed to save customer:', err);
        alert('Failed to submit form. Try again.');
      }
    });
  }
}