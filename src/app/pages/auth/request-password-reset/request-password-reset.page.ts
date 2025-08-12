import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/service/user.service';
import { presentToast } from 'src/app/utils/toast';
import { UmatEmailValidator, passwordStrengthValidator } from 'src/app/validators/registration';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.page.html',
  styleUrls: ['./request-password-reset.page.scss'],
  standalone: false,
})
export class RequestPasswordResetPage implements OnInit {
  myForm: FormGroup = new FormGroup({})
  showPassword = false;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, UmatEmailValidator()]],
    })
  }
  async requestReset(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent'
    });
    await loading.present();

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    const { email } = this.myForm.value;
    this.userService.requestResetPassword(email).subscribe({
      next: response => {
        this.router.navigateByUrl('/auth/reset-password');
        this.loadingCtrl.dismiss()

      },
      error: error => {
        console.log(error);
        this.loadingCtrl.dismiss()
      }
    })
    presentToast(this.toastCtrl, "A reset token has been sent to your email", "success", 2000)
  }
}
