import { Component, OnInit } from '@angular/core';
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

  user: User = {
    "id": "60f36a54-72b0-4c2b-b265-a8749f8045b1",
    "full_name": "Desmond Mends",
    "email": "ce-domends6421@st.umat.edu.gh",
    "phone_number": "+2233444111",
    "profile_image": "",
    "is_verified": false
  }
  constructor() { }

  ngOnInit() {
    if (this.user.profile_image == "") {
      this.user.profile_image = `https://ui-avatars.com/api/?name=${this.user.full_name.split(" ").join("+")}`
    }
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

}
