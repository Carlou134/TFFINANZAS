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
import { Deudores } from '../../../models/Deudores';
import { DeudoresService } from '../../../service/deudores.service';


@Component({
  selector: 'app-deudores-crea-edita',
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
  templateUrl: './deudores-crea-edita.component.html',
  styleUrl: './deudores-crea-edita.component.css'
})
export class DeudoresCreaEditaComponent {
  form: FormGroup = new FormGroup({});
  deudores: Deudores = new Deudores();
  mensaje: string = '';
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private cS: DeudoresService,
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
      ruc: ['', Validators.required],
      razon_social: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }
  aceptar(): void {
    if (this.form.valid) {
      this.deudores.id = this.form.value.id;
      this.deudores.ruc = this.form.value.ruc;
      this.deudores.razon_social = this.form.value.razon_social;
      this.deudores.direccion = this.form.value.direccion;
      this.deudores.telefono = this.form.value.telefono;
      this.deudores.email = this.form.value.email;
      if (this.edicion) {
        this.cS.update(this.deudores).subscribe(() => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      } else {
        this.cS.insert(this.deudores).subscribe((data) => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      }
      this.router.navigate(['/components/deudores']);
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
          ruc: new FormControl(data.ruc),
          razon_social: new FormControl(data.razon_social),
          direccion:new FormControl(data.direccion),
          telefono:new FormControl(data.telefono),
          email:new FormControl(data.email),
        });
      });
    }
  }
}
