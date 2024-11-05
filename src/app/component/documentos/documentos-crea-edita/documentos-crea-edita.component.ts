import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Documentos } from '../../../models/Documentos';
import { Deudores } from '../../../models/Deudores';
import { DocumentosService } from '../../../service/documentos.service';
import { DeudoresService } from '../../../service/deudores.service';

@Component({
  selector: 'app-documentos-crea-edita',
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
  templateUrl: './documentos-crea-edita.component.html',
  styleUrl: './documentos-crea-edita.component.css'
})
export class DocumentosCreaEditaComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  documentos: Documentos = new Documentos();
  mensaje: string = '';
  id: number = 0;
  edicion: boolean = false;
  tiposDocumento: { value: string; viewValue: string }[] = [
    { value: 'FACTURA', viewValue: 'FACTURA' },
    { value: 'LETRA', viewValue: 'LETRA' },
  ];
  tiposMoneda: { value: string; viewValue: string }[] = [
    { value: 'SOLES', viewValue: 'SOLES' },
    { value: 'DOLARES', viewValue: 'DOLARES' },
  ];
  tiposTasa: { value: string; viewValue: string }[] = [
    { value: 'NOMINAL', viewValue: 'NOMINAL' },
    { value: 'EFECTIVA', viewValue: 'EFECTIVA' },
  ];
  tiposEstado: { value: string; viewValue: string }[] = [
    { value: 'PENDIENTE', viewValue: 'PENDIENTE' },
    { value: 'APROBADO', viewValue: 'APROBADO' },
  ];
  tiposTasaEfectiva: { value: string; viewValue: string }[] = [
    { value: 'DIARIA', viewValue: 'DIARIA' },
    { value: 'MENSUAL', viewValue: 'MENSUAL' },
    { value: 'ANUAL', viewValue: 'ANUAL' },
  ];
  tiposCapitalizacion: { value: string; viewValue: string }[] = [
    { value: 'DIARIA', viewValue: 'DIARIA' },
    { value: 'QUINCENAL', viewValue: 'QUINCENAL' },
    { value: 'MENSUAL', viewValue: 'MENSUAL' },
    { value: 'BIMESTRAL', viewValue: 'BIMESTRAL' },
    { value: 'TRIMESTRAL', viewValue: 'TRIMESTRAL' },
    { value: 'CUATRIMESTRAL', viewValue: 'CUATRIMESTRAL' },
    { value: 'SEMESTRAL', viewValue: 'SEMESTRAL' },
    { value: 'ANUAL', viewValue: 'ANUAL' },
  ];
  listaDeudores: Deudores[] = [];
  idDeudorSeleccionado: number = 0;
  minFecha: Date = moment().add(1, 'days').toDate();
  minFechaEmision: Date = moment().subtract(1, 'days').toDate(); // Nueva para fecha_emision
  cartera_id: number = 0;

  constructor(
    private cS: DocumentosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private bS: DeudoresService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.cartera_id = +params['cartera_id']; // Capturamos el cartera_id de la URL
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.init();
    });
    this.form = this.formBuilder.group({
      id: ['',],
      cartera: [this.cartera_id], // Asignamos el cartera_id por defecto
      deudor: ['', Validators.required],
      tipo: ['', Validators.required],
      numero_documento: ['', Validators.required],
      valor_nominal: ['', Validators.required],
      fecha_emision: [null, Validators.required],
      fecha_vencimiento: [null, Validators.required],
      moneda: ['', Validators.required],
      valor_tasa: ['', Validators.required],
      tipo_tasa: ['', Validators.required],
      dias_descuento: ['', Validators.required],
      periodo_capitalizacion: ['', Validators.required],
      //sistema
      tasa_efectiva_calculada: [{ value: '', disabled: true }, Validators.required], // Hacemos este campo readonly
      tipo_tasa_efectiva: ['', Validators.required],
      portes: ['', Validators.required],
      comision_estudios: ['', Validators.required],
      comision_desembolso: ['', Validators.required],
      comision_cobranza: ['', Validators.required],
      //Sistema
      igv: [{ value: '', disabled: true }],
      tasa_descuento: ['', Validators.required],
      valor_neto: [{ value: '', disabled: true }],
      estado: ['', Validators.required],
    });

    this.form.get('tipo_tasa')?.valueChanges.subscribe((valor) => {
      const periodoCapControl = this.form.get('periodo_capitalizacion');

      if (valor === 'NOMINAL') {
        periodoCapControl?.setValidators([Validators.required]);
      } else {
        periodoCapControl?.setValidators([Validators.required]); // Mantener los validadores
      }
      periodoCapControl?.updateValueAndValidity();
    });

    // Agregar los observables para el cálculo automático
    const camposParaObservar = ['tasa_descuento', 'tipo_tasa', 'tipo_tasa_efectiva', 'periodo_capitalizacion'];

    camposParaObservar.forEach(campo => {
      this.form.get(campo)?.valueChanges.subscribe(() => {
        this.calcularTasaEfectiva();
      });
    });

    const camposComisiones = ['portes', 'comision_estudios', 'comision_desembolso', 'comision_cobranza'];

    camposComisiones.forEach(campo => {
      this.form.get(campo)?.valueChanges.subscribe(() => {
        this.calcularIGV();
      });
    });

    const camposParaValorNeto = [
      'valor_nominal',
      'tasa_efectiva_calculada',
      'portes',
      'comision_estudios',
      'comision_desembolso',
      'comision_cobranza',
      'igv'
    ];

    camposParaValorNeto.forEach(campo => {
        this.form.get(campo)?.valueChanges.subscribe(() => {
            this.calcularValorNeto();
        });
    });

    this.bS.list().subscribe((data) => {
      this.listaDeudores = data;
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.documentos.id = this.form.value.id;
      this.documentos.cartera.id = this.cartera_id; // Asignamos el cartera_id al documento
      this.documentos.deudor.id = this.form.value.deudor;
      this.documentos.tipo = this.form.value.tipo;
      this.documentos.numero_documento = this.form.value.numero_documento;
      this.documentos.valor_nominal = this.form.value.valor_nominal;
      this.documentos.fecha_emision = this.form.value.fecha_emision;
      this.documentos.fecha_vencimiento = this.form.value.fecha_vencimiento;
      this.documentos.moneda = this.form.value.moneda;
      this.documentos.valor_tasa = this.form.value.valor_tasa;
      this.documentos.tipo_tasa = this.form.value.tipo_tasa;
      this.documentos.dias_descuento = this.form.value.dias_descuento;
      this.documentos.periodo_capitalizacion = this.form.value.periodo_capitalizacion;
      this.documentos.tasa_efectiva_calculada = this.form.get('tasa_efectiva_calculada')?.value;
      this.documentos.tipo_tasa_efectiva = this.form.value.tipo_tasa_efectiva;
      this.documentos.portes = this.form.value.portes;
      this.documentos.comision_estudios = this.form.value.comision_estudios;
      this.documentos.comision_desembolso = this.form.value.comision_desembolso;
      this.documentos.comision_cobranza = this.form.value.comision_cobranza;
      this.documentos.igv = this.form.get('igv')?.value;
      this.documentos.tasa_descuento = this.form.value.tasa_descuento;
      this.documentos.valor_neto = this.form.get('valor_neto')?.value;
      this.documentos.estado = this.form.value.estado;

      if (this.edicion) {
        this.cS.update(this.documentos).subscribe(() => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      } else {
        this.cS.insert(this.documentos).subscribe((data) => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      }
      this.router.navigate(['/components/documentos', this.cartera_id]);
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

  private getDiasSegunPeriodo(periodo: string): number {
    const diasPorPeriodo: { [key: string]: number } = {
      'DIARIA': 1,
      'QUINCENAL': 15,
      'MENSUAL': 30,
      'BIMESTRAL': 60,
      'TRIMESTRAL': 90,
      'CUATRIMESTRAL': 120,
      'SEMESTRAL': 180,
      'ANUAL': 360
    };
    return diasPorPeriodo[periodo] || 0;
  }

  private getDiasSegunTipoTasaEfectiva(tipo: string): number {
    const diasPorTipo: { [key: string]: number } = {
      'DIARIA': 1,
      'MENSUAL': 30,
      'ANUAL': 360
    };
    return diasPorTipo[tipo] || 0;
  }

  private calcularTasaEfectiva(): void {
    const tasaDescuento = this.form.get('tasa_descuento')?.value;
    const tipoTasa = this.form.get('tipo_tasa')?.value;
    const tipoTasaEfectiva = this.form.get('tipo_tasa_efectiva')?.value;
    const periodoCapitalizacion = this.form.get('periodo_capitalizacion')?.value;
    const dias_descuento = this.form.get('dias_descuento')?.value;

    if (!tasaDescuento || !tipoTasa || !tipoTasaEfectiva ||
        (tipoTasa === 'NOMINAL' && !periodoCapitalizacion)) {
      this.form.patchValue({ tasa_efectiva_calculada: '' }, { emitEvent: false });
      return;
    }

    let tasaEfectiva: number;

    if (tipoTasa === 'NOMINAL') {
      // Convertir tasa nominal a efectiva usando la fórmula
      const m = dias_descuento / this.getDiasSegunPeriodo(periodoCapitalizacion); // días de capitalización
      const n = this.getDiasSegunTipoTasaEfectiva(tipoTasaEfectiva) / this.getDiasSegunPeriodo(periodoCapitalizacion); // días según tipo de tasa efectiva
      const TN = tasaDescuento / 100; // convertir porcentaje a decimal

      tasaEfectiva = (Math.pow((1 + (TN / m)), n) - 1) * 100;
    } else {
      // Si ya es efectiva, solo convertir entre períodos
      const tasaDecimal = tasaDescuento / 100;
      const diasOrigen = this.getDiasSegunPeriodo(periodoCapitalizacion);
      const diasDestino = this.getDiasSegunTipoTasaEfectiva(tipoTasaEfectiva);

      tasaEfectiva = ((Math.pow((1 + tasaDecimal), (diasDestino / diasOrigen))) - 1) * 100;
    }

    console.log("Tasa Efectiva: ", tasaEfectiva);

    let tasa_descuento_total: number;
    tasa_descuento_total = ((tasaEfectiva/100)/(1 + (tasaEfectiva/100)));
    // Actualizar el formulario con la tasa calculada (4 decimales)
    this.form.patchValue({
      tasa_efectiva_calculada: Number(tasa_descuento_total.toFixed(4))
    }, { emitEvent: false });
  }

  private calcularIGV(): void {
    const portes = parseFloat(this.form.get('portes')?.value) || 0;
    const comision_estudios = parseFloat(this.form.get('comision_estudios')?.value) || 0;
    const comision_desembolso = parseFloat(this.form.get('comision_desembolso')?.value) || 0;
    const comision_cobranza = parseFloat(this.form.get('comision_cobranza')?.value) || 0;

    const total_comisiones = portes + comision_estudios + comision_desembolso + comision_cobranza;
    const igv = total_comisiones * 0.18; // 18% de IGV

    this.form.patchValue({
      igv: Number(igv.toFixed(4))
    }, { emitEvent: false });
  }

  private calcularValorNeto(): void {
    const valor_nominal = parseFloat(this.form.get('valor_nominal')?.value) || 0;
    const tasa_descuento = parseFloat(this.form.get('tasa_efectiva_calculada')?.value) || 0;
    const portes = parseFloat(this.form.get('portes')?.value) || 0;
    const comision_estudios = parseFloat(this.form.get('comision_estudios')?.value) || 0;
    const comision_desembolso = parseFloat(this.form.get('comision_desembolso')?.value) || 0;
    const comision_cobranza = parseFloat(this.form.get('comision_cobranza')?.value) || 0;
    const igv = parseFloat(this.form.get('igv')?.value) || 0;

    // Valor nominal menos el descuento
    const valor_descontado = valor_nominal * (1 - tasa_descuento);

    // Restar comisiones
    const total_comisiones = portes + comision_estudios + comision_desembolso + comision_cobranza;

    // Valor final
    const valor_neto = valor_descontado - total_comisiones - igv;

    this.form.patchValue({
        valor_neto: Number(valor_neto.toFixed(2))
    }, { emitEvent: false });
  }

  init() {
    if (this.edicion) {
      this.cS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id: new FormControl(data.id),
          cartera: new FormControl(this.cartera_id), // Mantenemos el cartera_id
          deudor: new FormControl(data.deudor.id),
          tipo: new FormControl(data.tipo),
          numero_documento: new FormControl(data.numero_documento),
          valor_nominal: new FormControl(data.valor_nominal),
          fecha_emision: new FormControl(data.fecha_emision),
          fecha_vencimiento: new FormControl(data.fecha_vencimiento),
          moneda: new FormControl(data.moneda),
          valor_tasa: new FormControl(data.valor_tasa),
          tipo_tasa: new FormControl(data.tipo_tasa),
          dias_descuento: new FormControl(data.dias_descuento),
          periodo_capitalizacion: new FormControl(
            data.periodo_capitalizacion,
            [Validators.required]
          ),
          tasa_efectiva_calculada: new FormControl({
            value: data.tasa_efectiva_calculada,
            disabled: true
          }),
          tipo_tasa_efectiva: new FormControl(data.tipo_tasa_efectiva),
          portes: new FormControl(data.portes),
          comision_estudios: new FormControl(data.comision_estudios),
          comision_desembolso: new FormControl(data.comision_desembolso),
          comision_cobranza: new FormControl(data.comision_cobranza),
          igv: new FormControl({ value: data.igv, disabled: true }),
          tasa_descuento: new FormControl(data.tasa_descuento),
          valor_neto: new FormControl({
            value: data.valor_neto,
            disabled: true
          }),
          estado: new FormControl(data.estado),
        });

        // Restablecer los observables después de recrear el formulario
        this.form.get('tipo_tasa')?.valueChanges.subscribe((valor) => {
          const periodoCapControl = this.form.get('periodo_capitalizacion');
          if (valor === 'NOMINAL') {
            periodoCapControl?.enable();
            periodoCapControl?.setValidators([Validators.required]);
          } else {
            periodoCapControl?.disable();
            periodoCapControl?.clearValidators();
            periodoCapControl?.setValue('');
          }
          periodoCapControl?.updateValueAndValidity();
        });

        // Restablecer los observables para el cálculo de tasa efectiva
        const camposParaObservar = ['tasa_descuento', 'tipo_tasa', 'tipo_tasa_efectiva', 'periodo_capitalizacion'];
        camposParaObservar.forEach(campo => {
          this.form.get(campo)?.valueChanges.subscribe(() => {
            this.calcularTasaEfectiva();
          });
        });

        // Calcular la tasa efectiva inicial
        this.calcularTasaEfectiva();


        // Restablecer los observables para el cálculo del IGV
        const camposComisiones = ['portes', 'comision_estudios', 'comision_desembolso', 'comision_cobranza'];
        camposComisiones.forEach(campo => {
          this.form.get(campo)?.valueChanges.subscribe(() => {
            this.calcularIGV();
          });
        });

        // Calcular el IGV inicial
        this.calcularIGV();

        const camposParaValorNeto = [
          'valor_nominal',
          'tasa_efectiva_calculada',
          'portes',
          'comision_estudios',
          'comision_desembolso',
          'comision_cobranza',
          'igv'
       ];

       camposParaValorNeto.forEach(campo => {
        this.form.get(campo)?.valueChanges.subscribe(() => {
            this.calcularValorNeto();
        });
      });

      this.calcularValorNeto();
      });
    }
  }

  //Validaciones
  validarNumero(event: KeyboardEvent): boolean {
    const pattern = /^[0-9.]$/;
    const inputChar = String.fromCharCode(event.charCode);
    const currentValue = (event.target as HTMLInputElement).value;

    if (inputChar === '.') {
      if (currentValue.includes('.') || currentValue === '') {
        event.preventDefault();
        return false;
      }
      return true;
    }

    if (!pattern.test(inputChar)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  formatearNumero(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (value === '.') {
      value = '0.';
    }

    value = value.replace(/[^\d.]|\.(?=.*\.)/g, '');

    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1].length > 2) {
        value = `${parts[0]}.${parts[1].substring(0, 2)}`;
      }
    }

    const patchValue: {[key: string]: any} = {};
    patchValue[controlName] = value;
    this.form.patchValue(patchValue, { emitEvent: true });
  }

  onBlur(event: FocusEvent, controlName: string): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (value === '') {
      value = '0.00';
    } else if (value.endsWith('.')) {
      value = value + '00';
    } else if (!value.includes('.')) {
      value = value + '.00';
    } else if (value.split('.')[1].length === 1) {
      value = value + '0';
    }

    const patchValue: {[key: string]: any} = {};
    patchValue[controlName] = value;
    this.form.patchValue(patchValue, { emitEvent: true });
  }

  validarEntero(event: KeyboardEvent): boolean {
    const pattern = /^[0-9]$/;
    const inputChar = String.fromCharCode(event.charCode);

    // Solo permitir números
    if (!pattern.test(inputChar)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  formatearEntero(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remover cualquier caracter que no sea número
    value = value.replace(/[^\d]/g, '');

    // Remover ceros a la izquierda
    value = value.replace(/^0+/, '') || '0';

    const patchValue: {[key: string]: any} = {};
    patchValue[controlName] = value;
    this.form.patchValue(patchValue, { emitEvent: true });
  }

  onBlurEntero(event: FocusEvent, controlName: string): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Si está vacío, poner 0
    if (value === '') {
      value = '0';
    }

    // Remover ceros a la izquierda
    value = value.replace(/^0+/, '') || '0';

    const patchValue: {[key: string]: any} = {};
    patchValue[controlName] = value;
    this.form.patchValue(patchValue, { emitEvent: true });
  }
}
