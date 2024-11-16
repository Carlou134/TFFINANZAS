import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { JwtRequest } from '../../models/JwtRequest';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  username: string = "";
  password: string = "";
  mensaje: string = "";
  hidePassword: boolean = true;
  isLoading: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  login() {
    if (!this.username || !this.password) {
      this.snackBar.open('Por favor complete todos los campos', 'Aviso', { duration: 2000 });
      return;
    }

    this.isLoading = true;
    let request = new JwtRequest();
    request.username = this.username;
    request.password = this.password;

    this.loginService.login(request).subscribe({
      next: (data: any) => {
        sessionStorage.setItem("token", data.jwttoken);
        this.router.navigate(['components/pagina-principal']);
      },
      error: (error) => {
        this.mensaje = "Credenciales incorrectas!!!";
        this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
