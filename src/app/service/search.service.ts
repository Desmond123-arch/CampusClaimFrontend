import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, from, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export const APPURL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }
  public latestSearchResults: any = null;
  private searchResultsSubject = new BehaviorSubject<any>(null);
  public searchResults$ = this.searchResultsSubject.asObservable();
  private http = inject(HttpClient);

  searchByImage(image: Blob) {
    const formData = new FormData();
    formData.append('image', image)
    return from(Preferences.get({ key: 'auth-token' }))
      .pipe(
        switchMap(tokenResult => {
          const token = tokenResult.value;
          return this.http.post(`${APPURL}/items/search/image`, formData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            }
          )
        }),
        tap(async (results) => {
          await this.storeSearchResults(results);
          this.searchResultsSubject.next(results)
        })
      )
  }

  searchByText(text: string) {
    const formData = new FormData();
    formData.append('description', text)
    return from(Preferences.get({ key: 'auth-token' }))
      .pipe(
        switchMap(tokenResult => {
          const token = tokenResult.value;
          return this.http.post(`${APPURL}/items/search/text`, formData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            }
          )
        }),
        tap(async (results) => {
          await this.storeSearchResults(results);
          this.searchResultsSubject.next(results)
        })
      )
  }
  

  async storeSearchResults(results: any) {
    await Preferences.set({
      key: 'latest-search-results',
      value: JSON.stringify(results)
    });
  }

  async getStoredSearchResults() {
    const result = await Preferences.get({ key: 'latest-search-results' });
    const parsed = result.value ? JSON.parse(result.value) : null;
    if (parsed && !this.searchResultsSubject.value) {
      this.searchResultsSubject.next(parsed);
    }

    return parsed;
  }


  clearSearchResults() {
    this.latestSearchResults = null;
  }
}
