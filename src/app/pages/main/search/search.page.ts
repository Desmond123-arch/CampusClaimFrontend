import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ItemDetailModalComponent } from 'src/app/components/item-detail-modal/item-detail-modal.component';
import { SearchService } from 'src/app/service/search.service';
import { ImageSearchResult, Item } from 'src/types/item';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage implements OnInit {

  items: ImageSearchResult[] = [];

  private subscription: Subscription = new Subscription()

  constructor(
    private searchService: SearchService,
    private modalController: ModalController,
  ) {

  }

  async ngOnInit() {
    const storedResults = await this.searchService.getStoredSearchResults();
    if (storedResults) {
      this.setItems(storedResults);
    }
    this.subscription.add(
      this.searchService.searchResults$.subscribe(results => {
        if (results) {
          this.setItems(results);
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setItems(items: any) {
    this.items = items.result.results;
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
