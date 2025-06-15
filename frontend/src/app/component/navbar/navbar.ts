import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})

export class Navbar {
  isloggedIn: boolean = true;

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  handlelogout() {
    // Example logout logic
    this.isloggedIn = false;

    // If you have an auth service, you would call logout there
    // this.authService.logout();

    // Optionally redirect to login/home page
    this.router.navigate(['/login']);

    console.log('User logged out');
  }
}