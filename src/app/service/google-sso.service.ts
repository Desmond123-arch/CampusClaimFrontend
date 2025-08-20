import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { from, Observable, Subject, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: "http://localhost:8100/auth/login/",
  clientId: '575250014119-fo867r71h5t4s97lv49lt6imkljnjdoh.apps.googleusercontent.com',
  scope: 'openid profile email',
  responseType: 'id_token token',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  userinfoEndpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
  waitForTokenInMsec: 0,
  useSilentRefresh: true,
  showDebugInformation: true,
  customQueryParams: { prompt: 'select_account' }
}
const APP_URL = environment.api_url

@Injectable({
  providedIn: 'root',
})
export class GoogleSSOService {

  httpClient = inject(HttpClient)
  constructor(private readonly oAuthService: OAuthService) {
    oAuthService.configure(oAuthConfig)
  }

  async initializeLogin() {
    await this.oAuthService.loadDiscoveryDocument();
    await this.oAuthService.tryLoginImplicitFlow();
  }

  startLoginFlow() {
    this.oAuthService.initLoginFlow();
  }

  handleGoogleCallback(): Observable<any> {
    return from(this.oAuthService.tryLogin()).pipe(
      switchMap(() => {
        if (this.oAuthService.hasValidIdToken()) {
          const token = this.oAuthService.getIdToken();
          return this.httpClient.post(`${APP_URL}/auth/google-login`, { token });
        } else {
          return throwError(() => new Error("No valid access token"));
        }
      })
    );
  }

  getIdToken(): string | null {
    return this.oAuthService.getIdToken();
  }

  logout() {
    this.oAuthService.logOut();
  }

  getProfile() {
    return this.oAuthService.getIdentityClaims();
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }
}
