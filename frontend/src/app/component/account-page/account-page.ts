import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ThemeService, ThemePreference } from '../../service/theme.service';
import { Bus } from '../../service/bus.service';

export interface BookingRecord {
  id: string;
  pnr: string;
  product: 'Bus' | 'Cab' | 'Custom Bus' | 'Train';
  productIcon: string;
  bookingDate: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  operator: string;
  vehicleType: string;
  seats: string[];
  passengers: { name: string; age: number; gender: string; seat?: string }[];
  fare: number;
  pickupPoint: string;
  dropPoint: string;
  refundAmount?: number;
  utrNumber?: string;
  qrCode?: string;
}

export interface SavedPassenger {
  id: string;
  name: string;
  age: number;
  gender: string;
  berthPreference?: string;
}

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account-page.html',
  styleUrls: ['./account-page.css']
})
export class AccountPage implements OnInit {
  currentTab: 'bookings' | 'passengers' | 'wallet' | 'profile' = 'bookings';
  selectedProduct: string = 'All';
  selectedStatus: string = 'All';
  searchFilter: string = '';

  activeTheme: ThemePreference = 'system';

  user = {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    memberSince: 'March 2024',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=140&q=80',
    isLoggedIn: false
  };

  walletBalance: number = 450;

  bookings: BookingRecord[] = [
    {
      id: 'BK-98214',
      pnr: 'TED-NDLS-2026',
      product: 'Bus',
      productIcon: 'fa-solid fa-bus',
      bookingDate: '20 Nov 2026',
      status: 'Confirmed',
      from: 'Delhi (Kashmere Gate)',
      to: 'Jaipur (Sindhi Camp)',
      departureTime: '06:30 AM',
      arrivalTime: '11:45 AM',
      duration: '5h 15m',
      operator: 'Zingbus Plus Electric',
      vehicleType: 'Volvo 9600 Multi-Axle AC Sleeper',
      seats: ['U2', 'U3'],
      passengers: [
        { name: 'Rahul Sharma', age: 29, gender: 'Male', seat: 'U2' },
        { name: 'Pooja Sharma', age: 27, gender: 'Female', seat: 'U3' }
      ],
      fare: 1598,
      pickupPoint: 'ISBT Kashmere Gate Metro Gate 5',
      dropPoint: 'Sindhi Camp Platform 3',
      refundAmount: 1438
    },
    {
      id: 'BK-77412',
      pnr: 'TRN-839201',
      product: 'Train',
      productIcon: 'fa-solid fa-train',
      bookingDate: '15 Nov 2026',
      status: 'Confirmed',
      from: 'New Delhi (NDLS)',
      to: 'Varanasi Junction (BSB)',
      departureTime: '06:00 AM',
      arrivalTime: '02:00 PM',
      duration: '8h 00m',
      operator: '22436 Vande Bharat Express',
      vehicleType: 'Executive Class (EC)',
      seats: ['E1-14', 'E1-15'],
      passengers: [
        { name: 'Rahul Sharma', age: 29, gender: 'Male', seat: 'E1-14' },
        { name: 'Pooja Sharma', age: 27, gender: 'Female', seat: 'E1-15' }
      ],
      fare: 3500,
      pickupPoint: 'Platform 16, Ajmeri Gate Side',
      dropPoint: 'Platform 1, Main Hall',
      refundAmount: 3150
    },
    {
      id: 'BK-61029',
      pnr: 'CAB-DEL-AGR',
      product: 'Cab',
      productIcon: 'fa-solid fa-car',
      bookingDate: '02 Nov 2026',
      status: 'Completed',
      from: 'Delhi Airport (T3)',
      to: 'Agra Fort',
      departureTime: '08:00 AM',
      arrivalTime: '11:30 AM',
      duration: '3h 30m',
      operator: 'Ted Premier Sedans',
      vehicleType: 'Maruti Suzuki Dzire AC',
      seats: ['Full Cab'],
      passengers: [
        { name: 'Rahul Sharma', age: 29, gender: 'Male' }
      ],
      fare: 2850,
      pickupPoint: 'Doorstep T3 Pick-up Zone',
      dropPoint: 'Hotel Taj View, Agra'
    },
    {
      id: 'BK-44109',
      pnr: 'CHTR-MUM-PUN',
      product: 'Custom Bus',
      productIcon: 'fa-solid fa-van-shuttle',
      bookingDate: '12 Oct 2026',
      status: 'Cancelled',
      from: 'Mumbai (Bandra)',
      to: 'Pune (Hinjewadi)',
      departureTime: '07:00 AM',
      arrivalTime: '11:00 AM',
      duration: '4h 00m',
      operator: 'Ted Corporate Charters',
      vehicleType: 'Tempo Traveller (20 Seater)',
      seats: ['20 Seats'],
      passengers: [
        { name: 'Rahul Sharma', age: 29, gender: 'Male' }
      ],
      fare: 8400,
      pickupPoint: 'BKC Corporate Park Gate 2',
      dropPoint: 'Hinjewadi Phase 1 Circle',
      refundAmount: 7560,
      utrNumber: 'HDFC002910482910'
    }
  ];

  savedPassengers: SavedPassenger[] = [
    { id: 'p-1', name: 'Rahul Sharma', age: 29, gender: 'Male', berthPreference: 'Lower' },
    { id: 'p-2', name: 'Pooja Sharma', age: 27, gender: 'Female', berthPreference: 'Window' },
    { id: 'p-3', name: 'Anita Sharma', age: 58, gender: 'Female', berthPreference: 'Lower' }
  ];

