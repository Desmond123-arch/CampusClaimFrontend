import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPage } from './main.page';

const routes: Routes = [

  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: '',
        redirectTo: '/main/home',
        pathMatch: 'full'
      },
      {
        path: 'items',
        loadChildren: () => import('./item/item.module').then(m => m.ItemPageModule)
      },
      {
        path: 'report',
        loadChildren: () => import('./report-found-items/report-found-items.module').then( m => m.ReportFoundItemsPageModule)
      },
    ],
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class MainRoutingModule { }