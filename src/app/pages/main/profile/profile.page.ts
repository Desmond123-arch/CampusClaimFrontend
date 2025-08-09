import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { User } from 'src/types/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {

  status = ["Lost", "Found", "Claimed"]
  currentStatus = "Lost"
  mode = "Light"

  user: any = {}
  constructor() { }

  ngOnInit() {
    this.getUserDetails()

  }

  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
    },
  ];

  changeCurrentStatus(status: string) {
    this.currentStatus = status;
  }
  changeTheme() {
    this.mode = this.mode === 'Light' ? "Dark" : "Light";
    throw new Error('Method not implemented.');
  }
  resetPassword() {
    throw new Error('Method not implemented.');
  }
  deleteAcount() {
    throw new Error('Method not implemented.');
  }
  signOut() {
    throw new Error('Method not implemented.');
  }

  async getUserDetails() {
    this.user.full_name = (await Preferences.get({ key: "name" })).value!
    this.user.phone_number = (await Preferences.get({ key: 'phone' })).value!
    this.user.profile_image = (await Preferences.get({ key: 'profile_image' })).value!
    this.user.email = (await Preferences.get({ key: "email" })).value!

    if (this.user.profile_image == "") {
      this.user.profile_image = `https://ui-avatars.com/api/?name=${this.user.full_name.split(" ").join("+")}`
    }
  }
}