  // Active modal or ticket drawer
  selectedBooking: BookingRecord | null = null;
  showTicketDrawer: boolean = false;
  showCancelModal: boolean = false;
  bookingToCancel: BookingRecord | null = null;
  cancelSuccessToast: boolean = false;

  // Add passenger modal
  showAddPassengerModal: boolean = false;
  newPassenger: Partial<SavedPassenger> = { gender: 'Male', berthPreference: 'No Preference' };

  constructor(public themeService: ThemeService, private busService: Bus) {}

  ngOnInit(): void {
    this.activeTheme = this.themeService.currentPreference();

    // Check logged in user
    try {
      const stored = sessionStorage.getItem('Loggedinuser');
      if (stored) {
        const u = JSON.parse(stored);
        this.user.isLoggedIn = true;
        this.user.name = u.name || this.user.name;
        this.user.email = u.email || this.user.email;
        if (u.picture) this.user.avatar = u.picture;
        if (u._id) {
          this.loadUserBookings(u._id);
        }
      }
    } catch {}
  }

  loadUserBookings(userId: string): void {
    this.busService.getbusmongo(userId).subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          const mapped = res.map((b: any, idx: number) => ({
            id: b._id || `BK-${Date.now().toString().slice(-5)}`,
            pnr: `TED-BUS-${b._id?.slice(-6) || Math.floor(100000 + Math.random() * 900000)}`,
            product: 'Bus' as const,
            productIcon: 'fa-solid fa-bus',
            bookingDate: b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
            status: (b.status || 'Confirmed') as any,
            from: b.departureDetails?.city || 'Delhi',
            to: b.arrivalDetails?.city || 'Jaipur',
            departureTime: b.departureDetails?.time || '08:00 AM',
            arrivalTime: b.arrivalDetails?.time || '01:00 PM',
            duration: b.duration || '5h 00m',
            operator: 'IntrCity SmartBus',
            vehicleType: 'Volvo AC Seater/Sleeper',
            seats: b.seats || ['A1'],
            passengers: b.passengerDetails || [{ name: this.user.name, age: 28, gender: 'Male' }],
            fare: b.fare || 750,
            pickupPoint: b.departureDetails?.location || 'Main Stand',
            dropPoint: b.arrivalDetails?.location || 'Central Stand',
            refundAmount: Math.round((b.fare || 750) * 0.9)
          }));
          this.bookings = [...mapped, ...this.bookings];
        }
      },
      error: () => {}
    });
  }

  setTheme(mode: ThemePreference): void {
    this.activeTheme = mode;
    this.themeService.setPreference(mode);
  }

  // Filter bookings
  get filteredBookings(): BookingRecord[] {
    return this.bookings.filter(b => {
      const matchProduct = this.selectedProduct === 'All' || b.product === this.selectedProduct;
      const matchStatus = this.selectedStatus === 'All' || b.status === this.selectedStatus;
      const query = this.searchFilter.toLowerCase().trim();
      const matchSearch = !query ||
        b.pnr.toLowerCase().includes(query) ||
        b.from.toLowerCase().includes(query) ||
        b.to.toLowerCase().includes(query) ||
        b.operator.toLowerCase().includes(query);
      return matchProduct && matchStatus && matchSearch;
    });
  }

  // Stats calculation
  get upcomingCount(): number {
    return this.bookings.filter(b => b.status === 'Confirmed').length;
  }

  get completedCount(): number {
    return this.bookings.filter(b => b.status === 'Completed').length;
  }

  get cancelledCount(): number {
    return this.bookings.filter(b => b.status === 'Cancelled').length;
  }

  get totalSpent(): number {
    return this.bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + b.fare, 0);
  }

  openTicketDrawer(b: BookingRecord): void {
    this.selectedBooking = b;
    this.showTicketDrawer = true;
  }

  closeTicketDrawer(): void {
    this.showTicketDrawer = false;
    this.selectedBooking = null;
  }

  promptCancel(b: BookingRecord): void {
    this.bookingToCancel = b;
    this.showCancelModal = true;
  }

  confirmCancel(): void {
    if (this.bookingToCancel) {
      this.bookingToCancel.status = 'Cancelled';
      this.bookingToCancel.utrNumber = `REF-${Math.floor(10000000 + Math.random() * 90000000)}`;
      this.showCancelModal = false;
      this.cancelSuccessToast = true;
      setTimeout(() => this.cancelSuccessToast = false, 4000);
      if (this.selectedBooking && this.selectedBooking.id === this.bookingToCancel.id) {
        this.selectedBooking.status = 'Cancelled';
      }
    }
  }

  savePassenger(): void {
    if (!this.newPassenger.name || !this.newPassenger.age) return;
    this.savedPassengers.push({
      id: `p-${Date.now()}`,
      name: this.newPassenger.name,
      age: Number(this.newPassenger.age),
      gender: this.newPassenger.gender || 'Male',
      berthPreference: this.newPassenger.berthPreference || 'No Preference'
    });
    this.showAddPassengerModal = false;
    this.newPassenger = { gender: 'Male', berthPreference: 'No Preference' };
  }

  deletePassenger(id: string): void {
    this.savedPassengers = this.savedPassengers.filter(p => p.id !== id);
  }

  printTicket(): void {
    window.print();
  }
}
