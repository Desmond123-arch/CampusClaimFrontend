import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { ItemImagesComponent } from "src/app/components/item-images/item-images.component";
import { SearchBarComponent } from "src/app/components/search-bar/search-bar.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    ItemImagesComponent,
    SearchBarComponent
],
  declarations: [SearchPage],
})
export class SearchPageModule {}
