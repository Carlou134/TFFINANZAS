import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { JwtRequest } from '../models/JwtRequest';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  login(request: JwtRequest) {
    return this.http.post("https://tf-finanzas-435183ef79db.herokuapp.com/login", request).pipe(
      tap((response: any) => {
        if (isPlatformBrowser(this.platformId) && response.token) {
          // Guarda el token asegurándose de que esté limpio
          sessionStorage.setItem("token", response.token.trim());
        }
      })
    );
  }

  verificar() {
    if (isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem("token");
      if (token) {
        // Verifica que el token tenga el formato correcto
        try {
          const helper = new JwtHelperService();
          return !helper.isTokenExpired(token);
        } catch (error) {
          console.error('Error al verificar token:', error);
          return false;
        }
      }
    }
    return false;
  }

  showRole() {
    if (isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return null;
      }
      try {
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(token);
        return decodedToken?.role;
      } catch (error) {
        console.error('Error al decodificar token:', error);
        return null;
      }
    }
    return null;
  }

  // Método para obtener el token actual
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem("token");
    }
    return null;
  }
}
