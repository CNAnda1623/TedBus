import { Component , OnInit} from '@angular/core';
import { ChatbotService } from './service/chatbot.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  chatbotOpen = false;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(){
    this.chatbotService.chatbotState$.subscribe(state => {
      this.chatbotOpen = state;
      console.log('chatbot visibility:', state);
    });
  }
  protected title = 'frontend';
}

