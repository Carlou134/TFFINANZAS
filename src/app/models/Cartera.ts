import { Bancos } from "./Bancos"
import { Users } from "./Users"

export class Cartera {
  id: number=0
  usuarios: Users = new Users()
  bancos: Bancos = new Bancos()
  fecha_descuento:Date=new Date(Date.now())
  moneda: string=""
  total_valor_nominal: number = 0.0
  total_valor_neto: number = 0.0
  tcea: number = 0.0
  estado: string = ""
}
