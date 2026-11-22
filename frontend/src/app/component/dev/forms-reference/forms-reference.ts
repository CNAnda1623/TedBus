import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouteBuilder } from '../../shared/form/route-builder/route-builder';
import { TagInput } from '../../shared/form/tag-input/tag-input';
import { FileDropzone } from '../../shared/form/file-dropzone/file-dropzone';
import { DatePicker } from '../../shared/date-picker/date-picker';
import { TimePicker } from '../../shared/time-picker/time-picker';
import { CustomSelect } from '../../shared/custom-select/custom-select';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { ThemeService } from '../../../service/theme.service';

@Component({
  selector: 'app-forms-reference',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouteBuilder,
    TagInput,
    FileDropzone,
    DatePicker,
    TimePicker,
    CustomSelect,
    SearchBar
  ],
  templateUrl: './forms-reference.html',
  styleUrls: ['./forms-reference.css']
})
export class FormsReference {
  // Input states
  defaultInput: string = '';
  filledInput: string = 'Kashmere Gate ISBT, Counter 12';
  disabledInput: string = 'Disabled System Value';
  errorInput: string = 'Short';

  // Suffix/Prefix
  amount: number = 750;
  phone: string = '9876543210';

  // Textarea
  sampleStory: string = 'A scenic overnight bus ride traversing from Delhi through the Himalayan foothills towards Manali.';

  // Checkbox, Radio, Switch
  agreeTerms: boolean = true;
  selectedRadio: string = 'upi';
  switchActive: boolean = true;

  // RouteBuilder & TagInput
  stops: string[] = ['Delhi', 'Chandigarh', 'Manali'];
  destinations: string[] = ['Manali', 'Kasol'];
  photos: string[] = [];

  // Date and Time
  selectedDate: string = '2026-11-22';
  selectedTime: string = '10:00 AM';

  selectOptions = [
    { code: '3A', label: '3A - 3 Tier AC', desc: 'Air-conditioned sleeper' },
    { code: '2A', label: '2A - 2 Tier AC', desc: 'Spacious sleeper berths' },
    { code: '1A', label: '1A - First AC', desc: 'Coupe & Cabin luxury' }
  ];
  selectedClass: string = '3A';

  constructor(public themeService: ThemeService) {}

  toggleTheme(): void {
    const next = this.themeService.isDarkMode() ? 'light' : 'dark';
    this.themeService.setPreference(next);
  }
}
