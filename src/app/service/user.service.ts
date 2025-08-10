import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

export const APPURL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }
  private http = inject(HttpClient);

  updateProfile(profileData: any): Observable<any> {
    console.log(profileData)
    return from(Preferences.get({ key: 'auth-token' }))
      .pipe(
        switchMap(tokenResult => {
          const token = tokenResult.value;
          return this.http.patch<any>(`${APPURL}/profile`, profileData, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        })
      );
  }
}