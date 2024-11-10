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
import { CarteraService } from '../../../service/cartera.service';

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
    { value: 'DESCONTADO', viewValue: 'DESCONTADO' },
    { value: 'CANCELADO', viewValue: 'CANCELADO' },
  ];
  tiposTasaEfectiva: { value: string; viewValue: string }[] = [
    { value: 'DIARIA', viewValue: 'DIARIA' },
    { value: 'QUINCENAL', viewValue: 'QUINCENAL' },
    { value: 'MENSUAL', viewValue: 'MENSUAL' },
    { value: '45DIAS', viewValue: '45DIAS' },
    { value: 'BIMESTRAL', viewValue: 'BIMESTRAL' },
    { value: 'TRIMESTRAL', viewValue: 'TRIMESTRAL' },
    { value: 'CUATRIMESTRAL', viewValue: 'CUATRIMESTRAL' },
    { value: 'SEMESTRAL', viewValue: 'SEMESTRAL' },
    { value: 'ANUAL', viewValue: 'ANUAL' },
  ];
  tiposCapitalizacion: { value: string; viewValue: string }[] = [
    { value: '', viewValue: '--SELECCIONE--' },
    { value: 'DIARIA', viewValue: 'DIARIA' },
    { value: 'QUINCENAL', viewValue: 'QUINCENAL' },
    { value: 'MENSUAL', viewValue: 'MENSUAL' },
    { value: '45DIAS', viewValue: '45DIAS' },
    { value: 'BIMESTRAL', viewValue: 'BIMESTRAL' },
    { value: 'TRIMESTRAL', viewValue: 'TRIMESTRAL' },
    { value: 'CUATRIMESTRAL', viewValue: 'CUATRIMESTRAL' },
    { value: 'SEMESTRAL', viewValue: 'SEMESTRAL' },
    { value: 'ANUAL', viewValue: 'ANUAL' },
  ];
  listaDeudores: Deudores[] = [];
  idDeudorSeleccionado: number = 0;
  minFecha: Date = moment().add(1, 'days').toDate();
  cartera_id: number = 0;
  fechaDescuento: Date | null = null;

  constructor(
    private cS: DocumentosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private bS: DeudoresService,
    private carteraService: CarteraService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['cartera_id']) {
        this.cartera_id = Number(queryParams['cartera_id']);
        console.log('Cartera ID recibido:', this.cartera_id);
      }

       // Obtener la fecha de descuento de la cartera
       this.carteraService.getDiasCartera(this.cartera_id).subscribe(
        (fechas: Date[]) => {
          if (fechas && fechas.length > 0) {
            this.fechaDescuento = new Date(fechas[0]);
            console.log('Fecha de descuento:', this.fechaDescuento);
          }
        },
        error => {
          console.error('Error al obtener fecha de descuento:', error);
          this.mensaje = 'Error al obtener fecha de descuento de la cartera.';
        }
      );
    });

    this.route.params.subscribe(params => {
      if (params['documento_id']) {
        this.id = Number(params['documento_id']);
        this.edicion = true;
      }
      this.init();
    });

    this.form = this.formBuilder.group({
      id: ['',],
      cartera: [this.cartera_id],
      deudor: ['', Validators.required],
      tipo: ['', Validators.required],
      numero_documento: ['', Validators.required],
      valor_nominal: ['', Validators.required],
      fecha_emision: [null, Validators.required],
      fecha_vencimiento: [null, Validators.required],
      moneda: ['', Validators.required],
      valor_tasa: ['', Validators.required],
      tipo_tasa: ['', Validators.required],
      dias_tasa: ['', Validators.required],
      periodo_capitalizacion: [{ value: '', disabled: false }],
      tasa_efectiva_calculada: [{ value: '', disabled: true }, Validators.required],
      tipo_tasa_efectiva: [{ value: '', disabled: true }],
      portes: ['', Validators.required],
      comision_estudios: ['', Validators.required],
      comision_desembolso: ['', Validators.required],
      comision_cobranza: ['', Validators.required],
      igv: [{ value: '', disabled: true }],
      dias_descuento: [{ value: '', disabled: true }],
      tasa_descuento: [{ value: '', disabled: true }],
      valor_neto: [{ value: '', disabled: true }],
      intereses_calculados: [{ value: '', disabled: true }],
      estado: ['', Validators.required],
    });

    // Observador para tipo_tasa
    this.form.get('tipo_tasa')?.valueChanges.subscribe((valor) => {
      console.log('Cambio en tipo_tasa:', valor);
      const periodoCapControl = this.form.get('periodo_capitalizacion');

      if (valor === 'NOMINAL') {
        periodoCapControl?.enable();
        periodoCapControl?.setValidators([Validators.required]);
        console.log('periodo_capitalizacion habilitado');
      } else {
        periodoCapControl?.disable();
        periodoCapControl?.clearValidators();
        periodoCapControl?.setValue('');
        console.log('periodo_capitalizacion deshabilitado');
      }
      periodoCapControl?.updateValueAndValidity();
    });

    // Observadores para cálculos de tasa
    const camposParaTasa = ['valor_tasa', 'tipo_tasa', 'tipo_tasa_efectiva', 'periodo_capitalizacion'];

    camposParaTasa.forEach(campo => {
      this.form.get(campo)?.valueChanges.subscribe(() => {
        console.log(`Cambio detectado en ${campo}`);
        const tipoTasa = this.form.get('tipo_tasa')?.value;
        const periodoCapControl = this.form.get('periodo_capitalizacion');

        // Verificar si deberíamos calcular basándonos en el estado actual
        if (tipoTasa === 'NOMINAL') {
          if (!periodoCapControl?.disabled && periodoCapControl?.value) {
            console.log('Calculando con tasa NOMINAL - periodo_capitalizacion activo:', periodoCapControl?.value);
            this.calcularTasaEfectiva();
            this.calcularTasaDescuento();
          } else {
            console.log('Periodo capitalización no válido para cálculo:', {
              disabled: periodoCapControl?.disabled,
              value: periodoCapControl?.value
            });
          }
        } else if (tipoTasa === 'EFECTIVA') {
          console.log('Calculando con tasa EFECTIVA');
          this.calcularTasaEfectiva();
          this.calcularTasaDescuento();
        } else {
          console.log('Tipo de tasa no válido para cálculo:', tipoTasa);
        }
      });
    });

    const camposComisiones = ['portes', 'comision_estudios', 'comision_desembolso', 'comision_cobranza'];
    camposComisiones.forEach(campo => {
      this.form.get(campo)?.valueChanges.subscribe(() => {
        this.calcularIGV();
      });
    });

    this.form.get('fecha_vencimiento')?.valueChanges.subscribe((fecha) => {
      console.log('Nueva fecha de vencimiento seleccionada:', fecha);
      if (fecha && this.fechaDescuento) {
        this.calcularDiasDescuento(fecha);
      }
    });

    // Observer para valor neto
    const camposNecesariosParaValorNeto = [
      'valor_nominal',
      'tasa_efectiva_calculada',
      'igv',
      'dias_descuento',
      'portes',
      'comision_estudios',
      'comision_desembolso',
      'comision_cobranza'
    ];

    camposNecesariosParaValorNeto.forEach(campo => {
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
      this.documentos.dias_tasa = this.form.value.dias_tasa;
      this.documentos.periodo_capitalizacion = this.form.value.periodo_capitalizacion;
      this.documentos.tasa_efectiva_calculada = this.form.get('tasa_efectiva_calculada')?.value;
      this.documentos.tipo_tasa_efectiva = this.form.get('tipo_tasa_efectiva')?.value;
      this.documentos.portes = this.form.value.portes;
      this.documentos.comision_estudios = this.form.value.comision_estudios;
      this.documentos.comision_desembolso = this.form.value.comision_desembolso;
      this.documentos.comision_cobranza = this.form.value.comision_cobranza;
      this.documentos.igv = this.form.get('igv')?.value;
      this.documentos.dias_descuento = this.form.get('dias_descuento')?.value;
      this.documentos.tasa_descuento = this.form.get('tasa_descuento')?.value;
      this.documentos.valor_neto = this.form.get('valor_neto')?.value;
      this.documentos.intereses_calculados = this.form.get('intereses_calculados')?.value;
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

      if(this.edicion)
      {
        this.router.navigate(['../../'], { relativeTo: this.route });
      }
      else
      {
        this.router.navigate(['../../', this.cartera_id], { relativeTo: this.route });
      }
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
      '': 0,
      'DIARIA': 1,
      'QUINCENAL': 15,
      'MENSUAL': 30,
      '45DIAS': 45,
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
      'QUINCENAL': 15,
      'MENSUAL': 30,
      '45DIAS': 45,
      'BIMESTRAL': 60,
      'TRIMESTRAL': 90,
      'CUATRIMESTRAL': 120,
      'SEMESTRAL': 180,
      'ANUAL': 360
    };
    return diasPorTipo[tipo] || 0;
  }

  private calcularTasaEfectiva(): void {
    const tasa = this.form.get('valor_tasa')?.value;
    const tipoTasa = this.form.get('tipo_tasa')?.value;
    const diasTasa = this.form.get('dias_tasa')?.value;
    const periodoCapitalizacion = this.form.get('periodo_capitalizacion')?.value;

    // Establecer tipo_tasa_efectiva según diasTasa
    this.form.patchValue({
      tipo_tasa_efectiva: diasTasa
    }, { emitEvent: false });

    const tipoTasaEfectiva = diasTasa; // Usar directamente diasTasa

    if (!tasa || !tipoTasa || !tipoTasaEfectiva ||
        (tipoTasa === 'NOMINAL' && !periodoCapitalizacion)) {
      this.form.patchValue({ tasa_efectiva_calculada: '' }, { emitEvent: false });
      return;
    }

    let tasaEfectiva: number;

    if (tipoTasa === 'NOMINAL') {
      // Convertir tasa nominal a efectiva usando la fórmula
      const m = this.getDiasSegunPeriodo(diasTasa) / this.getDiasSegunPeriodo(periodoCapitalizacion); // días de capitalización
      const n = this.getDiasSegunTipoTasaEfectiva(tipoTasaEfectiva) / this.getDiasSegunPeriodo(periodoCapitalizacion); // días según tipo de tasa efectiva
      const TN = tasa / 100; // convertir porcentaje a decimal

      tasaEfectiva = (Math.pow((1 + (TN / m)), n) - 1) * 100;
    } else {
      // Si ya es efectiva, solo convertir entre períodos
      tasaEfectiva = Number(tasa);
    }

    // Actualizar el formulario con la tasa calculada (4 decimales)
    this.form.patchValue({
      tasa_efectiva_calculada: Number(tasaEfectiva.toFixed(4))
    }, { emitEvent: false });
}

  private calcularTasaDescuento(): void {
    const tasaEfectivaCalculada = this.form.get('tasa_efectiva_calculada')?.value;
    const tipoTasaEfectiva = this.form.get('tipo_tasa_efectiva')?.value; // Cambiado de tipo_tasa a tipo_tasa_efectiva
    const diasDestino = this.form.get('dias_descuento')?.value;

    if (!tasaEfectivaCalculada || !tipoTasaEfectiva || !diasDestino) {
      console.log('Valores faltantes:', {
        tasaEfectiva: tasaEfectivaCalculada,
        tipoTasa: tipoTasaEfectiva,
        dias: diasDestino
      });
      return;
    }

    let tasaEfectivaParaDescuento: number;
    const diasOrigen = this.getDiasSegunTipoTasaEfectiva(tipoTasaEfectiva);

    if (diasOrigen === diasDestino) {
      tasaEfectivaParaDescuento = tasaEfectivaCalculada;
    } else {
      // Si ya es efectiva, solo convertir entre períodos
      const tasaDecimal = tasaEfectivaCalculada / 100;
      tasaEfectivaParaDescuento = ((Math.pow((1 + tasaDecimal), (diasDestino / diasOrigen))) - 1) * 100;
    }

    console.log('tasa efectiva antes del descuento: ', tasaEfectivaParaDescuento);

    // Actualizar el formulario con la tasa calculada (4 decimales)
    let tasaDescuento: number;
    const tasaEfectiva = tasaEfectivaParaDescuento / 100;
    tasaDescuento = ((tasaEfectiva)/(1 + tasaEfectiva)) * 100;

    // Actualizar el formulario con la tasa calculada (4 decimales)
    this.form.patchValue({
      tasa_descuento: Number(tasaDescuento.toFixed(4))
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
    const tasa_descuento = parseFloat(this.form.get('tasa_descuento')?.value) || 0;
    const portes = parseFloat(this.form.get('portes')?.value) || 0;
    const comision_estudios = parseFloat(this.form.get('comision_estudios')?.value) || 0;
    const comision_desembolso = parseFloat(this.form.get('comision_desembolso')?.value) || 0;
    const comision_cobranza = parseFloat(this.form.get('comision_cobranza')?.value) || 0;
    const igv = parseFloat(this.form.get('igv')?.value) || 0;

    // Valor nominal menos el descuento
    const valor_descontado = valor_nominal * (tasa_descuento / 100);
    console.log('valor descontado: ', valor_descontado);

    // Restar comisiones
    const total_comisiones = portes + comision_estudios + comision_desembolso + comision_cobranza;

    // Valor final
    const valor_neto = valor_nominal - valor_descontado - total_comisiones - igv;

    // Calcular intereses (valor_nominal - valor_neto)
    const intereses = valor_nominal - valor_neto;

    // Actualizar el formulario con ambos valores
    this.form.patchValue({
      valor_neto: Number(valor_neto.toFixed(4)),
      intereses_calculados: Number(intereses.toFixed(4))
    }, { emitEvent: false });
  }

  private calcularDiasDescuento(fechaVencimiento: Date): void {
    if (this.fechaDescuento) {
      const fechaVenc = new Date(fechaVencimiento);
      const fechaDesc = new Date(this.fechaDescuento);

      console.log('Fecha de vencimiento:', fechaVenc);
      console.log('Fecha de descuento:', fechaDesc);

      // Normalizar las fechas
      fechaVenc.setHours(0, 0, 0, 0);
      fechaDesc.setHours(0, 0, 0, 0);

      // Calcular la diferencia en días
      const diferencia = fechaDesc.getTime() - fechaVenc.getTime();
      const diasDescuento = Math.ceil(diferencia / (1000 * 3600 * 24));

      console.log('Días de descuento calculados:', diasDescuento);

      // Actualizar el formulario
      this.form.patchValue({
        dias_descuento: Math.max(0, diasDescuento)
      }, { emitEvent: true }); // true para que dispare el cálculo de la tasa de descuento
    }
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
          fecha_emision: new FormControl(moment(data.fecha_emision).startOf('day').toDate()),
          fecha_vencimiento: new FormControl(moment(data.fecha_vencimiento).startOf('day').toDate()),
          moneda: new FormControl(data.moneda),
          valor_tasa: new FormControl(data.valor_tasa),
          tipo_tasa: new FormControl(data.tipo_tasa),
          dias_tasa: new FormControl(data.dias_tasa),
          periodo_capitalizacion: new FormControl(
            data.periodo_capitalizacion,
            [Validators.required]
          ),
          tasa_efectiva_calculada: new FormControl({
            value: data.tasa_efectiva_calculada,
            disabled: true
          }),
          tipo_tasa_efectiva: new FormControl({
            value: data.tipo_tasa_efectiva,
            disabled: true
          }),
          portes: new FormControl(data.portes),
          comision_estudios: new FormControl(data.comision_estudios),
          comision_desembolso: new FormControl(data.comision_desembolso),
          comision_cobranza: new FormControl(data.comision_cobranza),
          igv: new FormControl({ value: data.igv, disabled: true }),
          dias_descuento: new FormControl({
            value: data.dias_descuento,
            disabled: true
          }),
          tasa_descuento: new FormControl({
            value: data.tasa_descuento,
            disabled: true
          }),
          valor_neto: new FormControl({
            value: data.valor_neto,
            disabled: true
          }),
          intereses_calculados: new FormControl({
            value: data.valor_neto,
            disabled: true
          }),
          estado: new FormControl(data.estado),
        });

        // Aplicar estado inicial basado en el tipo de tasa
        const tipoTasaInicial = data.tipo_tasa;
        const periodoCapControl = this.form.get('periodo_capitalizacion');
        if (tipoTasaInicial === 'NOMINAL') {
          periodoCapControl?.enable();
          periodoCapControl?.setValidators([Validators.required]);
        } else {
          periodoCapControl?.disable();
          periodoCapControl?.clearValidators();
          periodoCapControl?.setValue('');
        }
        periodoCapControl?.updateValueAndValidity();

        // Configurar observers para cálculos de tasa
        const camposParaTasa = ['valor_tasa', 'tipo_tasa', 'tipo_tasa_efectiva', 'periodo_capitalizacion'];

        camposParaTasa.forEach(campo => {
          const control = this.form.get(campo);
          if (control) {
            control.valueChanges.subscribe(() => {
              console.log(`Cambio detectado en ${campo} (modo edición)`);
              // Solo calcular si periodo_capitalizacion está activo cuando es requerido
              const tipoTasa = this.form.get('tipo_tasa')?.value;
              const periodoCapControl = this.form.get('periodo_capitalizacion');

              if (tipoTasa === 'NOMINAL' && !periodoCapControl?.disabled) {
                this.calcularTasaEfectiva();
                this.calcularTasaDescuento();
              } else if (tipoTasa === 'EFECTIVA') {
                this.calcularTasaEfectiva();
                this.calcularTasaDescuento();
              }
            });
          }
        });

        // Observer para fecha de vencimiento
      this.form.get('fecha_vencimiento')?.valueChanges.subscribe((fecha) => {
        console.log('Nueva fecha de vencimiento (modo edición):', fecha);
        if (fecha && this.fechaDescuento) {
          this.calcularDiasDescuento(fecha);
        }
      });


        // Restablecer los observables para el cálculo del IGV
        const camposComisiones = ['portes', 'comision_estudios', 'comision_desembolso', 'comision_cobranza'];
        camposComisiones.forEach(campo => {
          this.form.get(campo)?.valueChanges.subscribe(() => {
            this.calcularIGV();
          });
        });

        // Observer para valor neto
        const camposNecesariosParaValorNeto = [
          'valor_nominal',
          'tasa_efectiva_calculada',
          'igv',
          'dias_descuento',
          'portes',
          'comision_estudios',
          'comision_desembolso',
          'comision_cobranza'
        ];

        camposNecesariosParaValorNeto.forEach(campo => {
          this.form.get(campo)?.valueChanges.subscribe(() => {
            this.calcularValorNeto();
          });
        });
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
