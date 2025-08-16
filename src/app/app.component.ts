import { Component, Renderer2 } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor(private platform: Platform, private renderer: Renderer2, private router: Router) {
    this.initializeApp();
    this.platform.ready().then(() => {
      Keyboard.setResizeMode({ mode: KeyboardResize.Native});
    });
  }


  async initializeApp() {
    await SafeArea.removeAllListeners();

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
          console.log(token);
          this.router.navigate(['/auth/reset-password'], { queryParams: { token } });
        } else {
          console.log("No token found");
        }

      } catch (err) {
        console.error('Invalid URL', err);
      }
    })
  }
}