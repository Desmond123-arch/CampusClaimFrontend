import { Component, DOCUMENT, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from 'src/app/service/theme.service';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { ionSunnyOutline, ionMoonOutline } from '@ng-icons/ionicons';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports: [IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule, NgIcon],
  viewProviders: [provideIcons({ ionSunnyOutline, ionMoonOutline })]
})
export class PageHeaderComponent implements OnInit {

  isDark = false;
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private themeSubscription: Subscription = new Subscription();
  constructor(public theme: ThemeService) {
  }

  ngOnInit() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      this.theme.enableDark();
    } else if (storedTheme === 'light') {
      this.theme.enableLight();
    } else {
      this.mediaQuery.addEventListener('change', (event) => {
        if (!localStorage.getItem('theme')) {
          if (event.matches) {
            this.theme.enableDark();
          } else {
            this.theme.enableLight();
          }
        }
      });
    }
    this.themeSubscription = this.theme.isDark$.subscribe(isDark => {
      this.isDark = isDark;
    });
    this.mediaQuery.addEventListener('change', (event) => {
      if (!localStorage.getItem('theme')) {
        if (event.matches) {
          this.theme.enableDark();
        } else {
          this.theme.enableLight();
        }
      }
    });
  }
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  changeTheme() {
    if (this.isDark) {
      this.theme.enableLight();
    } else {
      this.theme.enableDark();
    }
  }
}
