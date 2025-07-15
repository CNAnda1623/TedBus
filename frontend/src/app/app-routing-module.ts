import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPage } from './component/landing-page/landing-page';
import { SelectbusPage } from './component/selectbus-page/selectbus-page';
import { PaymentPage } from './component/payment-page/payment-page';
import { ProfilePage } from './component/profile-page/profile-page';
import { CabBook } from './component/navbar/cab-book/cab-book';
import { CabBookingForm } from './component/navbar/cab-book/cab-booking-form/cab-booking-form';


const routes: Routes = [
  { path: '',component: LandingPage},
  { path: 'selectbus-page',component: SelectbusPage},
  { path: 'payment', component: PaymentPage},
  { path: 'profile', component: ProfilePage},
  { path: 'cab-book', component: CabBook },
  { path: 'cab-payment', component: PaymentPage },
  { path: 'navbar/cab-booking-form', component: CabBookingForm },
  { path: 'landing-page', component: LandingPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
