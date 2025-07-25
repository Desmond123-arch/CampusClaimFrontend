import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MainRoutingModule } from './main-routing.module';
import { MainPage } from './main.page';



@NgModule({
  declarations: [MainPage],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    MainRoutingModule
  ],
})
export class MainModule { }
