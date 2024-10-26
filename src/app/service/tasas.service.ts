import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Tasas } from '../models/Tasas';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const base_url = environment.base;


@Injectable({
  providedIn: 'root'
})
export class TasasService {
  private url = `${base_url}/tasas`;
  private listaCambio = new Subject<Tasas[]>();

  constructor(private http: HttpClient) {}

  list() {
    let token = sessionStorage.getItem('token');

    return this.http.get<Tasas[]>(this.url, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }
  insert(ta: Tasas) {
    return this.http.post(this.url, ta);
  }
  setList(listaNueva: Tasas[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}
