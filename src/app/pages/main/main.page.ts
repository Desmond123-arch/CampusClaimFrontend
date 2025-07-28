import { Component } from '@angular/core';
import {register} from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-tabs',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss'],
  standalone: false,
})
export class MainPage {

  constructor() {}

}
