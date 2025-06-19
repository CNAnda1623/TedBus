import { Component } from '@angular/core';

@Component({
  selector: 'app-selectbus-page',
  standalone: false,
  templateUrl: './selectbus-page.html',
  styleUrls: ['./selectbus-page.css']
})
export class SelectbusPage {
  constructor(){
    console.log("SelectbusPage component initialized");
  }
}
