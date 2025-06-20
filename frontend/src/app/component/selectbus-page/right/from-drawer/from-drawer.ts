import { Component , Input} from '@angular/core';

@Component({
  selector: 'app-from-drawer',
  standalone: false,
  templateUrl: './from-drawer.html',
  styleUrl: './from-drawer.css'
})
export class FromDrawer {
  @Input() selectedseat:number[]=[]
  @Input() seatprice:number=0;
  @Input() routedetails: any;
  @Input() busid:string=''
  @Input() busarrivaltime: number =0;
  @Input() busdeparturetime:number=0;
  @Input() operatorname:string=''
  formdrawerstate:boolean=false;
  sidenavopened=false;

  toogledrawer(open:boolean):void{
    this.formdrawerstate=open
  }
}
