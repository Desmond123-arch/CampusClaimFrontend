import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private router: Router,private userService: UserService) { }

  initPush() {
    if (Capacitor.isNativePlatform()) {
      this.registerPush()
      this.addListeners()
    }
  }

  private async registerPush() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }
  addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
      this.userService.sendDeviceToken(token.value).subscribe({
        next: (response) => {
          // console.log(response)
        },
        error: (err) => {
          // console.log(err);
        }
      })
      console.info('Registration token: ', token.value);
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      // console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      // console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  }

  getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
  }
}

