import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Item } from 'src/types/item'; // Your existing Item type

import { ItemDetailModalComponent } from 'src/app/components/item-detail-modal/item-detail-modal.component';
import { ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { presentToast } from 'src/app/utils/toast';
import { ItemsService } from 'src/app/service/items.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-items-grid',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
  standalone: false
})
export class ItemPage implements OnInit {
  items: Item[] = [];
  isLoading = true;
  itemStatus: string | undefined | null = "Lost";
  private routeSubscription?: Subscription;
  constructor(private modalController: ModalController, private activeRoute: ActivatedRoute, private router: Router, private toastController: ToastController, private itemService: ItemsService) {
    this.itemStatus = this.activeRoute.snapshot.queryParamMap.get('status');
  }

  ngOnInit() {
    this.routeSubscription = this.activeRoute.queryParamMap.subscribe(params => {
      const status = params.get('status');
      this.handleStatusChange(status);
    });
  }

  async openItemDetail(item: Item) {
    const modal = await this.modalController.create({
      component: ItemDetailModalComponent,
      componentProps: {
        item: item
      },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 1.2,
    })
    await modal.present();
  }
  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private handleStatusChange(status: string | null) {
    console.log('Status changed to:', status);
    if (status === null || (status?.toLowerCase() !== "found" && status?.toLowerCase() !== "lost")) {
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { status: 'lost' },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
      this.itemStatus = "Lost";
    } else {
      this.itemStatus = status[0].toUpperCase() + status.slice(1).toLowerCase();
    }
    this.getItems(this.itemStatus);
  }

  async getItems(status: string) {
    this.isLoading = true;
        const params = new HttpParams().set('status', status);
    this.itemService.getAllItems(params).subscribe({
      next: (response: any) => {
        console.log(response)
        this.items = response.data.rows;
        this.isLoading = false;
      },
      error: async (response: any) => {
        await presentToast(this.toastController, "Error while fetching items, please try again", 'primary', 1500);
        console.log(response)
        this.isLoading = false;
      }
    })
  }
}