import { Component , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-cab-booking-form',
  standalone: false,
  templateUrl: './cab-booking-form.html',
  styleUrl: './cab-booking-form.css'
})

export class CabBookingForm {
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
    // Submit logic here...
    this.closeForm(); // Close after submit
  }
}

