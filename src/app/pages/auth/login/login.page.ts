import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
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

  constructor(public formBuilder: FormBuilder, private router: Router) { }

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
  submitForm(): void {

    if (this.myForm.invalid) {
      console.log('Form is invalid. Please check the fields.');

      this.myForm.markAllAsTouched();

      return;
    }

    this.router.navigateByUrl("/home")

    console.log('Form is valid! Submitting...');

    console.log('Raw form data:', this.myForm.value);

    const formValue = this.myForm.value;
    const payload = {
      email: formValue.email,
      password: formValue.password,
    };
    console.log('Clean payload to send to API:', payload);

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