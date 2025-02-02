import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Users } from '../../../models/Users';
import { UsersService } from '../../../service/users.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-users-crea-edita',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './users-crea-edita.component.html',
  styleUrl: './users-crea-edita.component.css'
})
export class UsersCreaEditaComponent {
  hidePassword: boolean = true;
  form: FormGroup = new FormGroup({});
  users: Users = new Users();
  mensaje: string = '';
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private cS: UsersService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });
    this.form = this.formBuilder.group({
      id: ['',],
      username: ['', Validators.required],
      password: ['', Validators.required],
      enabled: [true],
      razon_social: ['', Validators.required],
      ruc: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }
  aceptar(): void {
    if (this.form.valid) {
      this.users.id = this.form.value.id;
      this.users.username = this.form.value.username;
      this.users.password = this.form.value.password;
      this.users.enabled = true;
      this.users.razon_social = this.form.value.razon_social;
      this.users.ruc = this.form.value.ruc;
      this.users.direccion = this.form.value.direccion;
      this.users.email = this.form.value.email;
      if (this.edicion) {
        this.cS.update(this.users).subscribe(() => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      } else {
        this.cS.insert(this.users).subscribe((data) => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      }
      this.router.navigate(['/components/usuarios']);
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
  init() {
    if (this.edicion) {
      this.cS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id: new FormControl(data.id),
          username: new FormControl(data.username),
          password: new FormControl(data.password),
          enabled: new FormControl(data.enabled),
          razon_social: new FormControl(data.razon_social),
          ruc:new FormControl(data.ruc),
          direccion: new FormControl(data.direccion),
          email: new FormControl(data.email),
        });
      });
    }
  }
}
