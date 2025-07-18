import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroPageRoutingModule } from './intro-routing.module';

import { IntroPage } from './intro.page';
import { PageHeaderComponent } from "src/app/components/page-header/page-header.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntroPageRoutingModule,
    PageHeaderComponent
],
  declarations: [IntroPage],
  exports: [IntroPage]
})
export class IntroPageModule {}
