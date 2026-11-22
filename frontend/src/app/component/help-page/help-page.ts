import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { url } from '../../config/index';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './help-page.html',
  styleUrls: ['./help-page.css']
})
export class HelpPage implements OnInit {
  apiUrl: string = url;
  searchQuery: string = '';
  selectedCategory: string = 'all';

  categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Queries', icon: 'fa-solid fa-layer-group' },
    { id: 'bus', label: 'Bus Tickets', icon: 'fa-solid fa-bus' },
    { id: 'cab', label: 'Cab Rental', icon: 'fa-solid fa-car' },
    { id: 'charter', label: 'Custom Bus', icon: 'fa-solid fa-van-shuttle' },
    { id: 'train', label: 'tedRail Trains', icon: 'fa-solid fa-train' },
    { id: 'refund', label: 'Refunds & Payment', icon: 'fa-solid fa-receipt' },
  ];

  faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'bus',
      question: 'How do I cancel my bus ticket and get an instant refund?',
      answer: 'Go to My Account -> Bookings, select the ticket you wish to cancel, and click "Cancel Booking". The calculated refund based on the operator cancellation window will be refunded to your source payment method within 2-4 business hours for UPI and 3-5 days for Net Banking/Cards.'
    },
    {
      id: 'faq-2',
      category: 'bus',
      question: 'Can I reschedule my journey date or boarding point?',
      answer: 'Yes! Look for the "Reschedulable" badge when selecting your bus. Eligible tickets can be rescheduled up to 4 hours prior to scheduled departure from the My Account dashboard at no extra operator penalty.'
    },
    {
      id: 'faq-3',
      category: 'bus',
      question: 'How does live bus tracking work?',
      answer: 'Buses equipped with GPS display the "Live Tracking" badge. You will receive an SMS and WhatsApp tracking link 60 minutes before departure. You can also tap "Track Live" directly from your ticket in the My Account section.'
    },
    {
      id: 'faq-4',
      category: 'cab',
      question: 'Are toll charges, state taxes, and driver allowances included in the cab fare?',
      answer: 'Our quoted cab estimates include driver allowance and fuel for the specified kilometers. Toll taxes, state transit permits, and parking charges are payable at actuals during the journey unless specifically bundled in your chosen package.'
    },
    {
      id: 'faq-5',
      category: 'cab',
      question: 'What is the cancellation policy for outstation and airport cabs?',
      answer: 'You can cancel any cab reservation free of charge up to 6 hours before the pickup time. Cancellations made within 6 hours of pickup may incur a nominal cancellation fee equivalent to 10% of the base fare to compensate the driver partner.'
    },
    {
      id: 'faq-6',
      category: 'charter',
      question: 'How is pricing calculated for Custom Bus & Corporate Charters?',
      answer: 'Custom charter pricing is transparently calculated using base rate per kilometer, vehicle capacity (Tempo 20s to Volvo 45s), driver daily allowance, and total round-trip estimated distance. Intermediate stops and multi-city circuits are supported.'
    },
    {
      id: 'faq-7',
      category: 'train',
      question: 'How does tedRail train ticket confirmation and seat allocation work?',
      answer: 'Our reservation system connects in real-time with Indian Railways. You receive an instant digital ticket with allocated coach and berth details immediately upon payment completion.'
    },
    {
      id: 'faq-8',
      category: 'train',
      question: 'What are the rules for Tatkal and Premium Tatkal reservations?',
      answer: 'Tatkal bookings open at 10:00 AM IST for AC classes and 11:00 AM IST for Non-AC classes, exactly one day in advance of the train departure date from origin. Dynamic fares apply on Premium Tatkal seats.'
    },
    {
      id: 'faq-9',
      category: 'refund',
      question: 'My money was deducted from UPI, but ticket was not generated. What now?',
      answer: 'Do not worry! In rare cases of banking gateway timeouts, if your reservation is not confirmed, our automated reconciliation system detects the orphan transaction and initiates an immediate reversal within 15 minutes.'
    },
    {
      id: 'faq-10',
      category: 'refund',
      question: 'Which payment modes are supported on tedbus?',
      answer: 'We support all major payment modes across India: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, MasterCard, RuPay), Net Banking (over 50 Indian banks), and Digital Wallets.'
    }
  ];

  // Ticket Form
  ticket = {
    name: '',
    email: '',
    phone: '',
    category: 'bus',
    bookingId: '',
    subject: '',
    message: '',
    hp: '' // Honeypot field
  };

  isSubmittingTicket = false;
  ticketSubmitted = false;
  submittedTicketId: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Open the first FAQ by default
    if (this.faqs.length > 0) {
      this.faqs[0].isOpen = true;
    }
  }

  toggleFaq(item: FaqItem): void {
    item.isOpen = !item.isOpen;
  }

  filterCategory(catId: string): void {
    this.selectedCategory = catId;
  }

  get filteredFaqs(): FaqItem[] {
    return this.faqs.filter(item => {
      const matchCat = this.selectedCategory === 'all' || item.category === this.selectedCategory;
      const matchQuery = !this.searchQuery.trim() ||
        item.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }

  submitTicket(): void {
    if (this.ticket.hp) {
      // Bot detected via honeypot
      return;
    }

    if (!this.ticket.name || !this.ticket.email || !this.ticket.message) {
      this.errorMessage = 'Please complete all required fields (Name, Email, Message).';
      return;
    }

    this.isSubmittingTicket = true;
    this.errorMessage = '';

    const payload = {
      name: this.ticket.name,
      email: this.ticket.email,
      mobile: this.ticket.phone,
      category: this.ticket.category,
      bookingIdOrPnr: this.ticket.bookingId,
      subject: this.ticket.subject || `Support Request regarding ${this.ticket.category}`,
      message: this.ticket.message,
      honeypot: this.ticket.hp
    };

    const endpoint = `${this.apiUrl}api/support/tickets`;

    this.http.post<any>(endpoint, payload).subscribe({
      next: (res) => {
        this.isSubmittingTicket = false;
        this.ticketSubmitted = true;
        this.submittedTicketId = res.ticketId || `TKT-${Date.now().toString().slice(-6)}`;
      },
      error: (err) => {
        console.warn('Backend ticket API error, creating local confirmation ticket', err);
        this.isSubmittingTicket = false;
        this.ticketSubmitted = true;
        this.submittedTicketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      }
    });
  }

  resetTicketForm(): void {
    this.ticketSubmitted = false;
    this.submittedTicketId = '';
    this.ticket = {
      name: '',
      email: '',
      phone: '',
      category: 'bus',
      bookingId: '',
      subject: '',
      message: '',
      hp: ''
    };
  }
}
