import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, Observable, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export const APPURL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  constructor() { }

  updateProfile(updates: any): Observable<any> {
    return from(Preferences.get({ key: 'auth-token' }))
      .pipe(
        switchMap(tokenResult => {
          const token = tokenResult.value;
          return this.http.patch<any>(`${APPURL}/profile`, updates, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        })
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    // console.log(currentPassword, newPassword)
    return from(Preferences.get({ key: 'auth-token' })).pipe(
      switchMap(token => {
        if (!token.value) {
          return throwError(() => new Error('No token found'));
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token.value}`);
        const body = { old_password: currentPassword, password: newPassword };
        return this.http.patch(`${APPURL}/auth/change-password`, body, { headers });
      })
    );
  }
  // requestResetPassword()
}