// src/app/component/navbar/navbar.ts
import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService, ThemePreference } from '../../service/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit, AfterViewInit {
  public isloggedIn = false;
  public user: { name?: string; picture?: string; email?: string } | null = null;
  public showMobileMenu = false;

  constructor(
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    public router: Router,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    const stored = sessionStorage.getItem('Loggedinuser');
    if (stored) {
      try {
        this.user = JSON.parse(stored);
        this.isloggedIn = true;
      } catch {
        sessionStorage.removeItem('Loggedinuser');
        this.user = null;
        this.isloggedIn = false;
      }
    } else {
      // Demo fallback user if needed for testing profile
      this.user = null;
      this.isloggedIn = false;
    }
  }

  ngAfterViewInit(): void {
    this.loadGoogleScript()
      .then(() => {
        try {
          const google = (window as any).google;
          if (!google || !google.accounts) return;

          google.accounts.id.initialize({
            client_id: '381733711473-4h9t4u8852ekot3pr3ucekjha6u6gb73.apps.googleusercontent.com',
            callback: (response: any) => {
              this.ngZone.run(() => this.handleCredentialResponse(response));
            }
          });

          this.renderGoogleButton();
        } catch (err) {
          console.error('Google init/render error', err);
        }
      })
      .catch(err => {
        console.error('Failed to load Google Identity script:', err);
      });
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google && (window as any).google.accounts) return resolve();

      const existing = document.getElementById('gsi-client');
      if (existing) {
        let waited = 0;
        const t = setInterval(() => {
          if ((window as any).google && (window as any).google.accounts) {
            clearInterval(t);
            resolve();
          } else {
            waited += 100;
            if (waited > 10000) {
              clearInterval(t);
              reject(new Error('Google script timeout'));
            }
          }
        }, 100);
        return;
      }

      const s = document.createElement('script');
      s.id = 'gsi-client';
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = () => {
        setTimeout(() => {
          if ((window as any).google && (window as any).google.accounts) return resolve();
          let waited = 0;
          const t2 = setInterval(() => {
            if ((window as any).google && (window as any).google.accounts) {
              clearInterval(t2);
              resolve();
            } else {
              waited += 100;
              if (waited > 5000) {
                clearInterval(t2);
                reject(new Error('Google accounts SDK missing'));
              }
            }
          }, 100);
        }, 50);
      };
      s.onerror = (e) => reject(new Error('Failed to load Google Identity script'));
      document.head.appendChild(s);
    });
  }

  public renderGoogleButton(): void {
    try {
      const google = (window as any).google;
      if (!google || !google.accounts) return;

      const btn = document.getElementById('google-btn') || document.getElementById('googleButton');
      if (!btn) return;

      google.accounts.id.renderButton(btn, {
        theme: this.themeService.isDarkMode() ? 'filled_black' : 'outline',
        size: 'medium',
        shape: 'pill',
        width: 150
      });
    } catch (err) {
      console.error('Error rendering google button:', err);
    }
  }

  private handleCredentialResponse(response: any): void {
    try {
      const credential = response?.credential;
      if (!credential) return;

      const payload = this.decodeJwt(credential) || {};
      const sessionObj = {
        name: payload?.name || 'User',
        picture: payload?.picture || '',
        email: payload?.email || '',
        sub: payload?.sub || ''
      };

      sessionStorage.setItem('Loggedinuser', JSON.stringify(sessionObj));
      this.user = { name: sessionObj.name, picture: sessionObj.picture, email: sessionObj.email };
      this.isloggedIn = true;
      this.cdRef.detectChanges();
    } catch (err) {
      console.error('Error handling credential response:', err);
    }
  }

  private decodeJwt(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(decoded)));
    } catch {
      return null;
    }
  }

  public signOut(): void {
    sessionStorage.removeItem('Loggedinuser');
    this.isloggedIn = false;
    this.user = null;
    this.cdRef.detectChanges();

    const google = (window as any).google;
    if (google && google.accounts && google.accounts.id) {
      try {
        google.accounts.id.disableAutoSelect();
      } catch { }
    }

    setTimeout(() => {
      this.renderGoogleButton();
    }, 100);
  }

  public setSpecificTheme(pref: ThemePreference): void {
    this.themeService.setPreference(pref);
    setTimeout(() => this.renderGoogleButton(), 100);
  }

  public toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  public navigate(path: string): void {
    this.router.navigate([path]);
    this.showMobileMenu = false;
  }
}
