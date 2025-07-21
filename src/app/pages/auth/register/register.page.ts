import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ghanaianPhoneNumberValidator, passwordsMatchValidator, passwordStrengthValidator, UmatEmailValidator } from 'src/app/validators/registration';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {

  showPassword = false;
  showConfirmPassword = false;
  public myForm: FormGroup = new FormGroup({});

  constructor(public formBuilder: FormBuilder) {
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
  submitForm(): void {

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
  }
}
