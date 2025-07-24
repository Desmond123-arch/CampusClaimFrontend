import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from 'src/app/service/theme.service';
import { provideIcons, NgIcon } from '@ng-icons/core';
import {ionSunnyOutline, ionMoonOutline} from '@ng-icons/ionicons';
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports: [IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule, NgIcon],
    viewProviders:[provideIcons({ionSunnyOutline, ionMoonOutline})]
})
export class PageHeaderComponent implements OnInit {

  isDark = false;
  constructor(public theme: ThemeService) { }

  ngOnInit() { }

  changeTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      this.theme.enableDark()
    } else {
      this.theme.enableLight()
    }

  }
}
