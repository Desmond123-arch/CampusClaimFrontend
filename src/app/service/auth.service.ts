import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Config } from '@ionic/angular';
import { registrationDetails, User } from 'src/types/user';
import { Preferences } from '@capacitor/preferences';
import { AuthResponse } from 'src/types/responses';
import { from, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode'; // Corrected import for jwt-decode
import { HttpContextToken } from '@angular/common/http';

const APPURL = environment.api_url;
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);
@Injectable({
  providedIn: 'root',
})

export class AuthService {

  constructor() { }

  private http = inject(HttpClient);
  login(email: string, password: string) {
    const response = this.http.post<AuthResponse>(`${APPURL}/auth/login`, { email, password }, {
      withCredentials: true
      , context: new HttpContext().set(SKIP_AUTH, true)
    });
    return response;
  }

  register(data: registrationDetails) {
    const response = this.http.post<AuthResponse>(`${APPURL}/auth/register`, data, { withCredentials: true });
    return response;
  }
  loginVle(username: string, password: string) {
    const response = this.http.post<AuthResponse>(`${APPURL}/auth/school-login`, { username, password }, { withCredentials: true });
    return response;
  }
  getNewTokens() {
    const response = this.http.get(`${APPURL}/auth/refresh-token`, {
      withCredentials: true,
      context: new HttpContext().set(SKIP_AUTH, true)
    }
      ,)
    return response
  }

  async logout() {
    await Preferences.remove({
      key: 'auth-token',
    });

    await Preferences.remove({
      key: 'name',
    })
    await Preferences.remove({
      key: 'email',
    })
    await Preferences.remove({
      key: 'phone',
    })
    await Preferences.remove({
      key: 'profile_image',
    })
  }

  verify(otp: string) {
    return from(Preferences.get({ key: 'auth-token' }))
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
  resendOtp() {
    return from(Preferences.get({ key: 'auth-token' }))
      .pipe(
        switchMap(tokenResult => {
          const token = tokenResult.value;
          return this.http.post(`${APPURL}/auth/reset-password-resend`, {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            responseType: 'text',
          })
        })
      )
  }

  async saveLoginDetails(accessToken: string, user: User) {
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

    // Decode JWT to extract user ID and save it
    try {
      const decodedToken: any = jwtDecode(accessToken);
      const userId = decodedToken.sub || decodedToken.id; // Assuming 'sub' or 'id' claim for user ID
      if (userId) {
        await Preferences.set({
          key: 'user-id',
          value: userId
        });
      }
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
  }

}
