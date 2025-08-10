import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Item } from 'src/types/item';
import { ItemDetailModalComponent } from '../item-detail-modal/item-detail-modal.component';
import { SuccesfulClaimComponent } from '../succesful-claim/succesful-claim.component';
import { ClaimFormComponent } from '../claim-form/claim-form.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  imports: [CommonModule, IonicModule],
  standalone: true
})

export class ItemCardComponent implements OnInit, OnDestroy {
  @Input()
  item!: Item;

  constructor(private modalController: ModalController,private router: Router) { }

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

  async handleClaim(event: Event) {
    event.stopPropagation();

    const modal = await this.modalController.create({
      component: ClaimFormComponent,
      componentProps: {
        item: this.item
      }
    })
    await modal.present()

    const { data, role } = await modal.onWillDismiss();

    if (role === 'claim-submitted') {
      const successModal = await this.modalController.create({
        component: SuccesfulClaimComponent,
        backdropDismiss: false,
         cssClass: 'success-modal'
      });
      await successModal.present();

      await successModal.onDidDismiss();
      this.router.navigateByUrl("/main/home");
    } else if (role === 'claim-cancelled') {
      console.log('Claim was cancelled');
    }
  }

  handleClaimCancel() {
    this.modalController.dismiss()
  }
}
