import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { IonContent, LoadingController, ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';
import { closeLoading, showLoading } from 'src/app/utils/loading';
import { UmatEmailValidator, passwordStrengthValidator } from 'src/app/validators/registration';
import { Toast } from '@capacitor/toast'
import { closeAllToasts, presentToast } from 'src/app/utils/toast';
import { FcmService } from 'src/app/service/fcm.service';
import { GoogleSSOService } from 'src/app/service/google-sso.service';
import { async } from 'rxjs';
import { UmatVleLoginComponent } from 'src/app/components/umat-vle-login/umat-vle-login.component';

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


  constructor(public formBuilder: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController,
    private ngZone: NgZone,
    private authService: AuthService,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private fcmService: FcmService,
    private readonly google: GoogleSSOService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        closeAllToasts(this.toastController);
      }
    });
  }

  async ngOnInit() {
    if (window.location.hash.includes('id_token') ||
      window.location.hash.includes('access_token') ||
      window.location.search.includes('code=')) {
      await showLoading(this.loadingCtrl)
      this.google.handleGoogleCallback().subscribe({
        next: async (res) => {
          await closeLoading(this.loadingCtrl)
          console.log(res.accessToken, res.user)
          this.fcmService.initPush()
          await this.authService.saveLoginDetails(res.accessToken, res.user)
          presentToast(this.toastController, "Login Successfull", "success", 2000)

          setTimeout(() => {
            this.ngZone.run(async () => {
              try {
                window.history.replaceState({}, document.title, '/auth/login');

                const success = await this.router.navigate(['/main/home'], { replaceUrl: true });
                console.log('Navigation success:', success);
                this.fcmService.initPush()
                if (!success) {
                  console.log('Using fallback navigation');
                  window.location.assign('/main/home');
                }
              } catch (error) {
                console.error('Navigation error:', error);
                window.location.assign('/main/home');
              }
            });
          }, 500);
        },
        error: async (err) => {
          console.log("An error occured")
          await closeLoading(this.loadingCtrl);
          presentToast(this.toastController, err.error.errors, "danger", 2000)
          console.error("Google login error:", err);
        }
      });
    }
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

  loginWithGoogle() {
    this.google.startLoginFlow();
  }

  async submitForm(): Promise<void> {
    if (this.myForm.invalid) {
      // console.log('Form is invalid. Please check the fields.');
      // console.log(this.myForm.errors)
      this.myForm.markAllAsTouched();
      return;
    }

    await showLoading(this.loadingCtrl);

    const formValue = this.myForm.value;

    const payload = {
      email: formValue.email,
      password: formValue.password,
    };
    this.authService.login(payload.email, payload.password).subscribe({
      next: async (response) => {
        await closeLoading(this.loadingCtrl)
        this.fcmService.initPush()
        await presentToast(this.toastController, "Login Succesful", 'success', 1500)
        this.showToast = false;
        await this.authService.saveLoginDetails(response.accessToken, response.user)
        await this.router.navigate(['/main/home'], { replaceUrl: true });
      },
      error: async (error) => {
        await closeLoading(this.loadingCtrl);
        this.showToast = true;

        if (!error.error.errors) {
          error.error.errors = "An error occured, Please try again later"
        }
        await presentToast(this.toastController, error.error.errors, 'danger', 0);
        await closeLoading(this.loadingCtrl);
      }
    });
  }


  async loginWithUmat() {
    const modal = await this.modalCtrl.create({
      component: UmatVleLoginComponent,
      cssClass: 'login-modal',
      backdropDismiss: true,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      await showLoading(this.loadingCtrl)
      this.authService.loginVle(data.username, data.password).subscribe({

        next: async (response) => {
          await closeLoading(this.loadingCtrl);
          this.fcmService.initPush()
          presentToast(this.toastController, 'VLE Login Successful!', 'success', 2000);
          await this.authService.saveLoginDetails(response.accessToken, response.user)
          this.router.navigate(['/main/home']);
        },
        error: async (err) => {
          await closeLoading(this.loadingCtrl)
          presentToast(this.toastController, 'VLE Login Failed', "danger", 2000);
        }
      });

    } else if (role === 'forgot-password') {
      console.log('User clicked "Lost password?". You can navigate to a reset page here.');
    } else {
      console.log('Modal was cancelled or dismissed.');
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