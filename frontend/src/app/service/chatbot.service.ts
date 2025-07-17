import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private isChatbotOpen = new BehaviorSubject<boolean>(false);
  chatbotState$ = this.isChatbotOpen.asObservable();

  openChatbot() {
    this.isChatbotOpen.next(true);
  }

  closeChatbot() {
    this.isChatbotOpen.next(false);
  }

  toggleChatbot() {
    this.isChatbotOpen.next(!this.isChatbotOpen.value);
  }
}

