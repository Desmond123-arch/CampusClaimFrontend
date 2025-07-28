import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Item } from 'src/types/item';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  imports: [CommonModule, IonicModule],
  standalone: true
})
export class ItemCardComponent  implements OnInit, OnDestroy {

  @Input()
  item!: Item;

  constructor() { }

  currentImageIndex = 0;
  private imageInterval!: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.startImageRotation();
  }

  startImageRotation() {
    if (!this.item?.image_urls?.length) return;

    this.imageInterval = setInterval(() => {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.item.image_urls.length;
    }, 5000);
  }

  ngOnDestroy() {
    if (this.imageInterval) {
      clearInterval(this.imageInterval);
    }
  }
}
