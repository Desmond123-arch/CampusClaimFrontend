import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Item } from 'src/types/item';

@Component({
  selector: 'app-item-detail-modal',
  templateUrl: './item-detail-modal.component.html',
  styleUrls: ['./item-detail-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItemDetailModalComponent  implements OnInit {

  @Input() item!: Item;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    console.log('Modal opened for ', this.item);
  }

  dismiss() {
    this.modalCtrl.dismiss()
  }
}
