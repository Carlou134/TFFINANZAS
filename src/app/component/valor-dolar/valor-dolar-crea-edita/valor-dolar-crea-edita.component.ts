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
import { ValorDolar } from '../../../models/ValorDolar';
import { ValordolarService } from '../../../service/valordolar.service';

@Component({
  selector: 'app-valor-dolar-crea-edita',
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
  templateUrl: './valor-dolar-crea-edita.component.html',
  styleUrl: './valor-dolar-crea-edita.component.css'
})
export class ValorDolarCreaEditaComponent {
  form: FormGroup = new FormGroup({});
  dolares: ValorDolar = new ValorDolar();
  mensaje: string = '';
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private cS: ValordolarService,
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
      id: [''],
      valor_dolar: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),  // Solo números
      ]],
      fecha_registro: [null, Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.dolares.id = this.form.value.id;
      this.dolares.valor_dolar = this.form.value.valor_dolar;
      this.dolares.fecha_registro = this.form.value.fecha_registro;
      if (this.edicion) {
        this.cS.update(this.dolares).subscribe(() => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      } else {
        this.cS.insert(this.dolares).subscribe((data) => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      }
      this.router.navigate(['/components/valor-dolar']);
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
          valor_dolar: new FormControl(data.valor_dolar, [
            Validators.required,
            Validators.pattern('^[0-9]*$')
          ]),
          razon_social: new FormControl(data.fecha_registro, Validators.required),
        });
      });
    }
  }

}
