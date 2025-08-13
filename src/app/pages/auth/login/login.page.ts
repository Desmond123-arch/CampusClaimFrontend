import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { IonContent, LoadingController, ToastController, ToastOptions } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';
import { closeLoading, showLoading } from 'src/app/utils/loading';
import { UmatEmailValidator, passwordStrengthValidator } from 'src/app/validators/registration';
import { Toast } from '@capacitor/toast'
import { closeAllToasts, presentToast } from 'src/app/utils/toast';

//NOTE: Modify the api to use check if the user is verified before redirecting
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


  constructor(public formBuilder: FormBuilder, private router: Router, private loadingCtrl: LoadingController, private ngZone: NgZone, private authService: AuthService, private toastController: ToastController) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        closeAllToasts(this.toastController);
      }
    });
  }

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
      // console.log('Form is invalid. Please check the fields.');
      // console.log(this.myForm.errors)
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
        // console.log('Login success:', response);
        await closeLoading(this.loadingCtrl)
        // this.ngZone.run(async () => {
        //   console.log("Navigating to home")
        //   await this.router.navigateByUrl("/main/home", { replaceUrl: true });
        // });
        await presentToast(this.toastController, "Login Succesful", 'success', 1500)
        this.showToast = false;
        await this.authService.saveLoginDetails(response.accessToken, response.user)
        await this.router.navigate(['/main/home'], { replaceUrl: true });
      },
      error: async (error) => {
        closeLoading(this.loadingCtrl);
        this.showToast = true;

        if (!error.error.errors) {
          error.error.errors = "An error occured, Please try again later"
        }
        await presentToast(this.toastController,error.error.errors, 'danger', 0);
      }
    });
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