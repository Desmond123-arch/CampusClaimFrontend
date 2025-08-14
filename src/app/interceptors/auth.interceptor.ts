import { HttpErrorResponse, HttpEvent, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { HttpResponse } from '@capacitor/core';
import { catchError, from, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.endsWith('/auth/login') && !req.url.endsWith('/auth/register') && !req.url.endsWith('/auth/reset-password-request')) {
        return authService.getNewTokens().pipe(
          switchMap((newTokens: any) => {
            return from(Preferences.set({ key: 'auth-token', value: newTokens.accessToken })).pipe(
              switchMap(() => {
                const clonedReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newTokens.accessToken}` }
                });
                return next(clonedReq);
              })
            )
          }),
          catchError(refreshError => {
            console.log(refreshError)
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    }),
  )
};
