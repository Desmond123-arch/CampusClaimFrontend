import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportFoundItemsPage } from './report-found-items.page';

const routes: Routes = [
  {
    path: '',
    component: ReportFoundItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,],
})
export class ReportFoundItemsPageRoutingModule {}
