import { Component } from '@angular/core';
import { CustomBookingConfig } from '../../shared/custom-booking-page/custom-booking-page';

@Component({
  selector: 'app-custom-bus',
  standalone: false,
  templateUrl: './custom-bus.html',
  styleUrls: ['./custom-bus.css']
})
export class CustomBus {
  busConfig: CustomBookingConfig = {
    product: 'custom-bus',
    title: 'Custom Bus Hire & Corporate Charters',
    subtitle: 'Rent an entire bus for weddings, corporate outings, pilgrimages, and group excursions',
    basePerKm: 38,
    groups: [
      {
        id: 'bus-size',
        title: 'Bus Seating Capacity',
        helper: 'Choose bus dimension appropriate for your entourage',
        icon: 'fa-solid fa-van-shuttle',
        multiSelect: false,
        options: [
          { id: 'minibus-20', title: 'Mini Coach (Tempo / Force)', desc: 'Agile navigation in hill stations & narrow roads', capacity: '20 Seater', fareRate: '₹32/km' },
          { id: 'standard-35', title: 'Deluxe Bus (Eicher / Tata)', desc: 'Comfortable push-back seats for medium groups', capacity: '35 Seater', fareRate: '₹42/km' },
          { id: 'volvo-45', title: 'Multi-Axle Volvo / Scania', desc: 'Ultra-luxurious air suspension touring coach', capacity: '45 Seater', fareRate: '₹58/km' },
          { id: 'sleeper-30', title: 'Executive Sleeper Coach', desc: 'Spacious lower & upper berths for overnight trips', capacity: '30 Berths', fareRate: '₹52/km' }
        ]
      },
      {
        id: 'route-type',
        title: 'Charter Route Style',
        helper: 'Select your itinerary plan',
        icon: 'fa-solid fa-map-location-dot',
        multiSelect: false,
        hasStopsPicker: true,
        options: [
          { id: 'point-to-point', title: 'Point-to-Point Transit', desc: 'Single destination direct transfer' },
          { id: 'round-trip', title: 'Round Trip Charter', desc: 'Bus remains dedicated to your group for full duration' },
          { id: 'multi-city', title: 'Multi-City Circuit Tour', desc: 'Custom holiday package with multi-point stopovers' }
        ]
      },
      {
        id: 'bus-type',
        title: 'Bus Specification',
        helper: 'Select cooling and comfort grade',
        icon: 'fa-solid fa-bus',
        multiSelect: false,
        options: [
          { id: 'ac-pushback', title: 'AC Luxury 2+2 Pushback', desc: 'Individual reading lights and air vents' },
          { id: 'ac-sleeper', title: 'AC 2+1 Sleeper Berths', desc: 'Curtains, privacy partitions & charging points' },
          { id: 'non-ac', title: 'Non-AC Economic Coach', desc: 'Wide sliding windows for budget group journeys' },
          { id: 'bharatbenz', title: 'BharatBenz Ultra-Glider', desc: 'Whisper-quiet cabin with electronic air suspension' }
        ]
      },
      {
        id: 'amenities',
        title: 'On-Board Amenities',
        helper: 'Select group entertainment & comfort amenities',
        icon: 'fa-solid fa-wand-magic-sparkles',
        multiSelect: true,
        options: [
          { id: 'blankets', title: 'Clean Blankets & Pillows', icon: 'fa-solid fa-bed' },
          { id: 'wifi', title: 'High-Speed Bus WiFi', icon: 'fa-solid fa-wifi' },
          { id: 'audio-video', title: 'Dual LED TV & Surround Sound', icon: 'fa-solid fa-tv' },
          { id: 'charging', title: 'Individual Charging Sockets', icon: 'fa-solid fa-plug' },
          { id: 'water', title: 'Carton of Mineral Water Bottles', icon: 'fa-solid fa-bottle-water' },
          { id: 'firstaid', title: 'Certified Emergency First Aid Kit', icon: 'fa-solid fa-kit-medical' }
        ]
      }
    ]
  };
}
