import { Component, Renderer2 } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SafeArea } from 'capacitor-plugin-safe-area';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor(private platform: Platform, private renderer: Renderer2) {
    this.initializeApp()
  }

  async initializeApp() {
    SafeArea.getSafeAreaInsets().then(({ insets }) => {
      console.log(insets);
    });

    SafeArea.getStatusBarHeight().then(({ statusBarHeight }) => {
      console.log(statusBarHeight, 'statusbarHeight');
    });
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
  }
}