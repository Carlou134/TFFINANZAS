import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tasas } from '../../../models/Tasas';
import { TasasService } from '../../../service/tasas.service';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router'; // Añade RouterLink
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasas-crea-edita',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterLink,  
  ],
  templateUrl: './tasas-crea-edita.component.html',
  styleUrl: './tasas-crea-edita.component.css'
})
export class TasasCreaEditaComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  tasas: Tasas = new Tasas();
  mensaje: string = '';
  id: number = 0;
  edicion: boolean = false;
  tipoTasas: { value: string; viewValue: string }[] = [
    { value: 'Tasa de interés simple', viewValue: 'Tasa de interés simple' },
    { value: 'Tasa de interés nominal', viewValue: 'Tasa de interés nominal' },
    { value: 'Tasa de interés efectiva', viewValue: 'Tasa de interés efectiva' },
  ];

  tipoCapitalizacion: { value: string; viewValue: string }[] = [
    { value: 'Anual', viewValue: 'Anual' },
    { value: 'Semestral', viewValue: 'Semestral' },
    { value: 'Cuatrimestral', viewValue: 'Cuatrimestral' },
    { value: 'Trimestral', viewValue: 'Trimestral' },
    { value: 'Bimestral', viewValue: 'Bimestral' },
    { value: 'Mensual', viewValue: 'Mensual' },
    { value: 'Diaria', viewValue: 'Diaria' },
  ];


  constructor(
    private tS: TasasService,
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
      tipo_tasa: ['', Validators.required],
      valor_tasa: ['', Validators.required],
      periodo_tasa: ['', [Validators.required]],
    });
  }
  aceptar(): void {
    if (this.form.valid) {
      this.tasas.id = this.form.value.id;
      this.tasas.tipo_tasa = this.form.value.tipo_tasa;
      this.tasas.valor_tasa = this.form.value.valor_tasa;
      this.tasas.periodo_tasa = this.form.value.periodo_tasa;
      if (this.edicion) {
        this.tS.update(this.tasas).subscribe(() => {
          this.tS.list().subscribe((data) => {
            this.tS.setList(data);
          });
        });
      } else {
        this.tS.insert(this.tasas).subscribe((data) => {
          this.tS.list().subscribe((data) => {
            this.tS.setList(data);
          });
        });
      }
      this.router.navigate(['/components/tasas']);
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
      this.tS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id: new FormControl(data.id),
          tipo_tasa: new FormControl(data.tipo_tasa),
          valor_tasa: new FormControl(data.valor_tasa),
          periodo_tasa:new FormControl(data.periodo_tasa),
        });
      });
    }
  }
}
