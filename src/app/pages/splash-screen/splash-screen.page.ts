import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
  standalone: false,
})
export class SplashScreenPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('/auth/intro', {replaceUrl: true})
    }, 3000)
  }

}
