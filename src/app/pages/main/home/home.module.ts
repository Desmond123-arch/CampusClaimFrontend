import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from "src/app/explore-container/explore-container.module";
import { ItemCardSkeletonComponent } from "src/app/components/item-card-skeleton/item-card-skeleton.component";
import { ItemCardComponent } from 'src/app/components/item-card/item-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SearchBarComponent } from 'src/app/components/search-bar/search-bar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ExploreContainerComponentModule,
    ItemCardSkeletonComponent,
    ItemCardComponent,
    SearchBarComponent
],
  declarations: [HomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
