import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer {
  currentYear: number = new Date().getFullYear();

  // Accordion state for mobile screens
  activeSection: string | null = null;

  toggleSection(section: string): void {
    this.activeSection = this.activeSection === section ? null : section;
  }

  isExpanded(section: string): boolean {
    return this.activeSection === section;
  }
}
