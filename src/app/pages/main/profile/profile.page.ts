import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';
import { ItemsService } from 'src/app/service/items.service';
import { UserService } from 'src/app/service/user.service';
import { presentToast } from 'src/app/utils/toast';
import { ghanaianPhoneNumberValidator, UmatEmailValidator } from 'src/app/validators/registration';
import { Item } from 'src/types/item';
import { User } from 'src/types/user';
import { ChangePasswordComponent } from 'src/app/components/change-password/change-password.component';
import { ThemeService } from 'src/app/service/theme.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {


  status = ["Lost", "Found", "Claimed"]
  currentStatus = "Lost"
  mode = localStorage.getItem('theme') || 'light'
  updateForms: FormGroup = new FormGroup({});
  items: Item[] = []
  user: any = {}
  constructor(public formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private themeService: ThemeService,
    public router: Router,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private itemService: ItemsService,
    private modalController: ModalController,
    // private keyboard: Keyboard
  ) { }



  async ngOnInit() {
    this.updateForms = this.formBuilder.group({
      name: ['',
        ([
          Validators.minLength(4),
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required])
      ],
      phone_number: ['', [Validators.required, ghanaianPhoneNumberValidator()]],
      email: ['', [Validators.required, UmatEmailValidator()]],
    })
    await this.getUserDetails()
    this.patchFormValues();
    this.getMyItems(this.currentStatus)
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
    this.getMyItems(this.currentStatus)
  }
  async changeTheme() {
    this.mode = this.mode === 'dark' ? "light" : "dark";
    localStorage.setItem('theme', this.mode)
    if (this.mode == 'light') {
      await this.themeService.enableLight();
    } else {   
      await this.themeService.enableDark();
    }

  }
  async resetPassword() {
    const ismobile = window.innerWidth > 768;
    const modal = await this.modalController.create({
      component: ChangePasswordComponent,
      cssClass: 'change-password',
      breakpoints: [0.5, 1],
      initialBreakpoint: ismobile? 0.5: 1,
      handle: true
    });
    return await modal.present();
  }
  deleteAcount() {
    throw new Error('Method not implemented.');
  }
  async signOut() {
    await this.authService.logout()
    await this.router.navigateByUrl("/auth/login");
  }

  async updateDetails() {
    if (this.updateForms.valid) {
      const formData = this.updateForms.value;

      const loading = await this.loadingCtrl.create({
        message: 'Updating profile...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        const response = await this.userService.updateProfile({
          full_name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email
        }).toPromise();


        await Preferences.set({ key: 'name', value: formData.name });
        await Preferences.set({ key: 'phone', value: formData.phone_number });
        await Preferences.set({ key: 'email', value: formData.email });

        this.user.full_name = formData.name;
        this.user.phone_number = formData.phone;
        this.user.email = formData.email;
        await loading.dismiss();
        await presentToast(this.toastController, 'Profile updated successfully!', 'success', 2000);
        this.updateForms.markAsPristine();
      } catch (error: any) {
        await loading.dismiss();
        let errorMessage = 'Failed to update profile. Please try again.';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        }
        await presentToast(this.toastController, errorMessage, 'danger', 3000);
      }

    } else {
      this.updateForms.markAllAsTouched();

      await presentToast(this.toastController, 'Please fix the form errors before submitting.', 'warning', 2000);
    }
  }

  private patchFormValues() {
    this.updateForms.patchValue({
      name: this.user.full_name || '',
      phone_number: this.user.phone_number || '',
      email: this.user.email || ''
    });

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
  async getMyItems(status: string) {
    const params = new HttpParams()
      .set('status', status)
      .set('limit', '3');

    this.itemService.getMyItems(params).subscribe({
      next: (response: any) => {
        this.items = response.data.rows;
      },
      error: async (error: any) => {
        // console.log(error);
        await presentToast(this.toastController, "Error while fetching items, please try again", 'primary', 1500);
      }
    })
  }
}
