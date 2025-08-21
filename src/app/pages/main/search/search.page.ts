import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { firstValueFrom, Subscription } from 'rxjs';
import { ItemDetailModalComponent } from 'src/app/components/item-detail-modal/item-detail-modal.component';
import { ItemsService } from 'src/app/service/items.service';
import { SearchService } from 'src/app/service/search.service';
import { presentToast } from 'src/app/utils/toast';
import { ImageSearchResult, Item } from 'src/types/item';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage implements OnInit {

  items: ImageSearchResult[] = [];
  isLoading: boolean = false;
  searchAttempted: boolean = false;

  private subscription: Subscription = new Subscription()

  constructor(
    private searchService: SearchService,
    private modalController: ModalController,
    private itemService: ItemsService,
    private toastController: ToastController,
    private zone: NgZone
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
    this.isLoading = false; 
  }

  handleSearchStart() {
    this.isLoading = true;
    this.searchAttempted = true; 
    this.items = [];
  }

  async showItemDetailModalById(itemId: string): Promise<void> {

    this.zone.run(async () => {
      try {

        const response = await firstValueFrom(this.itemService.getItemById(itemId));
        console.log('Received item data from API:', response);
  
        const itemToShow = response?.item;
        if (!itemToShow) {
          throw new Error('Item data is missing in the API response.');
        }
  
        const modal = await this.modalController.create({
          component: ItemDetailModalComponent,
          componentProps: {
            item: itemToShow
          },
          breakpoints: [0, 0.5, 0.8],
          initialBreakpoint: 1.2,
        });
  
        await modal.present();
  
      } catch (err) {
        console.error('Failed to show item from notification:', err);
        await presentToast(this.toastController, "Could not open the item.", 'danger', 2000);
      }
    });
  }
}
