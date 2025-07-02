import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-bus',
  standalone: false,
  templateUrl: './custom-bus.html',
  styleUrl: './custom-bus.css'
})
export class CustomBus {

  selectedBusSize: string = '';
  selectedRouteType: string = '';
  selectedBusType: string = '';
  selectedStops: string = '';
  selectedAmenities: string[] = [];

  proceedWithSelection(): void {
  console.log('Bus customization submitted!');
  console.log('Selected Bus Size:', this.selectedBusSize);
  console.log('Selected Bus Type:', this.selectedBusType);
  console.log('Selected Route Type:', this.selectedRouteType);
  console.log('Selected Stops:', this.selectedStops);
  console.log('Selected Amenities:', this.selectedAmenities);
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
