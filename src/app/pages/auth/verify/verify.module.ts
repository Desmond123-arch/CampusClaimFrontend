import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyPageRoutingModule } from './verify-routing.module';

import { VerifyPage } from './verify.page';
import { PageHeaderComponent } from "src/app/components/page-header/page-header.component";
import {ionChevronBackSharp} from '@ng-icons/ionicons'
import { provideIcons, NgIcon } from '@ng-icons/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyPageRoutingModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    NgIcon
],
  declarations: [VerifyPage],
  exports: [VerifyPage],
  providers: [
    provideIcons({ionChevronBackSharp})
  ]
})
export class VerifyPageModule {}
