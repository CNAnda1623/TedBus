import { Injectable, signal } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  currentPreference = signal<ThemePreference>('system');
  isDarkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
    this.listenToSystemChanges();
  }

  private initTheme(): void {
    const saved = (localStorage.getItem('tedbus-theme') as ThemePreference) || 'system';
    this.setPreference(saved);
  }

  private listenToSystemChanges(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (this.currentPreference() === 'system') {
          this.applyTheme(e.matches);
        }
      });
    }
  }

  setPreference(preference: ThemePreference): void {
    this.currentPreference.set(preference);
    localStorage.setItem('tedbus-theme', preference);

    let activeDark = false;
    if (preference === 'dark') {
      activeDark = true;
    } else if (preference === 'light') {
      activeDark = false;
    } else {
      activeDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.applyTheme(activeDark);
  }

  toggleTheme(): void {
    const current = this.isDarkMode();
    this.setPreference(current ? 'light' : 'dark');
  }

  private applyTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }
}
