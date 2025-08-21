// src/app/service/notification.service.ts

import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
} from '@capacitor/push-notifications';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { ItemDetailModalComponent } from '../components/item-detail-modal/item-detail-modal.component';
import { ItemsService } from './items.service';
import { presentToast } from '../utils/toast';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private router: Router,
    private platform: Platform,
    private itemsService: ItemsService,
    private modalController: ModalController,
    private toastController: ToastController,
    private zone: NgZone
  ) { }

  public initPush() {
    if (!this.platform.is('hybrid')) {
      return;
    }
    this.registerPush();
  }

  private registerPush() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.warn('Push notification permission not granted.');
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      // TODO: Send the token to your backend to store it
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push received: ' + JSON.stringify(notification));
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      const data = notification.notification.data;
      console.log('Push action performed: ' + data);
      if (data.item_id) {

        this.openItemFromNotification(data.item_id);
      }
    });
  }

  async openItemFromNotification(itemId: string) {
    this.itemsService.getItemById(itemId).subscribe({
      next: (response) => {

        console.log('Received item data from API:', response);

        this.zone.run(async () => {
          const item = response;
          const modal = await this.modalController.create({
            component: ItemDetailModalComponent,
            componentProps: {
              item: item.item
            },
            breakpoints: [0, 0.5, 0.8],
            initialBreakpoint: 1.2,
          });
          await modal.present();
        });
      },
      error: async (err) => {
        this.zone.run(async () => {
          console.error('Failed to fetch item details from notification:', err);
          await presentToast(this.toastController, "Could not open the item.", 'danger', 2000);
        });
      }
    });
  }
}