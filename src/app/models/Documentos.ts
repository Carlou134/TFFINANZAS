import { Cartera } from "./Cartera"
import { Deudores } from "./Deudores"

export class Documentos {
  id: number=0
  cartera: Cartera = new Cartera()
  deudor: Deudores = new Deudores()
  tipo: string=""
  numero_documento: string=""
  valor_nominal: number = 0.0
  fecha_emision:Date=new Date(Date.now())
  fecha_vencimiento:Date=new Date(Date.now())
  moneda: string = ""
  valor_tasa: number = 0.0
  tipo_tasa: string = ""
  dias_descuento: number = 0
  periodo_capitalizacion: string = ""
  //Sistema
  tasa_efectiva_calculada: number = 0.0
  tipo_tasa_efectiva: string = ""
  portes: number = 0.0
  comision_estudios: number = 0.0
  comision_desembolso: number = 0.0
  comision_cobranza: number = 0.0
  //Sistema
  igv: number = 0.0
  tasa_descuento: number = 0.0
  //Sistema
  valor_neto: number = 0.0
  estado: string = ""
}
