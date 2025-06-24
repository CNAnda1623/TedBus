import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
declare var google:any;
import { CustomerService } from '../../service/customer.service';
import { CustomerModel } from '../../model/customer.model';
import { Route } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})

export class Navbar implements OnInit {
  constructor(private router: Router, private customerservice: CustomerService){}
  isloggedIn: boolean = false;
  ngOnInit(): void {
     if(sessionStorage.getItem("Loggedinuser")){
    this.isloggedIn=true
  }else{
    this.isloggedIn=false
  }
    google.accounts.id.initialize({
      client_id: "381733711473-1jv1mbdngoh41cgci17ukr37fg1j7us4.apps.googleusercontent.com",
      callback:(response:any)=>{
        this.handlelogin(response);
      }
    })
  }

  ngAfterViewInit(): void {
    this.rendergooglebutton();
  }

  private rendergooglebutton():void {
    const googlebtn = document.getElementById('googlebtn');
    if (googlebtn) {
      google.accounts.id.renderButton(
        googlebtn,
        { theme: 'outline', size: 'meduim', shape: 'pill', width:150, } // customization attributes
      );
    }
  }

  private decodetoken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
 handlelogin(response:any){
  const payload=this.decodetoken(response.credential)
  // console.log(payload)
  this.customerservice.addcustomermongo(payload).subscribe({
    next:(response)=>{
      console.log('POST success',response);
      sessionStorage.setItem("Loggedinuser",JSON.stringify(response))
    },
    error:(error)=>{
      console.error('Posr request failed',error)
    }
  })
}
handlelogout(){
  google.accounts.id.disableAutoSelect();
  sessionStorage.removeItem('Loggedinuser');
  window.location.reload()
}
navigate(route:string){
  this.router.navigate([route])
}
}