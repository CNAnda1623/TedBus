// src/app/component/navbar/navbar.ts
import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

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
  // Template uses "isloggedIn" (lowercase) — keep that name to avoid changing templates.
  public isloggedIn = false;
  public user: { name?: string; picture?: string; email?:string } | null = null;

  // Mobile menu state used by template bindings
  public showMobileMenu = false;

  constructor(
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  // ------------------------
  // Lifecycle
  // ------------------------
  ngOnInit(): void {
    // Preserve prior safe initialization logic
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
      this.user = null;
      this.isloggedIn = false;
    }
  }

  ngAfterViewInit(): void {
    // Load Google Identity script then initialize + render; defensive guards included.
    this.loadGoogleScript()
      .then(() => {
        try {
          const google = (window as any).google;
          if (!google || !google.accounts) {
            console.warn('Google Identity SDK loaded but google.accounts missing.');
            return;
          }

          google.accounts.id.initialize({
            client_id: '381733711473-1jv1mbdngoh41cgci17ukr37fg1j7us4.apps.googleusercontent.com', // TODO: replace
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

  // ------------------------
  // Google loader & render
  // ------------------------
  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google && (window as any).google.accounts) return resolve();

      const existing = document.getElementById('gsi-client');
      if (existing) {
        // poll until ready
        let waited = 0;
        const t = setInterval(() => {
          if ((window as any).google && (window as any).google.accounts) {
            clearInterval(t);
            resolve();
          } else {
            waited += 100;
            if (waited > 10000) {
              clearInterval(t);
              reject(new Error('Google script present but SDK did not initialize in time'));
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
        // small tick to allow global to appear
        setTimeout(() => {
          if ((window as any).google && (window as any).google.accounts) return resolve();

          // fallback poll
          let waited = 0;
          const t2 = setInterval(() => {
            if ((window as any).google && (window as any).google.accounts) {
              clearInterval(t2);
              resolve();
            } else {
              waited += 100;
              if (waited > 5000) {
                clearInterval(t2);
                reject(new Error('Google script loaded but google.accounts never appeared.'));
              }
            }
          }, 100);
        }, 50);
      };
      s.onerror = (e) => reject(new Error('Failed to load Google Identity script'));
      document.head.appendChild(s);
    });
  }

  private renderGoogleButton(): void {
    try {
      const google = (window as any).google;
      if (!google || !google.accounts) {
        console.warn('Google SDK not available for rendering button.');
        return;
      }

      const btn = document.getElementById('google-btn') || document.getElementById('googleButton');
      if (!btn) {
        console.warn('Google button container not found (#google-btn or #googleButton).');
        return;
      }

      google.accounts.id.renderButton(btn, {
        theme: 'outline',
        size: 'medium', // corrected typo from 'meduim'
        shape: 'pill',
        width: 150
      });
    } catch (err) {
      console.error('Error rendering google button:', err);
    }
  }

  // ------------------------
  // Credential handling (Google)
  // ------------------------
  private handleCredentialResponse(response: any): void {
    try {
      const credential = response?.credential;
      if (!credential) {
        console.warn('No credential from Google response.');
        return;
      }

      const payload = this.decodeJwt(credential) || {};

      const sessionObj = {
        name: payload?.name || '',
        picture: payload?.picture || '',
        email: payload?.email || '',
        sub: payload?.sub || ''
      };

      sessionStorage.setItem('Loggedinuser', JSON.stringify(sessionObj));
      this.user = { name: sessionObj.name, picture: sessionObj.picture, email: sessionObj.email };
      this.isloggedIn = true;
      this.cdRef.detectChanges();

      // TODO: Exchange token with backend to create/verify server session if needed.
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

  // ------------------------
  // Sign-out
  // ------------------------
  public handlelogout(): void {
    // Keep previous server sign-out logic if you had any — this is a client-side clear.
    try {
      // If you had a backend logout endpoint, call it here.
      this.signOut();
    } catch (err) {
      console.error('Logout error', err);
    }
  }

  public signOut(): void {
    try {
      sessionStorage.removeItem('Loggedinuser');
      this.isloggedIn = false;
      this.user = null;
      this.cdRef.detectChanges();

      const google = (window as any).google;
      if (google && google.accounts && google.accounts.id) {
        try {
          google.accounts.id.disableAutoSelect();
        } catch {
          // ignore
        }
      }

      // TODO: call server logout endpoint if necessary.
    } catch (err) {
      console.error('Error during sign out', err);
    }
  }

  // ------------------------
  // Template helper methods (missing earlier)
  // ------------------------
  public toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  public openHelpChatbot(): void {
    // TODO: open your chatbot UI. Right now we just log and could route / open a modal.
    console.log('openHelpChatbot clicked');
    // Example: this.router.navigate(['/help-chat']);
  }

  public navigate(path: string): void {
    try {
      this.router.navigate([path]);
    } catch (err) {
      console.error('Navigation error to', path, err);
    }
  }
}
