import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CabCustomerService } from '../../../../service/cab-customer.service';

@Component({
  selector: 'app-cab-booking-form',
  standalone: false,
  templateUrl: './cab-booking-form.html',
  styleUrl: './cab-booking-form.css'
})
export class CabBookingForm {
  constructor(
    private cabCustomerService: CabCustomerService,
    private router: Router
  ) {}

  @Output() close = new EventEmitter<void>();

  cabDetails = {
    name: '',
    gender: '',
    age: null,
    email: '',
    phone: '',
    insurance: false,
    business: false,
    whatsappUpdates: false
  };

  closeForm() {
    this.close.emit();
  }

  submitForm() {
    console.log('Form Submitted:', this.cabDetails);

    // Save to MongoDB
    this.cabCustomerService.addCabCustomer(this.cabDetails).subscribe({
      next: (res: any) => {
        console.log('Cab Customer Saved:', res);

        // Save customer data to sessionStorage
        sessionStorage.setItem('cabCustomer', JSON.stringify(res.savedCustomer));

        // Navigate to cab payment page
        this.router.navigate(['/cab-payment']);
      },
      error: err => {
        console.error('Failed to save cab customer:', err);
        alert('Failed to submit form. Try again.');
      }
    });
  }
}
