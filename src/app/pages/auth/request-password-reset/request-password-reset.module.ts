import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestPasswordResetPageRoutingModule } from './request-password-reset-routing.module';

import { RequestPasswordResetPage } from './request-password-reset.page';
import { PageHeaderComponent } from "src/app/components/page-header/page-header.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestPasswordResetPageRoutingModule,
    PageHeaderComponent,
    ReactiveFormsModule
],
  declarations: [RequestPasswordResetPage],
  exports: [RequestPasswordResetPage]
})
export class RequestPasswordResetPageModule {}
