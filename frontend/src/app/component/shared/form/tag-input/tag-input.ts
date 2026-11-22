import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tag-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tag-input.html',
  styleUrls: ['./tag-input.css']
})
export class TagInput implements OnInit {
  @Input() tags: string[] = [];
  @Input() maxTags: number = 5;
  @Input() suggestions: string[] = ['Goa', 'Shimla', 'Manali', 'Jaipur', 'Udaipur', 'Kerala', 'Rishikesh', 'Varanasi', 'Ooty'];
  @Input() placeholder: string = 'Add destination...';

  @Output() tagsChange = new EventEmitter<string[]>();

  inputText: string = '';
  showDropdown: boolean = false;

  ngOnInit(): void {
    if (!this.tags) this.tags = [];
  }

  addTag(tag: string): void {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (this.tags.length >= this.maxTags) return;
    if (!this.tags.includes(trimmed)) {
      this.tags.push(trimmed);
      this.tagsChange.emit([...this.tags]);
    }
    this.inputText = '';
    this.showDropdown = false;
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
    this.tagsChange.emit([...this.tags]);
  }

  get availableSuggestions(): string[] {
    const q = this.inputText.toLowerCase().trim();
    return this.suggestions.filter(s => !this.tags.includes(s) && (!q || s.toLowerCase().includes(q)));
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag(this.inputText);
    } else if (event.key === 'Backspace' && !this.inputText && this.tags.length > 0) {
      this.removeTag(this.tags.length - 1);
    }
  }
}
