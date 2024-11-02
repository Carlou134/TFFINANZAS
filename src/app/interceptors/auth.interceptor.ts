import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // No interceptamos la petición de login
    if (request.url.includes('/login')) {
      return next.handle(request);
    }

    if (isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem('token');

      if (token) {
        // Clonamos la request y añadimos el header de autorización
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (isPlatformBrowser(this.platformId)) {
            // Limpiamos el sessionStorage si hay error de autenticación
            sessionStorage.clear();
          }
          // Redirigimos al login
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
