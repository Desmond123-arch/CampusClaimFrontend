import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader } from "@ionic/angular/standalone";
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
  standalone: false,
})
export class SplashScreenPage implements OnInit {

  constructor(private router: Router, private platform: Platform) { }

  async ngOnInit() {
    const token = await Preferences.get({ key: 'auth-token' })
    if (token.value) {
      setTimeout(() => {
        this.router.navigateByUrl('/main/home', {replaceUrl: true})
      }, 3000)
    } else {
      setTimeout(() => {
        this.router.navigateByUrl('/auth/intro', {replaceUrl: true})
      }, 3000)
    }

    this.platform.backButton.subscribeWithPriority(9999, () => {

    })
  }

}
