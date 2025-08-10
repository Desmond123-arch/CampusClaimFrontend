import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ModalController, ToastController } from '@ionic/angular';
import { ItemDetailModalComponent } from 'src/app/components/item-detail-modal/item-detail-modal.component';
import { ItemsService } from 'src/app/service/items.service';
import { presentToast } from 'src/app/utils/toast';
import { Item } from 'src/types/item';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  Lostitems: Item[] = [];
  FoundItems: Item[] = [];
  name: any = ""

  async getName(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'name' });
    return value;
  }
  isLoading: any = true;
  constructor(private modalController: ModalController, private router: Router, private itemService: ItemsService, private toastController: ToastController) { }

  async ngOnInit() {
    this.getLostItems();
    this.getFountItems()
    this.name = await this.getName()
  }

  async openItemDetail(item: Item, event: MouseEvent) {
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

  async navigateToFound(status: string) {
    this.router.navigate(['/main/items'], { queryParams: { status: status.toLowerCase() } });
  }

  async getLostItems() {
    let params = new HttpParams();
    params = params.append('limit', '10');
    params = params.append('status', 'Lost');

    this.itemService.getAllItems(params).subscribe({
      next: (response: any) => {
        console.log(response)
        this.Lostitems = response.data.rows;
        this.isLoading = false;
      },
      error: async (response: any) => {
        await presentToast(this.toastController, "Error while fetching items, please try again", 'primary', 1500);
        console.log(response)
      }
    })
  }

  async getFountItems() {
    let params = new HttpParams();
    params = params.append('limit', '10');
    params = params.append('status', 'Found');

    this.itemService.getAllItems(params).subscribe({
      next: (response: any) => {
        console.log(response)
        this.FoundItems = response.data.rows;
        this.isLoading = false;
      },
      error: async (response: any) => {
        await presentToast(this.toastController, "Error while fetching items, please try again", 'primary', 1500);
        console.log(response)
      }
    })
  }
}
