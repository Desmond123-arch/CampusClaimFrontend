import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, LoadingController } from '@ionic/angular';
import { closeLoading, showLoading } from 'src/app/utils/loading';
import { UmatEmailValidator, passwordStrengthValidator } from 'src/app/validators/registration';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  @ViewChild('content', { static: false }) contentRef!: IonContent;
  myForm: FormGroup = new FormGroup({})
  showPassword = false;


  constructor(public formBuilder: FormBuilder, private router: Router,private loadingCtrl: LoadingController,  private ngZone: NgZone) { }

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
    console.log('Form is valid! Submitting...');

    console.log('Raw form data:', this.myForm.value);

    const formValue = this.myForm.value;

    const payload = {
      email: formValue.email,
      password: formValue.password,
    };
    console.log('Clean payload to send to API:', payload);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.ngZone.run(() => {

        this.router.navigateByUrl("/main/home", { replaceUrl: true });
      });
    }
     catch (err) {
      console.log(err);
    } finally {
      closeLoading(this.loadingCtrl)
    }

  }


  navigateToConfirmEmail(){
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