import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ItemDetailModalComponent } from 'src/app/components/item-detail-modal/item-detail-modal.component';
import { ImageSearchResult, Item } from 'src/types/item';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage implements OnInit {

  results: ImageSearchResult = {
    items: [
      {
        "description": "Plane bag",
        "image_url": "https://campusclaim.nyc3.digitaloceanspaces.com/items/14-bag.png",
        "item_id": "67471d77-b643-4607-b883-f12e2f575cfa",
        "score": 0.8792431354522705
      },
      {
        "description": "Plane bag",
        "image_url": "https://campusclaim.nyc3.digitaloceanspaces.com/items/14-bag.png",
        "item_id": "67471d77-b643-4607-b883-f12e2f575cfa",
        "score": 0.8792431354522705
      },
      {
        "description": "Plane bag",
        "image_url": "https://campusclaim.nyc3.digitaloceanspaces.com/items/14-bag.png",
        "item_id": "67471d77-b643-4607-b883-f12e2f575cfa",
        "score": 0.8792431354522705
      },
      {
        "description": "Plane bag",
        "image_url": "https://campusclaim.nyc3.digitaloceanspaces.com/items/14-bag.png",
        "item_id": "67471d77-b643-4607-b883-f12e2f575cfa",
        "score": 0.8792431354522705
      },
      {
        "description": "Plane bag",
        "image_url": "https://campusclaim.nyc3.digitaloceanspaces.com/items/2-109918035.jpg",
        "item_id": "67471d77-b643-4607-b883-f12e2f575cfa",
        "score": 0.8792431354522705
      }
    ],
    "total_items_in_index": 8,
  }
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  getItem(id: string): Item {
    const item: Item = {
      "item_uuid": "5fa8e1d7-9d93-4d51-88d0-b83ad02db64a",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "FOUND",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T02:19:39.425721Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/2-109918035.jpg"
      ],
      "found_at": "FIMMS"
    } //get item here

    return item;
  }

  async openItemDetail(id: string, event: MouseEvent) {
    const item = await this.getItem(id);
    const target = event.target as HTMLElement;
    const modal = await this.modalController.create({
      component: ItemDetailModalComponent,
      componentProps: {
        item: item
      },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 1.2,
    })
    if (target.closest('.no-bubble')) {
      return;
    }
    await modal.present();
  }
}
