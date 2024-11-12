import { Component, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Importaciones de Material
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Módulos de Material
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'TFFINANZAS';
  role: string = "";

  constructor(
    private loginService: LoginService,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Solo verificamos autenticación si no estamos en rutas públicas
    if (!this.isPublicRoute()) {
      this.checkAuthStatus();
    }
  }

  private isPublicRoute(): boolean {
    const currentPath = this.router.url;
    const publicRoutes = ['/', '/home', '/login', '/register'];
    return publicRoutes.includes(currentPath);
  }

  private checkAuthStatus() {
    if (this.verificar()) {
      this.role = this.loginService.showRole() || '';
    } else {
      this.router.navigate(['/login']);
    }
  }

  cerrar() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.clear();
      this.role = "";
      this.router.navigate(['/login']);
    }
  }

  verificar() {
    if (isPlatformBrowser(this.platformId)) {
      const isValid = this.loginService.verificar();
      if (isValid) {
        this.role = this.loginService.showRole() || '';
      }
      return isValid;
    }
    return false;
  }

  validarRol() {
    if (isPlatformBrowser(this.platformId)) {
      return this.role === 'ADMIN' || this.role === 'USER';
    }
    return false;
  }
}
