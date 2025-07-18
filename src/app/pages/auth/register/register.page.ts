import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {

  showPassword = false;
  showConfirmPassword = false;
  constructor() {
  }

  ngOnInit() {
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPassword(){
    this.showConfirmPassword = !this.showConfirmPassword
  }
}
