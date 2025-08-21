import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ghanaianPhoneNumberValidator, passwordsMatchValidator, passwordStrengthValidator, UmatEmailValidator } from 'src/app/validators/registration';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { IonContent, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';
import { closeLoading, showLoading } from 'src/app/utils/loading';
import { registrationDetails } from 'src/types/user';
import { presentToast } from 'src/app/utils/toast';
import { GoogleSSOService } from 'src/app/service/google-sso.service';
import { UmatVleLoginComponent } from 'src/app/components/umat-vle-login/umat-vle-login.component';
import { FcmService } from 'src/app/service/fcm.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  @ViewChild('content', { static: false }) contentRef!: IonContent;

  showPassword = false;
  showConfirmPassword = false;
  submitted = false;
  public myForm: FormGroup = new FormGroup({});

  constructor(public formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private readonly google: GoogleSSOService,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private ngZone: NgZone,
    private fcmService: FcmService,

    private loadingCtrl: LoadingController) {
    Keyboard.setResizeMode({ mode: KeyboardResize.Native })
    Keyboard.addListener('keyboardDidShow', (info) => {
      const keyboardHeight = info.keyboardHeight;
      this.ensureFieldVisible(keyboardHeight);
    });
  }


  ensureFieldVisible(keyboardHeight: number) {
    const activeElement = document.activeElement as HTMLElement;
    if (!activeElement) return;

    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      name: ['',
        ([
          Validators.minLength(4),
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required])
      ],
      phone: ['', [Validators.required, ghanaianPhoneNumberValidator()]],
      email: ['', [Validators.required, UmatEmailValidator()]],
      password: ['', [
        Validators.required,
        passwordStrengthValidator({
          minLength: 8,
          requireSpecialChar: true,
          requireDigit: true
        })
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordsMatchValidator('password', 'confirmPassword')
    });
  }




  get name() { return this.myForm.get('name'); }
  get phone() { return this.myForm.get('phone'); }
  get email() { return this.myForm.get('email'); }
  get password() { return this.myForm.get('password'); }
  get confirmPassword() { return this.myForm.get('confirmPassword'); }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword
  }
  navigateToSignIn() {
    this.router.navigateByUrl('/auth/login')
  }

  submitForm(): void {
    this.submitted = true;
    if (this.myForm.invalid) {
      // console.log('Form is invalid. Please check the fields.', this.myForm);
      this.myForm.markAllAsTouched();

      return;
    }
    showLoading(this.loadingCtrl);

    const formValue = this.myForm.value;
    const payload: registrationDetails = {
      full_name: formValue.name,
      phone_number: formValue.phone,
      email: formValue.email,
      password: formValue.password,
      confirm_password: formValue.confirmPassword
    };


    this.authService.register(payload).subscribe({
      next: async (response) => {
        await closeLoading(this.loadingCtrl);
        this.myForm.reset();
        await presentToast(this.toastController, "Account created, Please verify your email", 'success', 1500);
        await this.authService.saveLoginDetails(response.accessToken, response.user);
        this.ngZone.run(() => {
          this.router.navigateByUrl("/auth/verify", { replaceUrl: true });
        })
      },
      error: async (error) => {
        await closeLoading(this.loadingCtrl);
        await presentToast(this.toastController, error.error.errors, 'danger', 0)
      }
    })
    // this.myForm.reset();
    // this.router.navigateByUrl('/auth/verify');
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
          await closeLoading(this.loadingCtrl)
          presentToast(this.toastController, 'VLE Login Successful!', 'success', 2000);
          await this.authService.saveLoginDetails(response.accessToken, response.user);
          this.fcmService.initPush()
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


  loginWithGoogle() {
    this.google.startLoginFlow();
  }

  scrollToField(id: string, isLast: boolean = false) {
    if (!this.contentRef) return;

    if (isLast) {
      setTimeout(() => {
        this.contentRef.scrollToBottom(400);
      }, 400);
      return;
    }

    const inputEl = document.getElementById(id);
    if (!inputEl) return;

    setTimeout(() => {
      const rect = inputEl.getBoundingClientRect();

      this.contentRef.getScrollElement().then(scrollEl => {
        const contentScrollTop = scrollEl.scrollTop;

        const scrollToPosition = contentScrollTop + rect.top - 100;

        this.contentRef.scrollToPoint(0, scrollToPosition, 400);
      });
    }, 300);
  }
}

