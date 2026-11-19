import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const saved = localStorage.getItem('tedbus-theme');
    if (saved) {
      this.setTheme(saved === 'dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark);
    }
  }

  toggleTheme(): void {
    this.setTheme(!this.isDarkMode());
  }

  setTheme(dark: boolean): void {
    this.isDarkMode.set(dark);
    localStorage.setItem('tedbus-theme', dark ? 'dark' : 'light');
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark');
    }
  }
}
