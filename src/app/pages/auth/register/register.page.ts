import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ghanaianPhoneNumberValidator, passwordsMatchValidator, passwordStrengthValidator, UmatEmailValidator } from 'src/app/validators/registration';
import { Keyboard } from '@capacitor/keyboard';
import { IonContent } from '@ionic/angular';
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

  constructor(public formBuilder: FormBuilder, private router: Router) {
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
      console.log('Form is invalid. Please check the fields.');

      this.myForm.markAllAsTouched();

      return;
    }

    console.log('Form is valid! Submitting...');

    console.log('Raw form data:', this.myForm.value);

    const formValue = this.myForm.value;
    const payload = {
      name: formValue.name,
      phone: formValue.phone,
      email: formValue.email,
      password: formValue.password,
      confirm_password: formValue.confirmPassword
    };

    console.log('Clean payload to send to API:', payload);
    // this.myForm.reset();
    // this.router.navigateByUrl('/auth/verify');
  }

  scrollToField(id: string, isLast: boolean = false) {
    if (!this.contentRef) return;

    if (isLast) {
      setTimeout(() => {
        this.contentRef.scrollToBottom(300);
      }, 300);
      return;
    }

    const inputEl = document.getElementById(id);
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
