import { Users } from './../../../models/Users';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Role } from '../../../models/Role';
import { RoleService } from '../../../service/role.service';
import { UsersService } from '../../../service/users.service';

@Component({
  selector: 'app-role-crea-edita',
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
  ],
  templateUrl: './role-crea-edita.component.html',
  styleUrl: './role-crea-edita.component.css'
})
export class RoleCreaEditaComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  roles: Role = new Role();
  mensaje: string = '';
  id: number = 0;
  edicion: boolean = false;
  tiposRol: { value: string; viewValue: string }[] = [
    { value: 'ADMIN', viewValue: 'ADMIN' },
    { value: 'USER', viewValue: 'USER' },
  ];
  listaUsers: Users[] = [];
  idUsuarioSeleccionado: number = 0;

  constructor(
    private cS: RoleService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: UsersService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });
    this.form = this.formBuilder.group({
      id: ['',],
      rol: ['', Validators.required],
      user: ['', Validators.required],
    });
    this.uS.list().subscribe((data) => {
      this.listaUsers = data;
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.roles.id = this.form.value.id;
      this.roles.rol = this.form.value.rol;
      this.roles.user.id = this.form.value.user;


      if (this.edicion) {
        this.cS.update(this.roles).subscribe(() => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      } else {
        this.cS.insert(this.roles).subscribe((data) => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      }
      this.router.navigate(['/components/roles']);
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
          rol: new FormControl(data.rol),
          user: new FormControl(data.user.id),
        });
      });
    }
  }
}
