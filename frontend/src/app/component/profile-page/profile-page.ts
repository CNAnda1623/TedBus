import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage {
  selecteditem: string = 'trips';
  currentCustomer: any = []
  handlelistitemclick(selected: string): void{
    this.selecteditem = selected;
  }
}
