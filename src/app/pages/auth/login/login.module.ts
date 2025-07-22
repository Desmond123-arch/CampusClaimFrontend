import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { PageHeaderComponent } from "src/app/components/page-header/page-header.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    PageHeaderComponent,
    ReactiveFormsModule,
],
  declarations: [LoginPage],
  exports: [LoginPage]
})
export class LoginPageModule {}
