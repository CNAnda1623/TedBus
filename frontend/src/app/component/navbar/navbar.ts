import { Component ,OnInit, AfterViewInit} from '@angular/core';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../service/customer.service';
import { CustomerModel } from '../../model/customer.model';
import { Route } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ChatbotService } from '../../service/chatbot.service';

declare var google:any;

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})

export class Navbar implements OnInit {
  isloggedIn: boolean = false;
  showMobileMenu: boolean = false;
  constructor(
     private router: Router,
     private customerservice: CustomerService,
     private cdRef: ChangeDetectorRef,
     private ngZone: NgZone,
     private chatbotService: ChatbotService
    ){}

  openHelpChatbot() {
    console.log('help clicked');
    this.chatbotService.openChatbot();
  }

  ngOnInit(): void {
     if(sessionStorage.getItem("Loggedinuser")){
    this.isloggedIn=true
  }else{
    this.isloggedIn=false
  }
    google.accounts.id.initialize({
      client_id: "381733711473-1jv1mbdngoh41cgci17ukr37fg1j7us4.apps.googleusercontent.com",
      callback:(response:any)=>{
      this.ngZone.run(() => {
        this.handlelogin(response);
      });
      },    
  });
}  

  ngAfterViewInit(): void {
    this.rendergooglebutton();
  }

  private rendergooglebutton():void {
    const googlebtn = document.getElementById('google-btn');
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
 handlelogin(response:any): void {
  const payload=this.decodetoken(response.credential)
  // console.log(payload)
  this.customerservice.addcustomermongo(payload).subscribe({
    next:(res)=>{
      // console.log('POST success',res);
      sessionStorage.setItem("Loggedinuser",JSON.stringify(res))
      this.isloggedIn=true;
      // console.log('User logged in successfully, isloggedIn:', this.isloggedIn);
      this.cdRef.detectChanges(); // Trigger change detection to update the view
    },
    error:(error)=>{
      console.error('Post request failed',error)
    }
  });
}

handlelogout(): void {
  this.showMobileMenu = false;
  google.accounts.id.disableAutoSelect();
  sessionStorage.removeItem('Loggedinuser');
  this.isloggedIn = false;
  this.cdRef.detectChanges(); // Trigger change detection to update the view
  window.location.reload()
}

toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

navigate(route:string): void {
  this.router.navigate([route])
}
}