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
           this.fromoption === 'KolKata' && this.tooption === 'Darjeeling' ||
           this.fromoption === 'Chennai' && this.tooption === 'Pondicherry')
           {
           this.router.navigate([''])
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
