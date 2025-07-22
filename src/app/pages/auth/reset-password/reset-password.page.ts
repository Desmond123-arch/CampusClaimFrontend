import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordStrengthValidator, passwordsMatchValidator } from 'src/app/validators/registration';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false,
})
export class ResetPasswordPage implements OnInit {
  public myForm: FormGroup = new FormGroup({});
  showConfirmPassword = false;
  showPassword = false;
  constructor(public formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
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
  get password() { return this.myForm.get('password'); }
  get confirmPassword() { return this.myForm.get('confirmPassword'); }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword
  }

  resetPassword(): void {

    if (this.myForm.invalid) {
      console.log('Form is invalid. Please check the fields.');

      this.myForm.markAllAsTouched();

      return;
    }
    const formValue = this.myForm.value;
    console.log(this.myForm)
    const payload = {
      password: formValue.password,
      confirm_password: formValue.confirmPassword
    };
    console.log('Clean payload to send to API:', payload);
  }
}
