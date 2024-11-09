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
import { Bancos } from '../../../models/Bancos';
import { BancosService } from '../../../service/bancos.service';

@Component({
  selector: 'app-bancos-crea-edita',
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
  templateUrl: './bancos-crea-edita.component.html',
  styleUrl: './bancos-crea-edita.component.css'
})
export class BancosCreaEditaComponent {
  form: FormGroup = new FormGroup({});
  bancos: Bancos = new Bancos();
  mensaje: string = '';
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private cS: BancosService,
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
      nombre: ['', Validators.required],
      codigo: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$') // Solo números
      ]],
      ruc: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$') // Solo números
      ]],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.bancos.id = this.form.value.id;
      this.bancos.nombre = this.form.value.nombre;
      this.bancos.codigo = this.form.value.codigo;
      this.bancos.ruc = this.form.value.ruc;
      if (this.edicion) {
        this.cS.update(this.bancos).subscribe(() => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      } else {
        this.cS.insert(this.bancos).subscribe((data) => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      }
      this.router.navigate(['/components/bancos']);
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
          nombre: new FormControl(data.nombre),
          codigo: new FormControl(data.codigo, [
            Validators.required,
            Validators.pattern('^[0-9]*$')
          ]),
          ruc: new FormControl(data.ruc, [
            Validators.required,
            Validators.pattern('^[0-9]*$')
          ]),
        });
      });
    }
  }

  soloNumeros(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
