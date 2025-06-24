import { Component } from '@angular/core';
import { Bus } from '../../service/bus.service';
import { BookingModel } from '../../model/booking.model';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage {
  selecteditem: string = 'trips';
  currentCustomer: any = []
  currentname: string='';
  currentemail: string='';
  mytrip: BookingModel[] = []
  handlelistitemclick(selected: string): void{
    this.selecteditem = selected;
  }
  constructor(private busbooking: Bus) {}
  ngOnInit(): void {
    this.currentCustomer = sessionStorage.getItem('Loggedinuser')
    const user = JSON.parse(this.currentCustomer);
    this.currentname = user.name;
    this.currentemail = user.email;
    this.busbooking.getbusmongo(user._id).subscribe((response:any) => {
      this.mytrip = response;
      console.log(this.mytrip);
    });
  }
}
