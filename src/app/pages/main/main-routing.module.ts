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
        path: 'items',
        loadChildren: () => import('./item/item.module').then(m => m.ItemPageModule)
      },
      {
        path: 'report',
        loadChildren: () => import('./report-found-items/report-found-items.module').then(m => m.ReportFoundItemsPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
      },
    ],
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class MainRoutingModule { }