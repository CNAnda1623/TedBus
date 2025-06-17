import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPage } from './component/landing-page/landing-page.js';
import { SelectbusPage } from './component/selectbus-page/selectbus-page';
const routes: Routes = [
  {path: '',component: LandingPage},
  {path: 'select-bus',component: SelectbusPage},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
