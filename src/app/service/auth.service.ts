import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Config } from '@ionic/angular';
import { User } from 'src/types/user';
import { Preferences } from '@capacitor/preferences';
import { LoginResponse } from 'src/types/responses';

export const APPURL = ' http://127.0.0.1:3000';
@Injectable({
  providedIn: 'root',
})

export class AuthService {

  constructor() { }
  private http = inject(HttpClient);
  login(email: string, password: string) {
    const response = this.http.post<LoginResponse>(`${APPURL}/auth/login`, {email, password});
    return response;
  }

  async saveLoginDetails(accessToken: string, user:User) {
    //FIXME: This can be made cleaner
    await Preferences.set({
      key: 'auth-token', 
      value: accessToken
    });

    await Preferences.set({
      key: 'name',
      value: user.full_name
    })
    await Preferences.set({
      key: 'email',
      value: user.email
    })
    await Preferences.set({
      key: 'phone',
      value: user.phone_number
    })
    await Preferences.set({
      key: 'profile_image',
      value: user.profile_image,
    })
  }
}
