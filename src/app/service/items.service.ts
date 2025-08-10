import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@capacitor/core/types/core-plugins';
import { Preferences } from '@capacitor/preferences';
import { from, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Item } from 'src/types/item';
import { Params } from 'src/types/responses';

export const APPURL = environment.api_url;
@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  constructor() { }
  private http = inject(HttpClient);

  getAllItems(params: HttpParams ): Observable<Item[]> {
   return from(Preferences.get({key: 'auth-token'}))
   .pipe(
    switchMap(tokenResult => {
      const token = tokenResult.value;
      return this.http.get<Item[]>(`${APPURL}/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      })
    })
   )
  }
  getMyItems(params: HttpParams ): Observable<Item[]> {
    return from(Preferences.get({key: 'auth-token'}))
    .pipe(
     switchMap(tokenResult => {
       const token = tokenResult.value;
       return this.http.get<Item[]>(`${APPURL}/items/my-items`, {
         headers: {
           'Authorization': `Bearer ${token}`
         },
         params: params
       })
     })
    )
   }
}
