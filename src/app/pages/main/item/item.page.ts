import { Component, OnInit } from '@angular/core';
import { Item } from 'src/types/item'; // Your existing Item type

import { ItemDetailModalComponent } from 'src/app/components/item-detail-modal/item-detail-modal.component';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-items-grid',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
  standalone: false
})
export class ItemPage implements OnInit {
  items: Item[] = [
    {
      "item_uuid": "67471d77-b643-4607-b883-f12e2f575cfa",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "LOST",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T16:08:20.595753Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/14-bag.png",
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/14-109918035.jpg"
      ],
      "found_at": "CB"
    },
    {
      "item_uuid": "5ce8d253-a411-489c-b21e-6320e1ca49e9",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "LOST",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T03:03:21.254102Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/13-109918035.jpg"
      ],
      "found_at": "FMMT"
    },
    {
      "item_uuid": "59eaad7f-2045-45c3-8bd8-3eb58904bad4",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "LOST",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T02:51:37.580537Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/12-109918035.jpg"
      ],
      "found_at": "FMMT"
    },
    {
      "item_uuid": "1eac998a-804e-42ac-aeae-45dfb0ca62e5",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "LOST",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T02:51:30.676Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/11-109918035.jpg"
      ],
      "found_at": "FMMT"
    },
    {
      "item_uuid": "14fb744c-cf05-4217-8389-255bb1a810d0",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "LOST",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T02:51:29.785882Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/10-109918035.jpg"
      ],
      "found_at": "FMMT"
    },
    {
      "item_uuid": "ee39a980-7cd1-45ee-96cf-7909c7d4dbc6",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "LOST",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T02:51:28.556975Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/9-109918035.jpg"
      ],
      "found_at": "FMMT"
    },
    {
      "item_uuid": "1e3a2f98-1f2a-47d9-8ad7-4945a3c8952d",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "LOST",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T02:51:27.036386Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/8-109918035.jpg"
      ],
      "found_at": "FMMT"
    },
    {
      "item_uuid": "a5b813ac-281b-4ecc-82ef-dde684353234",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "LOST",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T02:27:33.333388Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/7-109918035.jpg"
      ],
      "found_at": "FMMT"
    },
    {
      "item_uuid": "f9375231-4e37-4345-9672-49578bcf829c",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "LOST",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T02:27:31.945935Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/6-109918035.jpg"
      ],
      "found_at": "FMMT"
    },
    {
      "item_uuid": "8dd85654-a760-420e-abb9-bbe17d563f05",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "LOST",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T02:27:30.525506Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/5-109918035.jpg"
      ],
      "found_at": "FMMT"
    },
    {
      "item_uuid": "1b56890b-6cf9-4e9f-96d5-8f73dc262c02",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "LOST",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T02:27:26.685019Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/4-109918035.jpg"
      ],
      "found_at": "FMMT"
    },
    {
      "item_uuid": "258fff64-61b8-419a-98dc-bd4e82ddf783",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "FOUND",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T02:25:21.420209Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/3-109918035.jpg"
      ],
      "found_at": "FIMMS"
    },
    {
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
    },
    {
      "item_uuid": "c8b19402-fb68-40ad-b10b-006992da1531",
      "title": "White Backpack",
      "description": "Plane bag",
      "bounty": 50,
      "status": "LOST",
      "category": "Electronics",
      "posted_by": "Desmond",
      "created_at": "2025-07-27T00:56:52.992345Z",
      "image_urls": [
        "https://campusclaim.nyc3.digitaloceanspaces.com/items/1-109918035.jpg"
      ],
      "found_at": "FIMMS"
    }
  ];
  isLoading = false;
  itemStatus: string | undefined | null = "Lost";
  constructor(private modalController: ModalController, private activeRoute: ActivatedRoute, private router: Router) {
    this.itemStatus = this.activeRoute.snapshot.queryParamMap.get('status');
  }

  ngOnInit() {
    if (this.itemStatus === null || (this.itemStatus !== "found" && this.itemStatus !== "lost")) {
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { status: 'lost' },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });

      this.itemStatus = "Lost"
    } else {
      this.itemStatus = this.itemStatus![0].toUpperCase() + this.itemStatus!.slice(1).toLowerCase()
    }
  }

  async openItemDetail(item: Item) {
    const modal = await this.modalController.create({
      component: ItemDetailModalComponent,
      componentProps: {
        item: item,
      },
    });
    await modal.present();
  }
}