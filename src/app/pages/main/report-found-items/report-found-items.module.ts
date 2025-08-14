import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportFoundItemsPageRoutingModule } from './report-found-items-routing.module';

import { ReportFoundItemsPage } from './report-found-items.page';
import { FoundItemFormComponent } from "src/app/components/found-item-form/found-item-form.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportFoundItemsPageRoutingModule,
    FoundItemFormComponent
],
  declarations: [ReportFoundItemsPage],
})
export class ReportFoundItemsPageModule {}
