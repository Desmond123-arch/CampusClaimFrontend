import { Component, Renderer2 } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { ThemeService } from './service/theme.service';
import { GoogleSSOService } from './service/google-sso.service';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor(private platform: Platform,
    private renderer: Renderer2,
    private router: Router,
    private themeService: ThemeService,
    private notificationService: NotificationService,
    private googleService: GoogleSSOService
  ) {
    this.initializeApp();
    if (this.platform.is('hybrid')) {
      this.platform.ready().then(() => {
        this.notificationService.initPush();

        Keyboard.setResizeMode({ mode: KeyboardResize.Native });
      });
    }
    const currentMode = localStorage.getItem('theme');
    if (currentMode == 'light') {
      themeService.enableLight();
    } else {
      themeService.enableDark();
    }

  }

  async initializeApp() {
    await SafeArea.removeAllListeners();
    this.googleService.initializeLogin();
    await SafeArea.addListener('safeAreaChanged', data => {
      const { insets } = data;
      for (const [key, value] of Object.entries(insets)) {
        document.documentElement.style.setProperty(
          `--safe-area-inset-${key}`,
          `${value}px`,
        );
      }
    })

    App.addListener('appUrlOpen', data => {
      try {
        const url = new URL(data.url);
        const token = url.searchParams.get('token');
        if (token) {
          this.router.navigate(['/auth/reset-password'], { queryParams: { token } });
        } else {
          console.error("No token found");
        }

      } catch (err) {
        console.error('Invalid URL', err);
      }
    })
  }
}