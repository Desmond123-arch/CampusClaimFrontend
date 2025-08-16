import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ghanaianPhoneNumberValidator, passwordsMatchValidator, passwordStrengthValidator, UmatEmailValidator } from 'src/app/validators/registration';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { IonContent, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';
import { closeLoading, showLoading } from 'src/app/utils/loading';
import { registrationDetails } from 'src/types/user';
import { presentToast } from 'src/app/utils/toast';
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
    private toastController: ToastController,
    private ngZone: NgZone,
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


  ngOnInit() {
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
