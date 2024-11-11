import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { ValorDolar } from '../models/ValorDolar';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class ValordolarService {
  private url = `${base_url}/dolar`;
  private listaCambio = new Subject<ValorDolar[]>();

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
    return this.http.get<ValorDolar[]>(this.url, {
      headers: this.getHeaders()
    });
  }

  insert(ca: ValorDolar) {
    return this.http.post(this.url, ca, {
      headers: this.getHeaders()
    });
  }

  setList(listaNueva: ValorDolar[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<ValorDolar>(`${this.url}/${id}`, {
      headers: this.getHeaders()
    });
  }

  update(c: ValorDolar) {
    return this.http.put(this.url, c, {
      headers: this.getHeaders()
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Nuevo método para obtener el último valor del dólar
  getUltimoValor(): Observable<number> {
    return this.http.get<number>(`${this.url}/valor`, {
      headers: this.getHeaders()
    });
  }
}
