import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Users } from '../../models/Users';
import { UsersService } from '../../service/users.service';

@Component({
  selector: 'app-actualizar-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterLink,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './actualizar-user.component.html',
  styleUrl: './actualizar-user.component.css'
})
export class ActualizarUserComponent implements OnInit {
  hidePassword: boolean = true;
  form: FormGroup = new FormGroup({});
  users: Users = new Users();
  mensaje: string = '';
  currentUser: Users | null = null;

  constructor(
    private uS: UsersService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario
    this.form = this.formBuilder.group({
      id: [{value: '', disabled: true}], // ID deshabilitado
      username: [{value: '', disabled: true}], // Username deshabilitado
      razon_social: ['', Validators.required],
      ruc: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''] // Opcional para actualización
    });

    // Cargar datos del usuario actual
    this.uS.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.form.patchValue({
          id: user.id,
          username: user.username,
          razon_social: user.razon_social,
          ruc: user.ruc,
          direccion: user.direccion,
          email: user.email
        });
      },
      error: (error) => {
        console.error('Error al obtener usuario:', error);
        this.mensaje = 'Error al cargar los datos del usuario';
      }
    });
  }

  actualizar(): void {
    if (this.form.valid && this.currentUser) {
      // Mantener los datos que no se deben modificar
      const usuarioActualizado: Users = {
        ...this.currentUser,
        razon_social: this.form.value.razon_social,
        ruc: this.form.value.ruc,
        direccion: this.form.value.direccion,
        email: this.form.value.email
      };

      // Solo incluir password si se ha modificado
      if (this.form.value.password) {
        usuarioActualizado.password = this.form.value.password;
      }

      this.uS.update(usuarioActualizado).subscribe({
        next: () => {
          this.router.navigate(['/components/pagina-principal']);
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          this.mensaje = 'Error al actualizar los datos';
        }
      });
    } else {
      this.mensaje = 'Por favor complete todos los campos obligatorios.';
    }
  }

  obtenerControlCampo(nombreCampo: string): AbstractControl {
    const control = this.form.get(nombreCampo);
    if (!control) {
      throw new Error(`Control no encontrado para el campo ${nombreCampo}`);
    }
    return control;
  }
}
