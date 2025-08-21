import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplashScreenPageModule } from './pages/splash-screen/splash-screen.module';
import { customNavAnimation } from './animations/custom-nav-animation';
import { MainRoutingModule } from './pages/main/main-routing.module';
import { AuthGuardService } from './service/auth-guard.service';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { authInterceptor } from './interceptors/auth.interceptor';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(
    { navAnimation: customNavAnimation }
  ), AppRoutingModule, SplashScreenPageModule, MainRoutingModule,OAuthModule.forRoot() ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthGuardService,
    provideHttpClient(
      withInterceptors([authInterceptor])
    )],
  bootstrap: [AppComponent],
})
export class AppModule {
}
