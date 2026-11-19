import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from './dialog/dialog';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage {
  fromoption:string=''
  tooption:string=''
  date:string=''
  constructor(private router: Router, public dialog: MatDialog){}
  fromEvent(option:string){
    this.fromoption=option;
    console.log(this.fromoption)
  }
  toEvent(option:string){
    this.tooption=option;
  }
  selectPopularRoute(from: string, to: string) {
    this.fromoption = from;
    this.tooption = to;
    if (!this.date || this.date === 'null') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const day = tomorrow.getDate().toString().padStart(2, '0');
      const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
      const year = tomorrow.getFullYear().toString().substr(-2);
      this.date = `${day}/${month}/${year}`;
    }
    // smooth scroll to top search bar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  matchDate(event:any){
    if(event.value){
      const date = new Date(event.value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().substr(-2); // Get last two digits of the year
      this.date = `${day}/${month}/${year}`;
    }else{
      this.date = 'null';
    }
    console.log(this.date)
  }
  submit(){
    if(this.fromoption && this.tooption && this.date)
      {
        if(this.fromoption === 'Delhi' && this.tooption === 'Jaipur' ||
           this.fromoption === 'Mumbai' && this.tooption === 'Goa' ||
           this.fromoption === 'Bangalore' && this.tooption === 'Mysore' ||
           this.fromoption === 'Kolkata' && this.tooption === 'Darjeeling' ||
           this.fromoption === 'Chennai' && this.tooption === 'Pondicherry')
           {
           this.router.navigate(['/selectbus-page'],{
            queryParams: {
              departure: this.fromoption,
              arrival: this.tooption,
              date: this.date
           }
          });
          }else{
                const dialogRef = this.dialog.open(DialogComponent);
                dialogRef.afterClosed().subscribe(result => {
                  console.log(`Dialog result: ${result}`);
                });
              }  
            }else{
              alert("fill up the details!!!")
            }
  }
}
