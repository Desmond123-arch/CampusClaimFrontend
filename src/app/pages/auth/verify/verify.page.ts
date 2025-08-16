import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';
import { closeLoading, showLoading } from 'src/app/utils/loading';
import { closeAllToasts, presentToast } from 'src/app/utils/toast';
import { otpRequiredLength } from 'src/app/validators/otp';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
  standalone: false
})


export class VerifyPage implements OnInit {
  otpForms: FormGroup = new FormGroup({});
  isSubmitted = false;
  constructor(private router: Router, private loadingCtrl: LoadingController, private ngZone: NgZone, private authService: AuthService, private toastController: ToastController) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        closeAllToasts(this.toastController);
      }
    });
  }

  ngOnInit() {
    this.markFormGroupTouched(this.otpForms);
    this.otpForms = new FormGroup({
      otp: new FormControl('', [
        Validators.required,
        otpRequiredLength(4)
      ])
    })
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  async resendVerification() {
    await showLoading(this.loadingCtrl)
    this.authService.resendOtp().subscribe({
      next: async (response) => {
        await closeLoading(this.loadingCtrl);
        await presentToast(this.toastController, "A new verification code has been sent", 'success', 2000)
      },
      error: async (error) => {
        console.log("There was an error", error);
        await closeLoading(this.loadingCtrl);
        const errorMsg = error?.error?.errors || "Try again later";
        await presentToast(this.toastController, errorMsg, 'danger', 2000)
      }
    })
  }



  async verifyOTP() {
    if (!this.otpForms.get('otp')?.valid) {
      presentToast(this.toastController, "Invalid otp", 'warning', 0);
    }
    await showLoading(this.loadingCtrl)

    const otp: string = String(this.otpForms.get('otp')?.value ?? '');
    closeAllToasts(this.toastController);
    this.authService.verify(otp).subscribe({
      next: async (response) => {
        await closeLoading(this.loadingCtrl);
        await closeAllToasts(this.toastController);
        this.ngZone.run(() => {
          this.router.navigateByUrl("/main/home", { replaceUrl: true });
        })
      },
      error: async (error) => {
        console.log("There was an error", error);
        await closeLoading(this.loadingCtrl);
        const errorMsg = error?.error?.errors || "Try again later";
        await presentToast(this.toastController, errorMsg, 'danger', 0)
      },
    })
  }

}
