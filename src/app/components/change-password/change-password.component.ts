import { Component, ViewChild } from '@angular/core';
import { NgForm, FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/service/user.service';
import { presentToast } from 'src/app/utils/toast';
import { CommonModule } from '@angular/common';
import { passwordsMatchValidator, passwordStrengthValidator } from 'src/app/validators/registration';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule]
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  @ViewChild('#password') input: any;

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private fb: FormBuilder,
  ) {
    this.changePasswordForm = fb.group({})
  }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.required,
      passwordStrengthValidator({
        minLength: 8,
        requireSpecialChar: true,
        requireDigit: true
      })
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: passwordsMatchValidator('newPassword', 'confirmPassword')
    });
    setTimeout(() => {
      this.input.setFocus();
    }, 150);
    Keyboard.show()
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async onSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    }

    // console.log(this.changePasswordForm.value)
    const { currentPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

    if (newPassword !== confirmPassword) {
      presentToast(this.toastController, 'Passwords do not match.', 'danger', 2000);
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Changing password...',
      spinner: 'crescent'
    });
    await loading.present();

    // try {
    //   // Pass all passwords to the service
    //   await this.userService.changePassword(currentPassword, newPassword).toPromise();
    //   await loading.dismiss();
    //   presentToast(this.toastController, 'Password changed successfully!', 'success', 2000);
    //   this.dismiss();
    // } catch (error: any) {
    //   await loading.dismiss();
    //   const errorMessage = error?.error?.message || 'Failed to change password. Please try again.';
    //   presentToast(this.toastController, errorMessage, 'danger', 3000);
    // }
  }

}
