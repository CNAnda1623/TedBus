import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  code: string;
  label: string;
  desc?: string;
  icon?: string;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-select.html',
  styleUrls: ['./custom-select.css']
})
export class CustomSelect {
  @Input() label: string = 'SELECT';
  @Input() icon: string = 'fa-solid fa-sliders';
  @Input() options: SelectOption[] = [];
  @Input() selectedCode: string = '';

  @Output() selectChange = new EventEmitter<string>();

  isOpen: boolean = false;

  constructor(private elementRef: ElementRef) {}

  get selectedOption(): SelectOption | undefined {
    return this.options.find(o => o.code === this.selectedCode || o.label === this.selectedCode) || this.options[0];
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  close(): void {
    this.isOpen = false;
  }

  select(option: SelectOption): void {
    this.selectedCode = option.code;
    this.selectChange.emit(option.code);
    this.close();
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
}
