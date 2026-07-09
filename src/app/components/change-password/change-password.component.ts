import { Component, ViewChild } from '@angular/core';
import { NgForm, FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController, LoadingController, ToastController, Platform } from '@ionic/angular';
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
  showPassword = {
    old: false,
    new: false,
    confirm: false,
  }
  @ViewChild('#password') input: any;

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private fb: FormBuilder,
    private platform: Platform
  ) {
    this.changePasswordForm = fb.group({})
  }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
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
      if (this.platform.is('hybrid')) {
        if (this.input) {
          this.input.setFocus();
        }
        Keyboard.show();
      }
    }, 150);
  }

  dismiss() {
    this.modalController.dismiss();

    if (this.platform.is('hybrid')) {
      Keyboard.hide()
    }
  }

  async onSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    }
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

    this.userService.changePassword(currentPassword, newPassword).subscribe(
      {
        next: (async response => {
          await loading.dismiss();
          presentToast(this.toastController, 'Password changed successfully!', 'success', 2000);
          this.dismiss();
        }),
        error: (async error => {
          presentToast(this.toastController, error.error.errors, 'danger', 2000);
          await loading.dismiss()
        })
      }
    )
  }

  ChangeShowPassword(field: "old" | "new" | "confirm") {
    this.showPassword[field] = !this.showPassword[field]
  }

}
