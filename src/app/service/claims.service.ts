import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
export const APPURL = environment.api_url;

@Injectable({
  providedIn: 'root'
})

export class ClaimsService {
  constructor() { }
  http = inject(HttpClient)


  submitClaim(data: any, id: string) {
    return from(Preferences.get({ key: 'auth-token' }))
      .pipe(
        switchMap(tokenResult => {
          const token = tokenResult.value;
          return this.http.post(`${APPURL}/claims/${id}`, data, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          })
        })
      )
  }
}
