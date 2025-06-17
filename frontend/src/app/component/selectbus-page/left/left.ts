import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ required for *ngIf, *ngFor
import { MatIconModule } from '@angular/material/icon'; // ✅ required for <mat-icon>

@Component({
  selector: 'app-left',
  imports: [CommonModule, MatIconModule],
  standalone: true,
  templateUrl: './left.html',
  styleUrls: ['./left.css']
})
export class LeftComponent {
  amenityIcon:{[key:string]: string}={
    wifi: 'wifi',
    waterBottle: 'local_drink',
    blankets: 'hotel',
    chargingPoint: 'battery_charging_full',
    movie: 'movie',
  }
  sidefiltervalues:any={
    livetracking:false,
    reschedulable:false,
    departuretime:{
      "before 6 am":false,
      "6 am to 12 pm": false,
      "12pm to 6 pm ": false,
      "after 6 pm": false,
    },
    bustype:{
      Seater:false,
      Sleeper:false,
      Ac:false,
      Nonac:false,
    },
    arrivaltime:{
      "before 6 am":false,
      "6 am to 12 pm": false,
      "12pm to 6 pm ": false,
      "after 6 pm": false,
    },
    amenities:{
      wifi:false,
      waterBottle:false,
      blankets:false,
      chargingPoint:false,
      movie:false,
    },
  }
  getobjectkey(obj:any):string[]{
    return Object.keys(obj);
  }

  handlelivetrackingclick(): void{
    this.sidefiltervalues.livetracking=!this.sidefiltervalues.livetracking
  }
  handlerescheduleclick():void{
    this.sidefiltervalues.reschedulable=!this.sidefiltervalues.reschedulable
  }
  handledeparturetimeclick(event:any,name:string):void{
    this.sidefiltervalues.departuretime[name]=event.target.checked;
  }
  handlearivaltimeclick(event:any,name:string):void{
    this.sidefiltervalues.arrivaltime[name]=event.target.checked;
  }
  handlebustypeclick(event:any,name:string):void{
    this.sidefiltervalues.bustype[name]=event.target.checked;
  }
}