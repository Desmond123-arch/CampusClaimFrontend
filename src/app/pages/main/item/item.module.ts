import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicSlides } from '@ionic/angular';

import { ItemPageRoutingModule } from './item-routing.module';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ItemPage } from './item.page';
import { ItemCardComponent } from 'src/app/components/item-card/item-card.component';
import { ItemCardSkeletonComponent } from 'src/app/components/item-card-skeleton/item-card-skeleton.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemPageRoutingModule,
    ItemCardComponent,
    ItemCardSkeletonComponent
  ],
  declarations: [ItemPage],
  exports: [ItemPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItemPageModule {}
