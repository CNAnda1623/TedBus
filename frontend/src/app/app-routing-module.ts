import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPage } from './component/landing-page/landing-page';
import { SelectbusPage } from './component/selectbus-page/selectbus-page';
import { PaymentPage } from './component/payment-page/payment-page';
import { CabBook } from './component/navbar/cab-book/cab-book';
import { CabBookingForm } from './component/navbar/cab-book/cab-booking-form/cab-booking-form';
import { Chatbot } from './component/chatbot/chatbot';
import { CommunityHub } from './component/community-hub/community-hub';
import { TrainPage } from './component/train-page/train-page';
import { HelpPage } from './component/help-page/help-page';
import { AccountPage } from './component/account-page/account-page';
import { CustomBus } from './component/selectbus-page/custom-bus/custom-bus';

const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'landing-page', component: LandingPage },
  { path: 'selectbus-page', component: SelectbusPage },
  { path: 'payment', component: PaymentPage },
  { path: 'cab-book', component: CabBook },
  { path: 'cab-payment', component: PaymentPage },
  { path: 'navbar/cab-booking-form', component: CabBookingForm },
  { path: 'custom-bus', component: CustomBus },
  { path: 'trains', component: TrainPage },
  { path: 'trains/pnr', redirectTo: 'trains', pathMatch: 'full' },
  { path: 'trains/live', redirectTo: 'trains', pathMatch: 'full' },
  { path: 'community', component: CommunityHub },
  { path: 'help', component: HelpPage },
  { path: 'account', component: AccountPage },

  // Redirects to unified Account dashboard
  { path: 'profile', redirectTo: 'account', pathMatch: 'full' },
  { path: 'my-trip', redirectTo: 'account', pathMatch: 'full' },
  { path: 'wallet', redirectTo: 'account', pathMatch: 'full' },
  { path: 'dashboard', redirectTo: 'account', pathMatch: 'full' },
  { path: 'forum', redirectTo: 'community', pathMatch: 'full' },
  { path: 'chatbot', component: Chatbot },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
