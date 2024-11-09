import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Cartera } from '../models/Cartera';

const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class CarteraService {

  private url = `${base_url}/cartera`;
  private listaCambio = new Subject<Cartera[]>();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = sessionStorage.getItem('token') || '';
    }
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  list() {
    return this.http.get<Cartera[]>(this.url, {
      headers: this.getHeaders()
    });
  }

  insert(ca: Cartera) {
    return this.http.post(this.url, ca, {
      headers: this.getHeaders()
    });
  }

  setList(listaNueva: Cartera[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Cartera>(`${this.url}/${id}`, {
      headers: this.getHeaders()
    });
  }

  update(c: Cartera) {
    return this.http.put(this.url, c, {
      headers: this.getHeaders()
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // En cartera.service.ts
  listMiCartera() {
    return this.http.get<Cartera[]>(`${this.url}/listar/carteraporusuario`, {
      headers: this.getHeaders()
    });
  }

  getDiasCartera(idCartera: number) {
    return this.http.get<Date[]>(`${this.url}/dias-cartera/${idCartera}`, {
      headers: this.getHeaders()
    });
  }
}
