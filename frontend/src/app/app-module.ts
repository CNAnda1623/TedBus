import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
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

@NgModule({
  declarations: [
    App,
    Navbar,
    Footer,
    LandingPage,
    DialogComponent,
    SelectbusPage,
    SortingBar,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMenuModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatTableModule,
    FormsModule,
    LeftComponent,
    Header,
    Right,
    BusBox,
    MatIconModule,
    CommonModule,
    MatSidenavModule,
    MatDividerModule
  ],
  providers: [
    provideNativeDateAdapter(),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
