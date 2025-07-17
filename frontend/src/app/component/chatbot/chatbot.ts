// chatbot.component.ts
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.html',
  standalone: false,
  styleUrls: ['./chatbot.css']
})

export class Chatbot implements OnInit {
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  
  messages: Message[] = [];
  currentMessage: string = '';
  isTyping: boolean = false;
  
  // Sample responses for demonstration
  private botResponses: { [key: string]: string } = {
    'what\'s the fare?': 'Bus fares vary by route and distance. For example, Delhi to Mumbai starts from ₹800 for regular buses and ₹1500 for AC sleeper buses. Please provide your specific route for exact pricing.',
    'available buses?': 'We have buses available 24/7 on major routes. Popular services include Volvo AC, sleeper buses, and semi-sleeper options. Which route are you interested in?',
    'help with booking': 'I can help you book your bus ticket! Here\'s how: 1) Select your source and destination 2) Choose travel date 3) Pick your preferred bus 4) Select seats 5) Complete payment. Need help with any specific step?',
    'bus timings': 'Bus timings vary by route. Most long-distance buses run every 30-60 minutes. Night buses typically depart between 9 PM - 11 PM. Which route would you like timing information for?',
    'cancellation policy': 'Our cancellation policy: Free cancellation up to 24 hours before departure. 24-12 hours: 25% charges. 12-2 hours: 50% charges. Less than 2 hours: 75% charges. No refund after departure.',
    'seat selection': 'You can select your preferred seats during booking. We offer window seats, aisle seats, and front/back preferences. Premium buses have reclining seats and extra legroom options available.'
  };

  ngOnInit(): void{
    // Optional: Add a welcome message
    this.addBotMessage('Hello! I\'m your AI Travel Assistant. I can help you with bus bookings, fares, schedules, and more. How can I assist you today?');
  }

  selectQuestion(question: string) {
    this.currentMessage = question;
    this.sendMessage();
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.isTyping) return;

    const userMessage: Message = {
      id: this.generateId(),
      content: this.currentMessage,
      type: 'user',
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const messageText = this.currentMessage.toLowerCase();
    this.currentMessage = '';

    this.scrollToBottom();

    // Simulate bot typing
    this.isTyping = true;
    setTimeout(() => {
      this.handleBotResponse(messageText);
      this.isTyping = false;
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }

  private handleBotResponse(userMessage: string) {
    let botResponse = this.getBotResponse(userMessage);
    this.addBotMessage(botResponse);
  }

  private getBotResponse(message: string): string {
    // Check for exact matches first
    if (this.botResponses[message]) {
      return this.botResponses[message];
    }

    // Check for partial matches
    for (const key in this.botResponses) {
      if (message.includes(key) || key.includes(message)) {
        return this.botResponses[key];
      }
    }

    // Check for keywords
    if (message.includes('fare') || message.includes('price') || message.includes('cost')) {
      return this.botResponses['what\'s the fare?'];
    }
    
    if (message.includes('bus') && (message.includes('available') || message.includes('schedule'))) {
      return this.botResponses['available buses?'];
    }
    
    if (message.includes('book') || message.includes('reservation')) {
      return this.botResponses['help with booking'];
    }
    
    if (message.includes('time') || message.includes('schedule')) {
      return this.botResponses['bus timings'];
    }
    
    if (message.includes('cancel') || message.includes('refund')) {
      return this.botResponses['cancellation policy'];
    }
    
    if (message.includes('seat')) {
      return this.botResponses['seat selection'];
    }

    // Default response
    return 'I understand you\'re looking for travel information. I can help you with bus fares, schedules, booking assistance, cancellation policies, and seat selection. Could you please be more specific about what you need help with?';
  }

  private addBotMessage(content: string) {
    const botMessage: Message = {
      id: this.generateId(),
      content: content,
      type: 'bot',
      timestamp: new Date()
    };

    this.messages.push(botMessage);
    this.scrollToBottom();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.chatMessages) {
        const element = this.chatMessages.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }

  closeChat() {
    // Implement close functionality
    console.log('Chat closed');
    // You might want to emit an event to parent component
  }
}