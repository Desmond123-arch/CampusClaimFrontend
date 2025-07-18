import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { PageHeaderComponent } from "src/app/components/page-header/page-header.component";
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import {ionLogoGoogle} from '@ng-icons/ionicons'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    PageHeaderComponent,
    NgIconsModule
],
  declarations: [RegisterPage],
  exports: [RegisterPage],
  providers: [
    provideIcons({ ionLogoGoogle }) // 👈 Register icons here
  ]
})
export class RegisterPageModule {}
