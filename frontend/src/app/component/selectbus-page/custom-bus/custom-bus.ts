import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-bus',
  standalone: false,
  templateUrl: './custom-bus.html',
  styleUrl: './custom-bus.css'
})
export class CustomBus {

  constructor(private router: Router) {}

  selectedBusSize: string = '';
  selectedRouteType: string = '';
  selectedBusType: string = '';
  selectedStops: string = '';
  selectedAmenities: string[] = [];

  proceedWithSelection(){
  const selection = {
    busSize: this.selectedBusSize,
    routeType: this.selectedRouteType,
    stops: this.selectedStops || null,
    busType: this.selectedBusType,
    amenities: this.selectedAmenities,
    source: 'bus-custom'  // use this to detect source
  };

  sessionStorage.setItem('busBookingSelection', JSON.stringify(selection));
  this.router.navigate(['/navbar/cab-booking-form']);
}


  selectBusSize(size: string) {
  this.selectedBusSize = size;
}
  selectRouteType(type: string) {
    this.selectedRouteType = type;
  }

  selectBusType(type: string) {
    this.selectedBusType = type;
  }

  selectStops(stops: string) {
    this.selectedStops = stops;
  }

  toggleAmenity(amenity: string) {
    const index = this.selectedAmenities.indexOf(amenity);
    if (index > -1) {
      this.selectedAmenities.splice(index, 1);
    } else {
      this.selectedAmenities.push(amenity);
    }
  }

}
