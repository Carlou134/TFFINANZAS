import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, HttpErrorResponse } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './service/login.service';

const authInterceptor = (req: any, next: any) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const loginService = inject(LoginService);

  // No interceptar peticiones de login
  if (req.url.includes('/login')) {
    return next(req);
  }

  if (isPlatformBrowser(platformId)) {
    const token = loginService.getToken();

    if (token) {
      // Asegúrate de que el token tiene el formato correcto
      const authHeader = `Bearer ${token.trim()}`;
      console.debug('Authorization header:', authHeader); // Para debugging

      const authReq = req.clone({
        setHeaders: {
          Authorization: authHeader
        }
      });

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            sessionStorage.clear();
            router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }
  }

  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    )
  ]
};
