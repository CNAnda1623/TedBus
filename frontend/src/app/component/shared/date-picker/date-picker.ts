import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.html',
  styleUrls: ['./date-picker.css']
})
export class DatePicker implements OnInit, OnChanges {
  @Input() selectedDate: string = ''; // YYYY-MM-DD
  @Input() minDate: string = '';      // YYYY-MM-DD
  @Input() maxDate?: string;          // YYYY-MM-DD
  @Input() label: string = 'DATE';
  @Input() compact: boolean = false;
  @Input() fareHint?: string;

  @Output() dateChange = new EventEmitter<string>();

  isOpen: boolean = false;
  currentMonth: Date = new Date();
  calendarDays: { date: Date; dateStr: string; dayNum: number; isCurrentMonth: boolean; isDisabled: boolean; isToday: boolean; isSelected: boolean }[] = [];
  weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    if (!this.selectedDate) {
      this.selectedDate = new Date().toISOString().split('T')[0];
    }
    if (!this.minDate) {
      this.minDate = new Date().toISOString().split('T')[0];
    }
    this.currentMonth = new Date(this.selectedDate + 'T00:00:00');
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate'] && changes['selectedDate'].currentValue) {
      this.currentMonth = new Date(this.selectedDate + 'T00:00:00');
      this.generateCalendar();
    }
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.currentMonth = new Date(this.selectedDate + 'T00:00:00');
      this.generateCalendar();
    }
  }

  close(): void {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  get formattedDisplayDate(): string {
    if (!this.selectedDate) return 'Select Date';
    try {
      const d = new Date(this.selectedDate + 'T00:00:00');
      return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return this.selectedDate;
    }
  }

  get monthYearTitle(): string {
    return this.currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }

  prevMonth(): void {
    const d = new Date(this.currentMonth);
    d.setMonth(d.getMonth() - 1);
    this.currentMonth = d;
    this.generateCalendar();
  }

  nextMonth(): void {
    const d = new Date(this.currentMonth);
    d.setMonth(d.getMonth() + 1);
    this.currentMonth = d;
    this.generateCalendar();
  }

  selectDate(dateStr: string, isDisabled: boolean): void {
    if (isDisabled) return;
    this.selectedDate = dateStr;
    this.dateChange.emit(this.selectedDate);
    this.close();
  }

  setQuickDate(offsetDays: number): void {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const dateStr = d.toISOString().split('T')[0];
    this.selectDate(dateStr, false);
  }

  private generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const days: any[] = [];

    // Preceding month trailing days
    const startDayIndex = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: d,
        dateStr,
        dayNum: prevMonthLastDay - i,
        isCurrentMonth: false,
        isDisabled: true,
        isToday: dateStr === todayStr,
        isSelected: dateStr === this.selectedDate
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const dateStr = d.toISOString().split('T')[0];
      const isPast = this.minDate ? dateStr < this.minDate : false;
      const isFutureExceeded = this.maxDate ? dateStr > this.maxDate : false;
      days.push({
        date: d,
        dateStr,
        dayNum: i,
        isCurrentMonth: true,
        isDisabled: isPast || isFutureExceeded,
        isToday: dateStr === todayStr,
        isSelected: dateStr === this.selectedDate
      });
    }

    // Trailing days of next month to complete grid (multiples of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: d,
        dateStr,
        dayNum: i,
        isCurrentMonth: false,
        isDisabled: true,
        isToday: dateStr === todayStr,
        isSelected: dateStr === this.selectedDate
      });
    }

    this.calendarDays = days;
  }
}
