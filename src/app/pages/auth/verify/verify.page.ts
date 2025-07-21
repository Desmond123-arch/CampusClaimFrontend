import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { otpRequiredLength } from 'src/app/validators/otp';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
  standalone: false
})


export class VerifyPage implements OnInit {
  otpForms:FormGroup = new FormGroup({});
  isSubmitted = false;
  constructor(private loadingCtrl: LoadingController) { }

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
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: 'circles',
    })
    loading.present()
  }

  verifyOTP(){
    if (this.otpForms.get('otp')?.valid) {
      this.showLoading()
    }
    console.log('OTP value:', this.otpForms.get('otp')?.value);
  }

}
