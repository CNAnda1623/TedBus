import { Component } from '@angular/core';
import { CustomBookingConfig } from '../../shared/custom-booking-page/custom-booking-page';

@Component({
  selector: 'app-cab-book',
  standalone: false,
  templateUrl: './cab-book.html',
  styleUrls: ['./cab-book.css']
})
export class CabBook {
  cabConfig: CustomBookingConfig = {
    product: 'cab',
    title: 'Outstation & Airport Cab Rental',
    subtitle: 'Chauffeur-driven sanitized cabs with zero cancellation fee and doorstep pickup',
    basePerKm: 14,
    groups: [
      {
        id: 'cab-size',
        title: 'Cab Size & Model',
        helper: 'Choose vehicle category matching your group size',
        icon: 'fa-solid fa-car',
        multiSelect: false,
        options: [
          { id: 'hatchback', title: 'Hatchback (WagonR / Indica)', desc: 'Ideal for solo or couple budget trips', capacity: '4 Pax', fareRate: '₹12/km' },
          { id: 'sedan', title: 'Sedan (Dzire / Etios)', desc: 'Spacious boot space & legroom for families', capacity: '4 Pax', fareRate: '₹14/km' },
          { id: 'suv', title: 'SUV (Ertiga / Carens)', desc: 'Comfortable family journeys with extra luggage', capacity: '6 Pax', fareRate: '₹18/km' },
          { id: 'luxury-suv', title: 'Premium SUV (Innova Crysta)', desc: 'Reclining captain seats for luxury transit', capacity: '7 Pax', fareRate: '₹24/km' }
        ]
      },
      {
        id: 'trip-type',
        title: 'Trip Type',
        helper: 'Select your journey routing style',
        icon: 'fa-solid fa-route',
        multiSelect: false,
        hasStopsPicker: true,
        options: [
          { id: 'one-way', title: 'One Way Drop', desc: 'Direct drop at destination with zero return toll' },
          { id: 'round-trip', title: 'Round Trip Tour', desc: 'Car remains with you until return to origin' },
          { id: 'airport-transfer', title: 'Airport Transfer', desc: 'Timely doorstep pickup / airport terminal drop' }
        ]
      },
      {
        id: 'facilities',
        title: 'Included In-Cab Facilities',
        helper: 'Select amenities for a comfortable road journey',
        icon: 'fa-solid fa-sparkles',
        multiSelect: true,
        options: [
          { id: 'ac', title: 'Chilled Air Conditioning', icon: 'fa-solid fa-snowflake' },
          { id: 'fasttag', title: 'Pre-enabled FASTag Tolls', icon: 'fa-solid fa-bolt' },
          { id: 'charging', title: 'USB Mobile Charger Ports', icon: 'fa-solid fa-plug' },
          { id: 'wifi', title: 'High-Speed WiFi Hotspot', icon: 'fa-solid fa-wifi' },
          { id: 'water', title: 'Sealed Bottled Water', icon: 'fa-solid fa-bottle-water' },
          { id: 'music', title: 'Bluetooth Audio Player', icon: 'fa-solid fa-music' }
        ]
      },
      {
        id: 'time-preference',
        title: 'Pick-Up Timing Preference',
        helper: 'Select preferred travel window',
        icon: 'fa-regular fa-clock',
        multiSelect: false,
        options: [
          { id: 'early-morning', title: 'Early Morning (04:00 - 08:00)', desc: 'Beat city traffic' },
          { id: 'daytime', title: 'Day Time (08:00 - 16:00)', desc: 'Standard business transit' },
          { id: 'evening', title: 'Evening Departure (16:00 - 20:00)', desc: 'Sunset cruise' },
          { id: 'night', title: 'Night Travel (20:00 - 00:00)', desc: 'Overnight transit' }
        ]
      }
    ]
  };
}
