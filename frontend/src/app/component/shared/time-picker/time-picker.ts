import { Component, Input, Output, EventEmitter, OnInit, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-picker.html',
  styleUrls: ['./time-picker.css']
})
export class TimePicker implements OnInit, AfterViewInit {
  @Input() selectedTime: string = '10:00 AM';
  @Input() label: string = 'PICKUP TIME';
  @Input() isToday: boolean = false;

  @Output() timeChange = new EventEmitter<string>();

  @ViewChild('slotListContainer') slotListContainer!: ElementRef;

  isOpen: boolean = false;
  showCustomStepper: boolean = false;

  customHour: number = 10;
  customMinute: number = 0;
  customPeriod: 'AM' | 'PM' = 'AM';

  slots: { label: string; value24: string; hour: number; minute: number; isDisabled: boolean }[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.generateSlots();
    this.parseInitialTime();
  }

  ngAfterViewInit(): void {
    if (this.isOpen) this.scrollToActive();
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToActive(), 50);
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

  selectSlot(slot: { label: string; isDisabled: boolean }): void {
    if (slot.isDisabled) return;
    this.selectedTime = slot.label;
    this.timeChange.emit(this.selectedTime);
    this.close();
  }

  parseInitialTime(): void {
    if (!this.selectedTime) {
      this.selectedTime = '10:00 AM';
    }
    // Standardize display
    if (this.selectedTime.includes(':')) {
      const parts = this.selectedTime.split(' ');
      const timePart = parts[0];
      const period = (parts[1] || 'AM').toUpperCase() as 'AM' | 'PM';
      const [h, m] = timePart.split(':').map(Number);
      if (!isNaN(h)) {
        if (!parts[1]) {
          // If 24-hr format was passed like "14:30"
          const h12 = h % 12 || 12;
          const p = h >= 12 ? 'PM' : 'AM';
          this.selectedTime = `${h12.toString().padStart(2, '0')}:${(m || 0).toString().padStart(2, '0')} ${p}`;
          this.customHour = h12;
          this.customMinute = m || 0;
          this.customPeriod = p;
        } else {
          this.customHour = h;
          this.customMinute = m || 0;
          this.customPeriod = period;
        }
      }
    }
  }

  generateSlots(): void {
    const list: any[] = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (let h = 0; h < 24; h++) {
      for (const m of [0, 30]) {
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        const label = `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
        const value24 = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

        let isDisabled = false;
        if (this.isToday) {
          if (h < currentHour || (h === currentHour && m < currentMinute)) {
            isDisabled = true;
          }
        }

        list.push({ label, value24, hour: h, minute: m, isDisabled });
      }
    }
    this.slots = list;
  }

  scrollToActive(): void {
    if (!this.slotListContainer) return;
    const activeEl = this.slotListContainer.nativeElement.querySelector('.slot-btn.active');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  applyCustomTime(): void {
    const formatted = `${this.customHour.toString().padStart(2, '0')}:${this.customMinute.toString().padStart(2, '0')} ${this.customPeriod}`;
    this.selectedTime = formatted;
    this.timeChange.emit(this.selectedTime);
    this.close();
  }

  adjustHour(delta: number): void {
    let h = this.customHour + delta;
    if (h > 12) h = 1;
    if (h < 1) h = 12;
    this.customHour = h;
  }

  adjustMinute(delta: number): void {
    let m = this.customMinute + delta;
    if (m >= 60) m = 0;
    if (m < 0) m = 45;
    this.customMinute = m;
  }

  togglePeriod(): void {
    this.customPeriod = this.customPeriod === 'AM' ? 'PM' : 'AM';
  }
}
