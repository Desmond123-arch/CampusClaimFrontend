import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { IonicModule, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/service/user.service';
import { presentToast } from 'src/app/utils/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class ChangePasswordComponent {

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = form.value;

    if (newPassword !== confirmPassword) {
      presentToast(this.toastController, 'Passwords do not match.', 'danger', 2000);
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Changing password...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Pass all passwords to the service
      await this.userService.changePassword(currentPassword, newPassword).toPromise();
      await loading.dismiss();
      presentToast(this.toastController, 'Password changed successfully!', 'success', 2000);
      this.dismiss();
    } catch (error: any) {
      await loading.dismiss();
      const errorMessage = error?.error?.message || 'Failed to change password. Please try again.';
      presentToast(this.toastController, errorMessage, 'danger', 3000);
    }
  }

}
