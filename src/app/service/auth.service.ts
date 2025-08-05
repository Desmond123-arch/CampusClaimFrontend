import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Config } from '@ionic/angular';
import { registrationDetails, User } from 'src/types/user';
import { Preferences } from '@capacitor/preferences';
import { AuthResponse } from 'src/types/responses';
import { from, switchMap } from 'rxjs';

export const APPURL = ' http://127.0.0.1:3000';
@Injectable({
  providedIn: 'root',
})

export class AuthService {

  constructor() { }
  private http = inject(HttpClient);
  login(email: string, password: string) {
    const response = this.http.post<AuthResponse>(`${APPURL}/auth/login`, {email, password});
    return response;
  }

  register(data: registrationDetails) {
    const response = this.http.post<AuthResponse>(`${APPURL}/auth/register`, data);
    return response;
  }

  verify(otp: string) {
    return from(Preferences.get({key: 'auth-token'}))
    .pipe(
      switchMap(tokenResult => {
        const token = tokenResult.value;
        return this.http.post(`${APPURL}/auth/verify-account`, { code: otp }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }, 
          responseType: 'text',
        })
      })
    )
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
