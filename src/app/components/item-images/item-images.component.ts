import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/types/item';
import { IonContent, IonCard } from "@ionic/angular/standalone";

@Component({
  selector: 'app-item-images',
  templateUrl: './item-images.component.html',
  styleUrls: ['./item-images.component.scss'],
  standalone: true,
  imports: [],
})
export class ItemImagesComponent  implements OnInit {

  @Input()
  item!: any;
  constructor() { 
    
  }

  ngOnInit() {
    console.log(this.item)
  }

}
