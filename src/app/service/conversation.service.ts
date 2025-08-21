import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private apiUrl = environment.api_url;

  constructor(private http: HttpClient) { }

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const token = await Preferences.get({ key: 'auth-token' });
    let headers = new HttpHeaders();
    if (token.value) {
      headers = headers.set('Authorization', `Bearer ${token.value}`);
    }
    return headers;
  }

  async getConversations(): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/messages/convo`, { headers });
  }

  async getMessages(userId: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/messages/${userId}`, { headers });
  }
} 