import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { ItemImagesComponent } from "src/app/components/item-images/item-images.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    ItemImagesComponent
],
  declarations: [SearchPage],
  exports: [SearchPage]
})
export class SearchPageModule {}
