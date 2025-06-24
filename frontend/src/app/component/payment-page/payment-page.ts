import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../service/data.service';
import { HttpClient } from '@angular/common/http';
import { Bus } from '../../service/bus.service';

@Component({
  selector: 'app-payment-page',
  standalone: false,
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.css'
})
export class PaymentPage implements OnInit {
  passseatarray: any[] = [];
  passfare: number = 0;
  routedetails: any = [];
  busdeparturetime: number = 0;
  busarrivaltime: number = 0;
  customerId: any={}
  operatorname: string = '';
  passengerdetails: any = []
  email: string = '';
  fare:number = 0;
  busid: string = '';
  phonenumber: string = '';
  departuredetails: any = [];
  arrivaldetails: any = [];
  duration: string = '';
  isbusinesstravel: boolean = false;
  iscoviddonated: boolean = false;
  isinsurance: boolean = false;
  bookingdate: string = new Date().toISOString().split('T')[0];
constructor(private route: ActivatedRoute, private dataservice : DataService, private http: HttpClient, private busservice: Bus) {}
ngOnInit(): void {
  this.route.params.subscribe(params => {
    const passSeatsArray = params['selectedseat'];
    const email = params['passemail'];
    const phoneNumber = params['passphn'];
    const isBusinessTravel = params['passisbuisness'];
    const isInsurance = params['passinsurance'];
    const passFare=params['seatprice'];
    const busId=params['busid'];
    const busArrivalTime=params['busarrivaltime'];
    const busDepartureTime=params['busdeparturetime'];
    const iscoviddonated=params['passiscoviddonate'];
    const operatorname=params['operatorname']
    this.operatorname=operatorname
    this.passseatarray=passSeatsArray
    this.email=email
    this.phonenumber=phoneNumber
    this.isbusinesstravel=isBusinessTravel
    this.isinsurance=isInsurance
    this.passfare=passFare
    this.busid=busId
    this.busarrivaltime=busArrivalTime
    this.busdeparturetime=busDepartureTime
    this.iscoviddonated=iscoviddonated
    this.getloggedinuser()
})

this.dataservice.currentdata.subscribe((data: any)=>{
    this.routedetails=data;
    console.log(data)
  })
  this.dataservice.passdata.subscribe((data: any)=>{
    this.passengerdetails=data;
    console.log(data)
  })
}
getloggedinuser():any{
    const loggedinuserjson=sessionStorage.getItem("Loggedinuser");
    if(loggedinuserjson){
      this.customerId=JSON.parse(loggedinuserjson)
    }
    else{
      alert("please login to continue")
    }
    return null;
}

makepayment():void{
  let myBooking: any = {};
    myBooking.customerId = this.customerId._id;
    myBooking.passengerDetails = this.passengerdetails;
    myBooking.email = this.customerId.email;
    myBooking.phoneNumber = this.phonenumber;
    myBooking.fare = this.passfare;
    myBooking.status = "upcoming";
    myBooking.busId = this.busid;
    let date=new Date();
    myBooking.bookingDate=`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    myBooking.seats = this.passseatarray;
    myBooking.departureDetails = {city:this.routedetails.departureLocation.name,
      time:this.busdeparturetime,
      date:this.bookingdate
    }
    myBooking.arrivalDetails = {city:this.routedetails.arrivalLocation.name,
      time:this.busarrivaltime,
      date:this.bookingdate
    }
    myBooking.duration = this.routedetails.duration;
    myBooking.isBusinessTravel = this.isbusinesstravel;
    myBooking.isInsurance = this.isinsurance;
    myBooking.isCovidDonated = this.iscoviddonated;
    // console.log(myBooking)
    this.busservice.addbusmongo(myBooking).subscribe({
      next:(response: any)=>{
        console.log('Bus post request success',response);
      },
      error:(error: any)=>{
        console.error('Post request failed',error)
      }
    })
}
}