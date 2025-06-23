import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './component/navbar/navbar';
import { Footer } from './component/footer/footer';
import { LandingPage } from './component/landing-page/landing-page.js';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from './component/landing-page/dialog/dialog';
import { Router } from '@angular/router';
import { SelectbusPage } from './component/selectbus-page/selectbus-page';
import { Header } from './component/selectbus-page/header/header';
import { LeftComponent } from './component/selectbus-page/left/left';
import { Right } from './component/selectbus-page/right/right';
import { MatIconModule } from '@angular/material/icon';
import { SortingBar } from './component/selectbus-page/right/sorting-bar/sorting-bar';
import { BusBox } from './component/selectbus-page/right/bus-box/bus-box';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { BusBookingForm } from './component/selectbus-page/right/bus-booking-form/bus-booking-form';
import { FormDrawer } from './component/selectbus-page/right/form-drawer/form-drawer';
import { SmallSeats } from './component/selectbus-page/right/small-seats/small-seats';
import { ViewSeats } from './component/selectbus-page/right/view-seats/view-seats';
import { BottomTab } from './component/selectbus-page/right/bus-book/bottom-tab/bottom-tab';
import { Bus } from './service/bus.service';
import { PaymentPage } from './component/payment-page/payment-page';

@NgModule({
  declarations: [
    App,
    Navbar,
    Footer,
    LandingPage,
    DialogComponent,
    SelectbusPage,
    SortingBar,
    BusBookingForm,
    Header,
    Right,
    BusBox,
    FormDrawer,
    SmallSeats,
    ViewSeats,
    BottomTab,
    PaymentPage,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMenuModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatDialogModule,
    HttpClientModule,
    MatTableModule,
    FormsModule,
    LeftComponent,
    MatIconModule,
    CommonModule,
    MatSidenavModule,
    MatDividerModule
  ],
  exports: [
    FormDrawer
  ],
  providers: [
    provideNativeDateAdapter(),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
