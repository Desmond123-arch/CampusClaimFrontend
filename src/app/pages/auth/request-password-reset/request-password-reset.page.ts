import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UmatEmailValidator, passwordStrengthValidator } from 'src/app/validators/registration';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.page.html',
  styleUrls: ['./request-password-reset.page.scss'],
  standalone: false,
})
export class RequestPasswordResetPage implements OnInit {
  myForm: FormGroup = new FormGroup({})
  showPassword = false;

  constructor(public formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, UmatEmailValidator()]],
    })
  }
  requestReset(): void {

    if (this.myForm.invalid) {

      this.myForm.markAllAsTouched();

      return;
    }

    this.router.navigateByUrl('/auth/reset-password');
    const formValue = this.myForm.value;
    const payload = {
      email: formValue.email,
    };
  }


}
