import { Component } from '@angular/core';

@Component({
  selector: 'app-selectbus-page',
  standalone: false,
  templateUrl: './selectbus-page.html',
  styleUrls: ['./selectbus-page.css']
})
export class SelectbusPage {
  showCustomBus = false;

  handleCustomBusClick() {
    this.showCustomBus = true;
  }
}
