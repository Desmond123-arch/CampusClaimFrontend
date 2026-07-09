import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton, IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-umat-vle-login',
  templateUrl: './umat-vle-login.component.html',
  styleUrls: ['./umat-vle-login.component.scss'],
  standalone: true,
  imports: [IonIcon,
    ReactiveFormsModule,
    IonContent,
  ],
})
export class UmatVleLoginComponent implements OnInit {

  loginForm!: FormGroup;
  showPassword: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.modalCtrl.dismiss(this.loginForm.value, 'confirm');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword() {
    this.modalCtrl.dismiss(null, 'forgot-password');
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}