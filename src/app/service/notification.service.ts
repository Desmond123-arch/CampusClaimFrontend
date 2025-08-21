// src/app/service/notification.service.ts

import { Injectable } from '@angular/core';
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
  ) { }

  public initPush() {
    // Only initialize on a real device
    if (!this.platform.is('hybrid')) {
      return;
    }
    this.registerPush();
  }

  private registerPush() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some notice to the user
        console.warn('Push notification permission not granted.');
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      // TODO: Send the token to your backend to store it
    });

    // Some error occurred
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push received: ' + JSON.stringify(notification));
    });

    // THIS IS THE KEY PART: Method called when user taps on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      const data = notification.notification.data;
      console.log('Push action performed: ' + JSON.stringify(notification));
      if (data.item_id) {
        // We have an item_id, let's open it.
        this.openItemFromNotification(data.item_id);
      }
    });
  }

  // New method to fetch and open the item
  async openItemFromNotification(itemId: string) {
    this.itemsService.getItemById(itemId).subscribe({
      next: async (item) => {
        const modal = await this.modalController.create({
          component: ItemDetailModalComponent,
          componentProps: {
            item: item
          },
          breakpoints: [0, 0.5, 0.8],
          initialBreakpoint: 1.2,
        });
        await modal.present();
      },
      error: async (err) => {
        console.error('Failed to fetch item details from notification:', err);
        await presentToast(this.toastController, "Could not open the item.", 'danger', 2000);
      }
    });
  }
}