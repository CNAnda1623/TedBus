import { Component , OnInit} from '@angular/core';
import { ChatbotService } from './service/chatbot.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  isChatbotRoute = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isChatbotRoute = event.urlAfterRedirects.includes('/chatbot');
      }
    });
  }

  ngOnInit() {}
}