import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPage } from './component/landing-page/landing-page';
import { SelectbusPage } from './component/selectbus-page/selectbus-page';
const routes: Routes = [
  {path: '',component: LandingPage},
  {path: 'selectbus-page',component: SelectbusPage},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
