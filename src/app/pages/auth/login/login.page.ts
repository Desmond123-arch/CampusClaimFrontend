import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, LoadingController, ToastController, ToastOptions } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';
import { closeLoading, showLoading } from 'src/app/utils/loading';
import { UmatEmailValidator, passwordStrengthValidator } from 'src/app/validators/registration';
import { Toast } from '@capacitor/toast'
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  @ViewChild('content', { static: false }) contentRef!: IonContent;
  myForm: FormGroup = new FormGroup({})
  showPassword = false;
  showToast = false;


  constructor(public formBuilder: FormBuilder, private router: Router, private loadingCtrl: LoadingController, private ngZone: NgZone, private authService: AuthService, private toastController: ToastController) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, UmatEmailValidator()]],
      password: ['', [
        Validators.required,
        passwordStrengthValidator({
          minLength: 8,
          requireSpecialChar: true,
          requireDigit: true
        })]]
    })
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  navigateToSignUp() {
    this.router.navigateByUrl('/auth/register')
  }


  async submitForm(): Promise<void> {
    if (this.myForm.invalid) {
      console.log('Form is invalid. Please check the fields.');
      console.log(this.myForm.errors)
      this.myForm.markAllAsTouched();

      return;
    }

    showLoading(this.loadingCtrl);

    const formValue = this.myForm.value;

    const payload = {
      email: formValue.email,
      password: formValue.password,
    };
    this.authService.login(payload.email, payload.password).subscribe({
      next: async (response) => {
        console.log('Login success:', response);
        closeLoading(this.loadingCtrl)
        this.ngZone.run(() => {
          console.log("Navigating to home")
          this.router.navigateByUrl("/main/home", { replaceUrl: true });
        });
        await this.presentToast("Login Succesful", 'success', 1500)
        this.showToast = false;
        this.authService.saveLoginDetails(response.accessToken, response.user)
      },
      error: async (error) => {
        closeLoading(this.loadingCtrl);
        this.showToast = true;
        await this.presentToast(error.error.errors, 'danger', 0);
      }
    });
  }
  async presentToast(message: string, color: ToastOptions["color"], duration: number) {
    const existingToast = await this.toastController.getTop();
    if (existingToast) {
      await existingToast.dismiss();
    }
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top',
      animated: true,
      color: color,
    });
    await toast.present();
  }

  async closeAllToasts() {
    let toast = await this.toastController.getTop();
    while (toast) {
      await toast.dismiss();
      toast = await this.toastController.getTop();
    }
  }
  

  navigateToConfirmEmail() {
    this.router.navigateByUrl('/auth/request-password-reset');
  }
  scrollToField(id: string) {
    if (this.contentRef) return;

    const inputEl = document.getElementById(id)
    if (!inputEl) return;

    setTimeout(() => {
      const rect = inputEl.getBoundingClientRect();

      this.contentRef.getScrollElement().then(scrollEl => {
        const contentScrollTop = scrollEl.scrollTop;

        const scrollToPosition = contentScrollTop + rect.top - 100;

        this.contentRef.scrollToPoint(0, scrollToPosition, 300);
      });
    }, 300);
  }
}