import { Component, OnInit, HostListener } from '@angular/core';
import { CabBookingService } from '../../../service/cab-booking.service';

@Component({
  selector: 'app-cab-book',
  standalone: false,
  templateUrl: './cab-book.html',
  styleUrls: ['./cab-book.css']
})
export class CabBook implements OnInit {

  constructor(private cabBookingService: CabBookingService) {}

  handleCabBookingSubmit() {
  const cabBooking = {
    departure: this.departure,
    arrival: this.arrival,
    date: this.date,
    cabSize: this.selectedCabType,
    tripType: this.selectedTripType,
    timePreference: this.selectedTime,
    facilities: this.selectedFacilities
  };

  console.log('Payload:', cabBooking);

  this.cabBookingService.createBooking(cabBooking).subscribe({
    next: () => {
      alert('Booking saved!');
      this.showCabBookingForm = true; // ✅ Show the form AFTER save
    },
    error: err => {
      console.error('Save failed', err);
      alert('Something went wrong while saving your booking.');
    }
  });
}

  

  // Original properties
  departure: string = 'Delhi';
  arrival: string = 'Jaipur';
  date: string = '2025-07-10';
  showCabBookingForm = false;

  // Header interactive properties
  selectedFrom: string = 'Delhi';
  selectedTo: string = 'Jaipur';
  selectedDate: string = 'Jul 10, 2025';
  
  // Dropdown states
  showFromDropdown: boolean = false;
  showToDropdown: boolean = false;
  showCalendar: boolean = false;
  
  // Search terms
  fromSearchTerm: string = '';
  toSearchTerm: string = '';
  
  // Calendar properties
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  calendarDays: any[] = [];
  
  // City lists
  cities: string[] = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 
    'Jaipur', 'Goa', 
    'Mysore', 'Darjeeling', 'Pondicherry'
  ];
  
  filteredFromCities: string[] = [];
  filteredToCities: string[] = [];
  
  // Facilities properties
  facilitiesList: string[] = [
    'AC',
    'Charging Port',
    'WiFi',
    'Baby Seat',
    'GPS Tracking',
    'TV',
    'Blankets'
  ];
  
  selectedFacilities: string[] = [];

  // Month names for display
  monthNames: string[] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  ngOnInit() {
    this.filteredFromCities = [...this.cities];
    this.filteredToCities = [...this.cities];
    this.updateCalendar();
  }

  // City dropdown methods
  toggleFromDropdown() {
    this.showFromDropdown = !this.showFromDropdown;
    this.showToDropdown = false;
    this.showCalendar = false;
    this.fromSearchTerm = '';
    this.filteredFromCities = [...this.cities];
  }

  toggleToDropdown() {
    this.showToDropdown = !this.showToDropdown;
    this.showFromDropdown = false;
    this.showCalendar = false;
    this.toSearchTerm = '';
    this.filteredToCities = [...this.cities];
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    this.showFromDropdown = false;
    this.showToDropdown = false;
    this.updateCalendar();
  }

  selectFromCity(city: string, event: MouseEvent) {
    event.stopPropagation(); // Prevent click from propagating to document
    this.selectedFrom = city;
    this.departure = city;
    this.showFromDropdown = false;
    this.fromSearchTerm = '';
    this.filteredFromCities = [...this.cities];
  }

  selectToCity(city: string, event: MouseEvent) {
    event.stopPropagation(); // Prevent click from propagating to document
    this.selectedTo = city;
    this.arrival = city;
    this.showToDropdown = false;
    this.toSearchTerm = '';
    this.filteredToCities = [...this.cities];
  }

  filterFromCities() {
    if (!this.fromSearchTerm) {
      this.filteredFromCities = [...this.cities];
    } else {
      this.filteredFromCities = this.cities.filter(city => 
        city.toLowerCase().includes(this.fromSearchTerm.toLowerCase())
      );
    }
  }

  filterToCities() {
    if (!this.toSearchTerm) {
      this.filteredToCities = [...this.cities];
    } else {
      this.filteredToCities = this.cities.filter(city => 
        city.toLowerCase().includes(this.toSearchTerm.toLowerCase())
      );
    }
  }

  swapCities() {
    const tempFrom = this.selectedFrom;
    const tempDeparture = this.departure;
    
    this.selectedFrom = this.selectedTo;
    this.departure = this.arrival;
    
    this.selectedTo = tempFrom;
    this.arrival = tempDeparture;
  }

  // Calendar methods
  updateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const today = new Date();
    const selectedDateObj = this.parseSelectedDate();
    
    this.calendarDays = [];
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const day = {
        day: currentDate.getDate(),
        date: currentDate,
        isToday: this.isSameDay(currentDate, today),
        isSelected: selectedDateObj && this.isSameDay(currentDate, selectedDateObj),
        isOtherMonth: currentDate.getMonth() !== this.currentMonth,
        isDisabled: currentDate < today && !this.isSameDay(currentDate, today)
      };
      
      this.calendarDays.push(day);
    }
  }

  selectDate(day: any) {
    if (day.isDisabled) return;
    
    const selectedDate = new Date(day.date);
    this.selectedDate = this.formatDate(selectedDate);
    this.date = this.formatDateForBackend(selectedDate);
    this.showCalendar = false;
    this.updateCalendar();
  }

  selectToday() {
    const today = new Date();
    this.selectedDate = this.formatDate(today);
    this.date = this.formatDateForBackend(today);
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.showCalendar = false;
    this.updateCalendar();
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.updateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.updateCalendar();
  }

  // Utility methods
  private parseSelectedDate(): Date | null {
    if (!this.selectedDate) return null;
    
    // Parse format like "Jul 10, 2025"
    const parts = this.selectedDate.split(' ');
    if (parts.length !== 3) return null;
    
    const monthIndex = this.monthNames.indexOf(parts[0]);
    const day = parseInt(parts[1].replace(',', ''));
    const year = parseInt(parts[2]);
    
    if (monthIndex === -1 || isNaN(day) || isNaN(year)) return null;
    
    return new Date(year, monthIndex, day);
  }

  private formatDate(date: Date): string {
    const month = this.monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  private formatDateForBackend(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  // Existing facilities methods
  toggleFacility(facility: string) {
    const index = this.selectedFacilities.indexOf(facility);
    if (index > -1) {
      this.selectedFacilities.splice(index, 1);
    } else {
      this.selectedFacilities.push(facility);
    }
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    // Check if click is outside the dropdown areas
    if (!target.closest('.search-field') && !target.closest('.city-dropdown') && !target.closest('.calendar-dropdown')) {
      this.showFromDropdown = false;
      this.showToDropdown = false;
      this.showCalendar = false;
    }
  }

  // Keyboard navigation support
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.showFromDropdown = false;
      this.showToDropdown = false;
      this.showCalendar = false;
    }
  }

  selectedCabType: string = '';
  selectedTripType: string = '';
  selectedTime: string = '';

  selectCabType(type: string) {
    this.selectedCabType = type;
  }

  selectTripType(type: string) {
    this.selectedTripType = type;
  }

  selectTime(type: string) {
    this.selectedTime = type;
  }

  


  }