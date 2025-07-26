import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  imports: [CommonModule, IonicModule],
  standalone: true
})
export class ItemCardComponent  implements OnInit {

  @Input() item: any;
  constructor() { }

  ngOnInit() {}

}
