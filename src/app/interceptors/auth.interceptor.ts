import { HttpBackend, HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { HttpResponse } from '@capacitor/core';
import { catchError, from, switchMap, tap, throwError } from 'rxjs';
import { AuthService, SKIP_AUTH } from '../service/auth.service';
import { inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';



//BUG:Edge case where loops runs uncontrollebly for some reason
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.context.get(SKIP_AUTH)) {
        return next(req).pipe(
          catchError((error: HttpErrorResponse) => {
            console.log('SKIP_AUTH route failed:', error);
            authService.logout();
            return throwError(() => error);
          })
        );
      }
      else if (error.status === 401 && !req.url.endsWith('/auth/login') && !req.url.endsWith('/auth/register') && !req.url.endsWith('/auth/reset-password-request')) {
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
            console.log("authInterceptor ran")
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    }),
  )
};
